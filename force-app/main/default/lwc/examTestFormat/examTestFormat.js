import { LightningElement, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getExistExam from '@salesforce/apex/ExamTestFormatController.getExistExam';
import geteqQuestions from '@salesforce/apex/ExamTestFormatController.geteqQuestions';
import geteqAnswers from '@salesforce/apex/ExamTestFormatController.geteqAnswers';
import { refreshApex } from '@salesforce/apex';

const columns = [
    {label : '解答', fieldName : 'Answer__c'},
];

export default class examTestFormat extends LightningElement {
    @track existExam;
    @track selectedExam;
    @track examdatas = [];
    @track columns = columns;
    @track isUnderTest = false;
    examtemp = [];
    @track dispExam;
    examnumber = 0;
    selectedanswer;
    @track dispnum = 1;
    @track totalnum;
    @track progressnum = 0;
    @track selectedRows = [];
    @track isMark = false;
    @track isResult = false;
    @track passedNum = 0;
    @track passedPer = 0;
    @track isDrawing = false;
    @track wireExam;
    nextId;
    @track isNext = false;

    @wire(geteqAnswers, {Id: '$nextId'}) wireExam;

    connectedCallback() {
        getExistExam()
            .then(result => {
                this.existExam = [];
                result.forEach(element => {
                    this.existExam.push({label: element.ExamType__c, value: element.ExamType__c});
                });
                if(this.existExam.length === 1) this.isMark = true;
            });
    }

    handleChange(e) {
        this.selectedExam = e.detail.value;
    }

    async startExamFormat() {
        this.examtemp = await geteqQuestions({'examname': this.selectedExam});
        this.examdatas = [];
        this.passedNum = 0;
        this.passedPer = 0;
        this.examnumber = 0;
        this.progressnum = 0;
        this.dispnum = 1;
        this.isMark = false;
        this.selectedExam = undefined;
        this.isNext = false;

        this.examtemp.forEach(element => {
                geteqAnswers({'Id': element.Id})
                    .then(result => {
                        let answer = result.filter(ans => {return ans.isAnswer__c === true});
                        this.examdatas.push({exam: element, selection: result, answers: answer});
                        this.totalnum = this.examdatas.length;
                        this.progressnum = Math.floor(100 / this.totalnum);
                        this.dispExam = this.examdatas[this.examnumber];
                    });
            });
        
        this.isUnderTest = true;
    }

    handleNext() {
        try{
            this.isDrawing = true;
            
            this.examdatas[this.examnumber]['selected'] = this.selectedanswer;
            this.examnumber ++;
            this.dispnum = this.examnumber + 1;
            if(this.dispnum === this.totalnum) {
                this.isMark = true;
            }
            this.progressnum = Math.floor((100 / this.totalnum) * this.dispnum);
            this.dispExam = this.examdatas[this.examnumber];
            if(this.isNext === false) {
                this.isNext = true;
            }
            this.isDrawing = false;
            this.nextId = this.dispExam.exam.Id;
            this.selectedRows = [];
            return refreshApex(this.wireExam);
        } catch(exception) {

        }
    }

    handlePrevious() {
        if(this.examnumber !== 0) {
            this.examnumber --;
            this.dispExam = this.examdatas[this.examnumber];
        }
    }
    
    handleRowAction(event) {
        this.selectedanswer = event.detail.selectedRows;
    }
    
    handleMark() {
        this.examdatas[this.examnumber]['selected'] = this.selectedanswer;        
        this.examdatas.forEach(element => {
            let isPassed = false;
            if(element.answers.length === element.selected.length) {
                isPassed = element.selected.every(item => {
                    return item.isAnswer__c === true;
                });
            }
            element['isPassed'] = isPassed;
            if(isPassed === true){
                this.passedNum ++;
            }
        });
        this.passedPer = Math.floor(this.passedNum / this.totalnum * 100);
        this.isResult = true;
    }

    gotoTop() {
        this.isResult = false;
        this.isUnderTest = false;
    }
}