import { LightningElement ,track} from 'lwc';
import checkStudentId from '@salesforce/apex/loginValidation.loginEnrollmentPassword';
import { NavigationMixin } from 'lightning/navigation';
export default class LoginStudent extends NavigationMixin(LightningElement) {
    @track studentId = '';
    @track password = '';
    @track errorMessage = '';
    @track successMessage = '';
    // @track isLoggedIn = false; //login

    // //Login true then navbar display code
    // connectedCallback() {
    //     // Check login status from session storage
    //     this.isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    // }

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

        checkStudentId({ studentId: this.studentId, password: this.password })
        .then((result) => {
            if (result) {
                this.successMessage = `✅ Login successful! Welcome, ${this.studentId}.`;
                this.errorMessage = '';

                // Store login state
                localStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('studentId', this.studentId);//session data store 

                // // Redirect to home page
                this[NavigationMixin.Navigate]({
                    type: 'comm__namedPage',
                    attributes: {
                        name:"Home",
                    }
                });

                setTimeout(() => {
                    window.location.reload(); // Reload after redirect
                },100); 

            } else {
                this.errorMessage = '❌ Invalid Student ID or Password. Please try again.';
            }
        })
        .catch((error) => {
            this.errorMessage = '❌ Error occurred while verifying login.';
            console.error('Error: ', error);
        });
}
    
       //c/calender 
    //    handleLogout() {
    //     sessionStorage.removeItem('isLoggedIn');
    //     this.isLoggedIn = false;
    //     window.location.href = "/student-login"; // Redirect to login page
    // }


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