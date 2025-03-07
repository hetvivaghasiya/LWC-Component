import { LightningElement ,track} from 'lwc';
import checkStudentId from '@salesforce/apex/loginValidation.loginEnrollmentPassword';
import { NavigationMixin } from 'lightning/navigation';
export default class LoginStudent extends NavigationMixin(LightningElement) {
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
            this.errorMessage = 'Please enter both Student ID and Password.';
            return;
        }

        // Validation: Ensure Student ID follows correct format
        const idPattern = /^[A-Za-z0-9-_]+$/;
        if (!idPattern.test(this.studentId)) {
            this.errorMessage = 'Invalid Student ID format. Use letters, numbers, hyphens, or underscores only.';
            return;
        }

        checkStudentId({ studentId: this.studentId, password: this.password })
        .then((result) => {
            if (result) {
                this.successMessage = `Login successful! Welcome, ${this.studentId}.`;
                this.errorMessage = '';

                // Store login state
                localStorage.setItem('isLoggedIn', 'true');

                sessionStorage.setItem('studentId', this.studentId);//session data store 

                // // Redirect to home page
                this[NavigationMixin.Navigate]({
                    type: 'comm__namedPage',
                    attributes: {
                        name:"Home_Student_Login__c",
                    }
                });

                setTimeout(() => {
                    window.location.reload(); // Reload after redirect
                },100); 

            } else {
                this.errorMessage = ' Invalid Student ID or Password. Please try again.';
            }
        })
        .catch((error) => {
            this.errorMessage = 'Error occurred while verifying login.';
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



// import { LightningElement, track } from 'lwc';
// import checkStudentId from '@salesforce/apex/loginValidation.loginEnrollmentPassword';
// import { NavigationMixin } from 'lightning/navigation';

// export default class LoginStudent extends NavigationMixin(LightningElement) {
//     @track studentId = '';
//     @track password = '';
//     @track errorMessage = '';
//     @track successMessage = '';

//     handleInputChange(event) {
//         this.studentId = event.target.value;
//     }

//     handlePasswordChange(event) {
//         this.password = event.target.value;
//     }

//     handleLogin() {
//         this.errorMessage = '';
//         this.successMessage = '';

//         // Validation: Ensure ID and Password are entered
//         if (!this.studentId || !this.password) {
//             this.errorMessage = 'Please enter both Student ID and Password.';
//             return;
//         }

//         // Validation: Ensure Student ID follows correct format
//         const idPattern = /^[A-Za-z0-9-_]+$/;
//         if (!idPattern.test(this.studentId)) {
//             this.errorMessage = 'Invalid Student ID format. Use letters, numbers, hyphens, or underscores only.';
//             return;
//         }

//         checkStudentId({ studentId: this.studentId, password: this.password })
//         .then((result) => {
//             if (result) {
//                 this.successMessage = `Login successful! Welcome, ${this.studentId}.`;
//                 this.errorMessage = '';

//                 // Store login state
//                 localStorage.setItem('isLoggedIn', 'true');
//                 // Store login state in a cookie (expires in 7 days)
//                 document.cookie = `studentId=${this.studentId}; path=/; max-age=${7 * 24 * 60 * 60};`;

//                 console.log('Stored Student ID in Cookie:', this.getCookie('studentId'));

//                 // Redirect to home page
//                 this[NavigationMixin.Navigate]({
//                     type: 'comm__namedPage',
//                     attributes: {
//                         name: "Home",
//                     }
//                 });

//                 setTimeout(() => {
//                     window.location.reload(); // Reload after redirect
//                 }, 100);

//             } else {
//                 this.errorMessage = 'Invalid Student ID or Password. Please try again.';
//             }
//         })
//         .catch((error) => {
//             this.errorMessage = 'Error occurred while verifying login.';
//             console.error('Error: ', error);
//         });
//     }

//     // Helper function to retrieve cookies
//     getCookie(name) {
//         const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
//         return match ? match[2] : null;
//     }
// }



// // import { LightningElement, track } from 'lwc';
// // import checkStudentId from '@salesforce/apex/LoginValidation.loginEnrollmentPassword';
// // import checkPreviousInquiry from '@salesforce/apex/LoginValidation.checkPreviousInquiry';
// // import { NavigationMixin } from 'lightning/navigation';
// // import { ShowToastEvent } from 'lightning/platformShowToastEvent';

// // export default class LoginValidation extends NavigationMixin(LightningElement) {

// //     @track studentId = '';
// //     @track password = '';
// //     @track errorMessage = '';
// //     @track successMessage = '';
// //     @track inquiryMessage = ''; // To show message about previous inquiries
// //     @track studentDetails = {};

// //     handleInputChange(event) {
// //         this.studentId = event.target.value;
// //     }

// //     handlePasswordChange(event) {
// //         this.password = event.target.value;
// //     }

// //     handleLogin() {
// //         this.errorMessage = '';
// //         this.successMessage = '';
// //         this.inquiryMessage = ''; // Reset inquiry message

// //         // Validation: Ensure ID and Password are entered
// //         if (!this.studentId || !this.password) {
// //             this.errorMessage = 'Please enter both Student ID and Password.';
// //             return;
// //         }

// //         // Validation: Ensure Student ID follows correct format
// //         const idPattern = /^[A-Za-z0-9-_]+$/;
// //         if (!idPattern.test(this.studentId)) {
// //             this.errorMessage = 'Invalid Student ID format. Use letters, numbers, hyphens, or underscores only.';
// //             return;
// //         }

// //         // Call Apex to check the student ID and password
// //         checkStudentId({ studentId: this.studentId, password: this.password })
// //             .then((result) => {
// //                 if (result) {
// //                     this.successMessage = `Login successful! Welcome, ${this.studentId}.`;
// //                     this.errorMessage = '';

// //                     // Extract student details from the result
// //                     const { FirstName, LastName, Email, CourseId, CollegeId } = result;
// //                     this.studentDetails = { FirstName, LastName, Email, CourseId, CollegeId };

// //                     // Check for previous inquiries using the student details
// //                     checkPreviousInquiry({
// //                         firstName: FirstName,
// //                         lastName: LastName,
// //                         email: Email,
// //                         courseId: CourseId,
// //                         collegeId: CollegeId
// //                     })
// //                         .then((hasInquired) => {
// //                             if (hasInquired) {
// //                                 this.inquiryMessage = 'You have already inquired about this course at this college.';
// //                                 this.showToast('Info', this.inquiryMessage, 'info');
// //                             } else {
// //                                 // Continue to the inquiry page or any other desired action
// //                                 this[NavigationMixin.Navigate]({
// //                                     type: 'comm__namedPage',
// //                                     attributes: {
// //                                         name: 'InquiryPage',
// //                                     }
// //                                 });
// //                             }
// //                         })
// //                         .catch((error) => {
// //                             this.errorMessage = 'Error checking previous inquiries.';
// //                             console.error('Error:', error);
// //                         });

// //                     // Store login state
// //                     localStorage.setItem('isLoggedIn', 'true');
// //                     sessionStorage.setItem('studentId', this.studentId); // Store the student ID in session storage

// //                     // Redirect to home page after login
// //                     this[NavigationMixin.Navigate]({
// //                         type: 'comm__namedPage',
// //                         attributes: {
// //                             name: 'Home',
// //                         }
// //                     });

// //                     setTimeout(() => {
// //                         window.location.reload(); // Reload after redirect
// //                     }, 100);

// //                 } else {
// //                     this.errorMessage = 'Invalid Student ID or Password. Please try again.';
// //                 }
// //             })
// //             .catch((error) => {
// //                 this.errorMessage = 'Error occurred while verifying login.';
// //                 console.error('Error: ', error);
// //             });
// //     }

// //     // Show Toast Message
// //     showToast(title, message, variant) {
// //         const event = new ShowToastEvent({
// //             title: title,
// //             message: message,
// //             variant: variant,
// //         });
// //         this.dispatchEvent(event);
// //     }
// // }
