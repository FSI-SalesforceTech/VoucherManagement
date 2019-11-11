import { LightningElement, track} from 'lwc';

export default class applicationForVoucher extends LightningElement {

    @track isSuccess = false;
    @track isError = false;
    @track errordetail;

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
}