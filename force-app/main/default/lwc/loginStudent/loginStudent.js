import { LightningElement ,track} from 'lwc';
import checkStudentId from '@salesforce/apex/loginValidation.loginEnrollmentPassword';

export default class LoginStudent extends LightningElement {
    @track studentId = '';
    @track password = '';
    @track errorMessage = '';
    @track successMessage = '';

    handleInputChange(event) {
        this.studentId = event.target.value;
    }


    handlePasswordChange(event) {
        this.password = event.target.value;
    }

    handleLogin() {
        this.errorMessage = '';
        this.successMessage = '';

        // Validation: Ensure ID and Password are entered
        if (!this.studentId || !this.password) {
            this.errorMessage = '⚠️ Please enter both Student ID and Password.';
            return;
        }

        // Validation: Ensure Student ID follows correct format
        const idPattern = /^[A-Za-z0-9-_]+$/;
        if (!idPattern.test(this.studentId)) {
            this.errorMessage = '⚠️ Invalid Student ID format. Use letters, numbers, hyphens, or underscores only.';
            return;
        }

        checkStudentId({ studentId: this.studentId,password: this.password })
            .then((result) => {
                if (result) {
                    this.successMessage = `✅ Login successful! Welcome, ${this.studentId}.`;
                    this.errorMessage = '';
                } else {
                    this.errorMessage = '❌ Invalid Student ID or Password. Please try again.';
                }
            })
            .catch((error) => {
                this.errorMessage = '❌ Error occurred while verifying login.';
                console.error('Error: ', error);
            });
    }


    //navigate Home
    // navigateHome(event){
    //                 this.recordId=event.target.dataset.cid;
    //                 this[NavigationMixin.Navigate]({
    //                     type:"comm__namedPage",
    //                     attributes:{
    //                         name:"College_Data__c",
    //                     },
    //                     state: {
    //                         cid: this.recordId
    //                     }
    //                 });
    //             }
}