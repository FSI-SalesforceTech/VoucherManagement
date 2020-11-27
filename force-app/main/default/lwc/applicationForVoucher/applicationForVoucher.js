import { LightningElement, track, wire} from 'lwc';

import selectChatterUser from '@salesforce/apex/RegistPassingExaminationController.selectChatterUser';

const DELAY = 350;
export default class applicationForVoucher extends LightningElement {
    @track isSuccess = false;
    @track isError = false;
    @track errordetail;
    @track value;
    @track idle = false;
    @track userId;

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
}