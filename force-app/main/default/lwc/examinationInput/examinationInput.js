import { LightningElement, track, wire } from 'lwc';
import getVoucherList from '@salesforce/apex/ExaminationInputController.getVoucherList';
import { refreshApex } from '@salesforce/apex';

import { updateRecord } from 'lightning/uiRecordApi';
import { deleteRecord } from 'lightning/uiRecordApi';
import VOUID_FIELD from '@salesforce/schema/Voucher__c.Id';
import ASSIGNUSER_FIELD from '@salesforce/schema/Voucher__c.AssignUser__c';
import ASSIGNDATE_FIELD from '@salesforce/schema/Voucher__c.AssignDate__c';

const actions = [
    { label: '編集', name: 'edit', iconName : 'utility:edit' },
    { label: 'バウチャーを返却', name: 'return', iconName : 'utility:resource_absence' }
];

const columns = [
    {label : '決裁番号', fieldName : 'FinalDecisionNumber__c'},
    {label : '決裁日', fieldName : 'FinalDecisionDate__c', type : 'date-local'},
    {label : 'バウチャー番号', fieldName : 'VoucherNumber__c'},
    {label : '対象者', fieldName : 'AssignUser__c'},
    {label : '利用期日', fieldName : 'LimitDate__c', type : 'date-local'},
    {label : '試験', fieldName : 'Exam__c'},
    {label : '受験日', fieldName : 'WillExam__c', type : 'date-local'},
    {label : '合否', fieldName : 'PassOrFail__c'},
    {type : 'action',
     typeAttributes : { rowActions : actions }
    }
];
export default class ExaminationInput extends LightningElement {
    @track voucher;
    @track columns = columns;
    @track rowOffset = 0;
    @track editmode = false;
    @track returnmode = false;
    @track examid;
    @track isSuccess = false;
    @track isError = false;
    @track errordetail;
    wiredVoucherResult;
    voucherid;

    @wire(getVoucherList) wireGetVoucherList(result) {
        this.wiredVoucherResult = result;
        this.voucher = result.data;
    }
    
    handleRowAction(e){
        const row = e.detail.row;
        const actionName = e.detail.action.name;
        this.examid = row.Id;
        switch (actionName) {
            case 'edit':
                this.editmode = true;
                break;
            case 'return':
                this.voucherid = row.Voucher__c;
                this.returnmode = true;
                break;
            default:
                break;
        }
    }

    handleSuccess(e){
        this.isSuccess = true;
        this.isError = false;
        this.editmode = false;
        this.errordetail = undefined;
        
        return refreshApex(this.wiredVoucherResult);
    }

    handleError(e){
        this.editmode = false;
        this.isError = true;
        this.isSuccess = false;
        this.errordetail = e.detail.detail;
    }

    closeModal(){
        this.editmode = false;
    }

    closeSuccessToast(){
        this.isSuccess = false;
    }

    closeErrorToast() {
        this.isError = false;
    }

    closeReturnModal(){
        this.returnmode = false;
    }

    voucherReset(){
        // 受験情報を削除
        deleteRecord(this.examid)
            .then(() => {
            })
            .catch(error => {
                this.returnmode = false;
                this.isError = true;
                this.isSuccess = false;
                this.errordetail = error.body.message;
                return;
            });

        const fields = {};
        fields[VOUID_FIELD.fieldApiName] = this.voucherid;
        fields[ASSIGNUSER_FIELD.fieldApiName] = '';
        fields[ASSIGNDATE_FIELD.fieldApiName] = '';
        const recordInput  = { fields };
        
        updateRecord(recordInput)
            .then( () => {
                this.returnmode = false;
                this.isSuccess = true;
                this.isError = false;
                return refreshApex(this.wiredVoucherResult);
            })
            .catch(error => {
                this.returnmode = false;
                this.isError = true;
                this.isSuccess = false;
                this.errordetail = error.body.message;
            });
    }
}