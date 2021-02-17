import { LightningElement, track, wire } from 'lwc';
import getVoucherList from '@salesforce/apex/ExaminationInputController.getVoucherList';
import { refreshApex } from '@salesforce/apex';

import { updateRecord } from 'lightning/uiRecordApi';
import { deleteRecord } from 'lightning/uiRecordApi';
import VOUID_FIELD from '@salesforce/schema/Voucher__c.Id';
import ASSIGNUSER_FIELD from '@salesforce/schema/Voucher__c.AssignUser__c';
import ASSIGNDATE_FIELD from '@salesforce/schema/Voucher__c.AssignDate__c';
// 2021/02/16 ADD S
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import EXAM_FIELD from '@salesforce/schema/ExaminationInfo__c.Exam__c';
import PASSORFAIL_FIELD from '@salesforce/schema/ExaminationInfo__c.PassOrFail__c';
import updateExaminationInfo from '@salesforce/apex/ExaminationInputController.updatetExaminationInfo';
// 2021/02/16 ADD E

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
    // 2021/02/16 ADD S
    // 試験選択リスト取得
    ExamOptions = [];
    @wire(getPicklistValues,{recordTypeId:'012000000000000AAA', fieldApiName: EXAM_FIELD})
    wiredExam({data,error}){
        if(data){
            console.log('■■■■■getPicklistValues Exam Success');
            console.log(data);
            this.ExamOptions = data.values;
        }else if(error){
            console.log('■■■■■getPicklistValues Exam Error');
            console.log(error);
            this.ExamOptions = undefined;
        }
    }
    // 合否選択リスト取得
    PassOrFailOptions = [];
    @wire(getPicklistValues,{recordTypeId:'012000000000000AAA', fieldApiName: PASSORFAIL_FIELD})
    wiredPassOrFail({data,error}){
        if(data){
            console.log('■■■■■getPicklistValues PassOrFail Success');
            console.log(data);
            this.PassOrFailOptions = data.values;
        }else if(error){
            console.log('■■■■■getPicklistValues PassOrFail Error');
            console.log(error);
            this.PassOrFailOptions = undefined;
        }
    }
    // 2021/02/16 ADD E

    handleRowAction(e){
        const row = e.detail.row;
        const actionName = e.detail.action.name;
        this.examid = row.Id;
        switch (actionName) {
            case 'edit':
                this.editmode = true;
                // 2021/02/17 ADD S
                // 試験項目の設定
                console.log("■■■handleRowAction Log(試験):" + row.Exam__c);
                this.exam      = row.Exam__c;
                this.ExamValue = row.Exam__c;
                // 受験日の設定
                console.log("■■■handleRowAction Log(受験日):" + row.WillExam__c);
                this.willExam      = row.WillExam__c;
                this.WillExamValue = row.WillExam__c;
                // 2021/02/17 ADD E
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
    // 2021/02/16 ADD S
    // 受験日
    handleWillExamChange(event){
        this.willExam = event.detail.value;
        console.log("■■■Log(受験日):" + event.detail.value);
    }
    // 試験選択リスト
    handleExamChange(event) {
        this.exam = event.detail.value;
        console.log("■■■Log(試験):" + event.detail.value);
    }
    // 合否選択リスト
    handlePassOrFailChange(event){
        this.passorfail = event.detail.value;
        console.log("■■■Log(合否):" + event.detail.value);
    }
    // 保存ボタン押下時
    async createExaminationInput(){
        console.log("■■■ 保存処理開始 ■■■");
        console.log("■■■Log(examid):"      + this.examid);
        console.log("■■■Log(exam):"        + this.exam);
        console.log("■■■Log(willExam):"    + this.willExam);
        console.log("■■■Log(passorfail):"  + this.passorfail);
        // 入力チェック
        // 試験
        if(this.exam == null || this.exam == ""){
            this.isError = true;
            this.isSuccess = false;
            this.errordetail= "試験を選択してください";
            console.log("■■■Log(入力チェック):試験");
            return;
        }else{
            this.isError = false;
        }
        // 受験日
        if(this.willExam == null || this.willExam == "" ){
            this.isError = true;
            this.isSuccess = false;
            this.errordetail = "受験日を入力してください";
            console.log("■■■Log(入力チェック):受験日");
            return;
        }else{
            this.isError = false;
        }
        if(this.isError == false){
            await updateExaminationInfo({
                examid: this.examid ,
                exam: this.exam ,
                willExam: this.willExam ,
                passOrFail: this.passorfail
            })
            .then(() => {
                this.isSuccess    = true;
                this.isError      = false;
                this.editmode     = false;
                this.errordetail  = undefined;
                console.log("■■■Log(結果):Success");
            })
            .catch((error) => {
                this.isError     = true;
                this.isSuccess   = false;
                this.editmode    = false;
                this.errordetail = 'Error received: code' + error.errorCode + ', ' + 'message ' + error.body.message + error.detail.detail;
                console.log("■■■Log(結果):" + this.errordetail );
            });
            console.log("■■■ 保存処理終了 ■■■");
            return refreshApex(this.wiredVoucherResult);
        }
    }
    // 2021/02/16 ADD E
}