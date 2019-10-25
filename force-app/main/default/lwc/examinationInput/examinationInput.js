import { LightningElement, track, wire } from 'lwc';
import getVoucherList from '@salesforce/apex/ExaminationInputController.getVoucherList';
import { refreshApex } from '@salesforce/apex';

const actions = [
    { label: '編集', name: 'edit', iconName : 'utility:edit' }
];

const columns = [
    {label : '決裁番号', fieldName : 'FinalDecisionNumber__c'},
    {label : '決裁日', fieldName : 'FinalDecisionDate__c', type : 'date-local'},
    {label : 'バウチャー番号', fieldName : 'VoucherNumber__c'},
    {label : '対象者', fieldName : 'AssignUser__c'},
    {label : '利用期日', fieldName : 'LimitDate__c', type : 'date-local'},
    {label : '試験', fieldName : 'Exam__c'},
    {label : '予定日', fieldName : 'WillExam__c', type : 'date-local'},
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
    @track examid;
    @track isSuccess = false;
    @track isError = false;
    @track errordetail;
    wiredVoucherResult;

    @wire(getVoucherList) wireGetVoucherList(result) {
        this.wiredVoucherResult = result;
        this.voucher = result.data;
    }
    
    handleRowAction(e){
        const row = e.detail.row;
        this.examid = row.Id;
        this.editmode = true;
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
}