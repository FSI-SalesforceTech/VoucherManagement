import { LightningElement, track, wire} from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import ORIGIN_FIELD from '@salesforce/schema/Case.Origin';
import EXAM_FIELD from '@salesforce/schema/Case.Exam__c';

import selectChatterUser from '@salesforce/apex/RegistPassingExaminationController.selectChatterUser';
import insertCase from '@salesforce/apex/CaseController.insertCaseVoucher';

const DELAY = 350;
export default class applicationForVoucher extends LightningElement {
    @track isSuccess = false;
    @track isError = false;
    @track errordetail;
    @track value;
    @track idle = false;
    @track userId;

    // 2021/02/04 ADD S
    // 発生源選択リスト
    OriginOptions=[];
    @wire(getPicklistValues,{recordTypeId:'012000000000000AAA', fieldApiName: ORIGIN_FIELD})
    wiredOrigin({data,error}){
        if(data){
            console.log('■■■■■getPicklistValues Origin Success');
            console.log(data);
            this.OriginOptions = data.values;
        }else if(error){
            console.log('■■■■■getPicklistValues Origin Error');
            console.log(error);
            this.OriginOptions = undefined;
        }
    }
    // ポータルを初期値で設定する
    OriginValue= 'ポータル';
    
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
    // 2021/02/04 ADD E

    handleSuccess(e){
        this.isSuccess = true;
        this.isError = false;
        this.errordetail = undefined;
    }

    handleError(e){
        this.isError = true;
        this.isSuccess = false;
        this.errordetail = e.detail.detail;
    }

    closeSuccessToast(){
        this.isSuccess = false;
    }

    closeErrorToast() {
        this.isError = false;
    }

    handleChange(event) {
        console.log("console log: " + event.detail.value[0]);
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
                    alert(JSON.stringify(error));
                });
        }, DELAY);
    }

    handleRadioClick(event) {
        this.userId = event.detail.value;
        //fields[ASSIGNUSER_FIELD.fieldApiName] = selectedOption;
    }
    
    // 2020/02/04 ADD S
    @track exam;
    @track willExam;
    @track useOfReferenceProblems;
    @track note;
    @track subject;
    
    // 初期化
    exam      = "";
    willExam  = "";
    useOfReferenceProblems = false;
    subject   = "Salesforceポータルからのバウチャー利用申請";

    // 試験コンボボックス
    handleExamChange(event) {
        this.exam= event.detail.value;
        console.log("■■■Log(試験):" + event.detail.value);
    }
    // 予定日
    handleWillExamChange(event){
        this.willExam= event.detail.value;
        console.log("■■■Log(予定日):" + event.detail.value);
    }
    // 過去問題を利用可否
    handleUseOfReferenceProblemsChange(event){
        this.useOfReferenceProblems = event.target.checked;
        console.log("■■■Log(過去問題利用可否)" + event.target.checked);
    }
    // 備考
    handleNoteChange(event){
        this.note= event.detail.value;
        console.log("■■■Log(備考):" + event.detail.value);
    }
    // 申請ボタン押下
    async createCase(){
        console.log("■■■Log(ボタン押下) Start ■■■");
        this.isError = true;
        this.errordetail = "";
        // 入力チェック
        console.log(this.exam);
        if(this.exam == null || this.exam == ""){
            this.isError = true;
            this.isSuccess = false;
            this.errordetail= "試験を選択してください";
            console.log("■■■Log(入力チェック):試験");
            return;
        }else{
            this.isError = false;
        }
        console.log(this.willExam);
        if(this.willExam == null || this.willExam == "" ){
            this.isError = true;
            this.isSuccess = false;
            this.errordetail = "予定日を入力してください";
            console.log("■■■Log(入力チェック):予定日");
            return;
        }else{
            this.isError = false;
        }
        if(this.isError == false){
            // 入力内容をケースにApex経由で登録
            await insertCase({
                AssignUserId: this.userId ,
                Exam: this.exam ,
                WillExam:this.willExam ,
                useOfReferenceProblems:this.useOfReferenceProblems ,
                Note: this.note ,
                Subject: this.subject , 
                Origin: this.OriginValue
            })
            .then(() => {
                this.isSuccess = true;
                this.isError = false;
                this.errordetail = undefined;
                console.log("■■■Log(結果):Success");
            })
            .catch((error) => {
                this.isError = true;
                this.isSuccess = false;
                this.errordetail = 'Error received: code' + error.errorCode + ', ' + 'message ' + error.body.message + error.detail.detail;
                console.log("■■■Log(結果):" + this.errordetail );
            });
        }
        console.log("■■■Log(ボタン押下) End ■■■");
    }
    // 2021/02/04 ADD E
}