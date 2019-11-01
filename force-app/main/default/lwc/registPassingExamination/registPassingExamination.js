import { LightningElement, track, wire } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import VOUCHER_OBJECT from '@salesforce/schema/Voucher__c';
import NAME_FIELD from '@salesforce/schema/Voucher__c.Name';
import ASSIGNUSER_FIELD from '@salesforce/schema/Voucher__c.AssignUser__c';
import FINALDECISION_FIELD from '@salesforce/schema/Voucher__c.FinalDecision__c';

import selectChatterUser from '@salesforce/apex/RegistPassingExaminationController.selectChatterUser';
import getRegistVoucherId from '@salesforce/apex/RegistPassingExaminationController.getRegistVoucherId';
import getFinalDecisionId from '@salesforce/apex/RegistPassingExaminationController.getFinalDecisionId';

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
}