import { LightningElement, track, wire } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import TYPE_FIELD from '@salesforce/schema/ExaminationInfo__c.Exam__c';

import selectChatterUser from '@salesforce/apex/RegistPassingExaminationController.selectChatterUser';
import getRegistVoucherId from '@salesforce/apex/RegistPassingExaminationController.getRegistVoucherId';
import getFinalDecisionId from '@salesforce/apex/RegistPassingExaminationController.getFinalDecisionId';

const DELAY = 350;
const columns = [{ label: '試験名', fieldName: 'name' }];

export default class registPassingExamination extends LightningElement {
    @track idle = false;
    @track value = '';
    @track options = [];
    @track columns = columns;
    @track recordId;

    @wire(getRegistVoucherId) voucherId;
    @wire(getFinalDecisionId) finalid;

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
                    console.log(result);
                    this.idle = false;
                })
                .catch(error => {
                    this.idle = false;
                    alert(error);
                });
        }, DELAY);
    }

    handleRowAction(event) {

    }
}