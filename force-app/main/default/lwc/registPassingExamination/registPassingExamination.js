import { LightningElement, track, wire } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import VOUCHER_OBJECT from '@salesforce/schema/Voucher__c';
import NAME_FIELD from '@salesforce/schema/Voucher__c.Name';
import ASSIGNUSER_FIELD from '@salesforce/schema/Voucher__c.AssignUser__c';
import FINALDECISION_FIELD from '@salesforce/schema/Voucher__c.FinalDecision__c';

import selectChatterUser from '@salesforce/apex/RegistPassingExaminationController.selectChatterUser';
import getRegistVoucherId from '@salesforce/apex/RegistPassingExaminationController.getRegistVoucherId';
import getFinalDecisionId from '@salesforce/apex/RegistPassingExaminationController.getFinalDecisionId';

// 2021/02/18 ADD S
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import insertVoucher         from '@salesforce/apex/RegistPassingExaminationController.insertVoucher';
import insertExaminationInfo from '@salesforce/apex/RegistPassingExaminationController.insertExaminationInfo';
import EXAM_FIELD       from '@salesforce/schema/ExaminationInfo__c.Exam__c';
import PASSORFAIL_FIELD from '@salesforce/schema/ExaminationInfo__c.PassOrFail__c';
// 2021/02/18 ADD E

const DELAY = 350;

export default class registPassingExamination extends LightningElement {
    @track idle = false;
    @track value;
    @track options = [];
    @track examid;
    @track exam;
    @track willexam;
    @track voucherId;
    @track finalid;
    @track isSuccess = false;

    // 2021/02/18 ADD S
    @track isError   = false;
    // 試験選択リスト
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
    PassOrFailValue = '合格';
    // 2021/02/18 ADD E

    @wire(getFinalDecisionId)
    wiregetFinalDecisionId({ error, data }) {
        if(data) {
            this.finalid = data[0].Id;
        } else if(error) {
            alert(error);
        }
    }

    handleKeyChange(event) {
        this.idle = true;
        window.clearTimeout(this.delayTimeout);
        const searchKey = event.target.value;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            selectChatterUser({ 'param': searchKey })
                .then(result => {
                    if(result.length > 0) {
                        this.options = [];
                        result.forEach(element => {
                            this.options.push({label: element.Name, value: element.Id});
                        });
                    }
                    this.idle = false;
                })
                .catch(error => {
                    this.idle = false;
                    alert(error);
                });
        }, DELAY);
    }

    selectUser(event) {
        getRegistVoucherId({'UserId': event.detail.value})
            .then( result => {
                console.log(result);
                if(result.length > 0) {
                    this.voucherId = result[0].Id;
                } else {
                    /* 2021/02/18 CHG
                    const fields = {};
                    fields[NAME_FIELD.fieldApiName] = '資格保有者登録用';
                    fields[ASSIGNUSER_FIELD.fieldApiName] = event.detail.value;
                    fields[FINALDECISION_FIELD.fieldApiName] = this.finalid;
                    
                    const recordInput = { apiName: VOUCHER_OBJECT.objectApiName, fields };
                    console.log(recordInput);
                    createRecord(recordInput)
                        .then(Voucher => {
                            this.voucherId = Voucher.id;
                        })
                        .catch(error => {
                            alert('エラー：' + JSON.stringify(error.body.message));
                        });
                    */
                    insertVoucher({ AssignUserId:event.detail.value,
                                     FinalDecision:this.finalid,
                                     Name:'資格保有者登録用'})
                    .then((result1)=>{
                        console.log('■■■■■■Id:' + result1 );
                        this.voucherId = result1;
                    })
                    .catch((error1)=>{
                        this.voucherId = undefined;
                        alert('エラー:'+ JSON.stringify(error1.body));
                    });
                    // 2021/02/18 CHG E
                }
            });
        this.value = event.detail.value;
    }

    handleSuccess(event) {
        this.isSuccess = true;
    }

    closeSuccessToast(){
        this.isSuccess = false;
    }

    handleError(error) {
        alert(error);
    }
    
    // 2021/02/18 ADD S
    closeErrorToast() {
        this.isError = false;
    }
    // 試験
    handleExamChange(event){
        this.exam= event.detail.value;
        console.log("■■■Log(試験):" + event.detail.value);
    }
    // 受験日
    handleWillExamChange(event){
        this.willExam= event.detail.value;
        console.log("■■■Log(予定日):" + event.detail.value);
    }
    // 保存ボタン押下
    createExaminationInfo(){
        console.log('■■■Log(保存ボタン):開始 ■■■');
        // 入力チェック
        console.log(this.exam);
        if(this.exam == null || this.exam == ""){
            this.isError     = true;
            this.isSuccess   = false;
            this.errordetail = "試験を選択してください";
            console.log("■■■Log(入力チェック):試験");
            return;
        }else{
            this.isError = false;
        }
        console.log(this.willExam);
        if(this.willExam == null || this.willExam == "" ){
            this.isError     = true;
            this.isSuccess   = false;
            this.errordetail = "受験日を入力してください";
            console.log("■■■Log(入力チェック):受験日");
            return;
        }else{
            this.isError = false;
        }
        if(this.isError == false){
            // レコード登録処理
            insertExaminationInfo({ exam:this.exam,
                                    willExam:this.willExam,
                                    passOrFail:this.PassOrFailValue,
                                    voucher:this.voucherId})
            .then(()=>{
                this.isSuccess = true;
                this.isError   = false;
                console.log("■■■Log(結果):Success");
            })
            .catch((error)=>{
                this.isSuccess = false;
                this.isError   = true;
                console.log(error);
                console.log(JSON.stringify(error.body.pageErrors));
                this.errordetail = '保存処理に失敗しました。' + JSON.stringify(error.body.pageErrors);
                console.log("■■■Log(結果):Error");
            });
            console.log('■■■Log(保存ボタン):終了 ■■■');
        }
    }
    // 2021/02/18 ADD E
}