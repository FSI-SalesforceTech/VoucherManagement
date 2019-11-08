import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';

import getActiveChatterUser from '@salesforce/apex/ManageChatterFreeUserController.getActiveChatterUser';

const columns = [
    {label : '氏名', fieldName : 'Name', cellAttributes: { iconName: 'utility:user', iconPosition: 'left' }},
    {label : 'メール', fieldName : 'Email', type: 'email'},
    {label : 'ユーザ名', fieldName : 'Username'},
    {label : '最終ログイン', fieldName : 'LastLoginDate', type : 'date-local'},
    {label : '有効', fieldName : 'IsActive', type : 'boolean', editable: true}
];

const confirmcolumns = [
    {label : '氏名', fieldName : 'Name', cellAttributes: { iconName: 'utility:user', iconPosition: 'left' }},
    {label : 'ユーザ名', fieldName : 'Username'}
];

export default class manageChatterFreeUser extends LightningElement {
    @track columns = columns;
    @track confirmcolumns = confirmcolumns;
    @track enabled = false;
    @track target;
    @track confirm = false;
    @track draftValues = [];

    @wire(getActiveChatterUser) users;
    
    handleSave(event) {
        const recordInputs =  event.detail.draftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
    
        const promises = recordInputs.map(recordInput => updateRecord(recordInput));
        Promise.all(promises).then(users => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: '更新しました！',
                    variant: 'success'
                })
            );
             // Clear all draft values
             this.draftValues = [];
    
             // Display fresh data in the datatable
             return refreshApex(this.users);
        }).catch(error => {
            // Handle error 
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'エラー',
                    message: error.message,
                    variant: 'error'
                })
            );
        });
    }
}