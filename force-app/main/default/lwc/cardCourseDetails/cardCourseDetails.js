// // import { track, wire, api, LightningElement } from 'lwc';
// // import getCourse from '@salesforce/apex/cardCourse.getCourse';
// // // import getLeadsWithMultiPicklistValues from '@salesforce/apex/cardCourse.getLeadsWithMultiPicklistValues';
// // import { CurrentPageReference } from 'lightning/navigation';

// // export default class CardCourseDetails extends LightningElement {
// //     @track courses = [];
// //     @track error;
// //     @track cid;

// //     // Fetch courses based on accountId from URL
// //     @wire(getCourse, { cid: '$cid' })
// //     wiredCourses({ error, data }) {
// //         if (data) {
// //             this.courses = data;
// //             this.error = undefined;
// //         } else {
// //             this.error = error;
// //             this.courses = [];
// //         }
// //     }

// //     // Capture cid from the URL
// //     @wire(CurrentPageReference)
// //     getStateParameters(currentPageReference) {
// //         if (currentPageReference?.state?.cid) {
// //             this.cid = currentPageReference.state.cid;
// //         }
// //     }
// // }



// import { track, wire, api, LightningElement } from 'lwc';
// import getCourse from '@salesforce/apex/cardCourse.getCourse';
// import submitInquiry from '@salesforce/apex/cardCourse.submitInquiry';
// import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// import { CurrentPageReference } from 'lightning/navigation';

// export default class CardCourseDetails extends LightningElement {
//     firstName = '';
//     middleName = '';
//     lastName = '';
//     phno='';
//     stream = '';
//     prevEdu = '';
//     gender = '';
//     dob = '';
//     emailAddress = '';
//     @track courseId = '';
//     @track courses = [];
//     @track error;
//     @track cid;


//       // Fetch courses based on collegeId from URL
//     @wire(getCourse, { cid: '$cid' })
//     wiredCourses({ error, data }) {
//         if (data) {
//             this.courses = data.map(course => {
//                 // Precompute the formatted eligibility criteria for each course
//                 return {
//                     ...course,
//                     formattedEligibility: this.formatPicklistValues(course.Eligibility_Criteria__c)
//                 };
//             });
//             this.error = undefined;
//         } else {
//             this.error = error;
//             this.courses = [];
//         }
//     }


//     // replacing semicolons with spaces
//     formatPicklistValues(value) {
//         return value ? value.replace(/;/g, ' | ') : 'No Eligibility Criteria Available';
//     }

//      //  collegeId from URL
//     @wire(CurrentPageReference)
//     getStateParameters(currentPageReference) {
//         if (currentPageReference?.state?.cid) {
//             this.cid = currentPageReference.state.cid;
//         }
//     }

//     isModalOpen = false;

//     openModal() {
//         this.isModalOpen = true;
//     }

//     closeModal() {
//         this.isModalOpen = false;
//     }

// //     // Handle success after record creation
// //     handleSuccess(event) {
// //         const recordId = event.detail.id;
// //         this.closeModal(); 
// //         console.log('Record Created with ID:', recordId);
        
// //     }

//     handleError(event) {
//         const errorMsg = event.detail.message;
//         console.error('Error creating record:', errorMsg);
//     }

    


//     handleChange(event) {
//         //const field = event.target.name;
//         this[event.target.name] = event.target.value;
//     }

//     handleSubmit() {
//         console.log('Submitting Inquiry...');
//         console.log('First Name:', this.firstName);
//         console.log('DOB:', this.dob);
    
//         // Ensure the date is formatted correctly
//         let formattedDOB = this.dob ? this.dob.split('T')[0] : null;
    
//         submitInquiry({ 
//             firstName: this.firstName, 
//             middleName: this.middleName, 
//             lastName: this.lastName, 
//             prevEdu: this.prevEdu, 
//             stream: this.stream,              
//             phno: this.phno, 
//             gender: this.gender, 
//             dob: formattedDOB,
//             emailAddress: this.emailAddress 
//         })
//         .then(result => {
//             console.log('Server Response:', result);
//             this.showToast('Success', result, 'success');
//             this.resetForm();
//         })
//         .catch(error => {
//             console.error('Error submitting inquiry:', error);
//             this.showToast('Error', 'Failed to submit inquiry.', 'error');
//         });
//     }
    

//     resetForm() {
//         this.firstName = '';
//         this.middleName = '';
//         this.lastName = '';
//         this.prevEdu= '';
//         this.gender = 'Male';
//         this.dob = '';
//         this.emailAddress = '';
//         this.courseId = '';
//     }

//     showToast(title, message, variant) {
//         this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
//     }
// }


import { track, wire, api, LightningElement } from 'lwc';
import getCourse from '@salesforce/apex/cardCourse.getCourse';
import submitInquiry from '@salesforce/apex/cardCourse.submitInquiry';
import getCourseList from '@salesforce/apex/cardCourse.getCourseList';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CurrentPageReference } from 'lightning/navigation';

export default class CardCourseDetails extends LightningElement {
    firstName = '';
    middleName = '';
    lastName = '';
    phno='';
    stream = '';
    prevEdu = '';
    gender = '';
    dob = '';
    emailAddress = '';
    courseOpId='';

    @track cList=[];
    @track courses = [];
    @track error;
    @track cid;


      // Fetch courses based on collegeId from URL
    @wire(getCourse, { cid: '$cid' })
    wiredCourses({ error, data }) {
        if (data) {
            this.courses = data.map(course => {
                // Precompute the formatted eligibility criteria for each course
                return {
                    ...course,
                    formattedEligibility: this.formatPicklistValues(course.Eligibility_Criteria__c)
                };
            });
            this.error = undefined;
        } else {
            this.error = error;
            this.courses = [];
        }
    }

    
    @wire(getCourseList, { cid: '$cid' })
    wiredCoursesList({ error, data }) {
        if (data) {
            this.clist = data.map(cl => {
                return{
               label:cl.Name,
               value:cl.Id
                }
            });
            this.error = undefined;
        } else {
            this.error = error;
            this.clist = [];
        }
    }

    // replacing semicolons with spaces
    formatPicklistValues(value) {
        return value ? value.replace(/;/g, ' | ') : 'No Eligibility Criteria Available';
    }

     //  collegeId from URL
    @wire(CurrentPageReference)
    getStateParameters(currentPageReference) {
        if (currentPageReference?.state?.cid) {
            this.cid = currentPageReference.state.cid;
        }
    }

    isModalOpen = false;

    openModal() {
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
    }


    handleChange(event) {
        //const field = event.target.name;
        this[event.target.name] = event.target.value;
    }


    handleCourseChange(event) {
        // Update the courseId with the selected value
        this.courseOpId = event.detail.value; // This binds the selected course ID to the courseId variable
    }
    

    //||||||||||||||||code modify 
    get isConditionMet() {
        return this.prevEdu === '12th';
    }
    get maxLength(){
        
        if(this.phno>10){
            this.showError = true;
        }
    }

    handleSubmit() {
        // if (!this.firstName || !this.lastName || !this.email || !this.courseId) {
        //     this.showToast('Error', 'Please fill all required fields.', 'error');
        //     return;
        // }
        let formsttedDob=this.dob?new Date(this.dob):null;
        
        console.log('Form Data:', {
            firstName: this.firstName,
            middleName: this.middleName,
            lastName: this.lastName,
            phno: this.phno,
            stream: this.stream,
            prevEdu: this.prevEdu,
            gender: this.gender,
            dob: this.dob,
            emailAddress: this.emailAddress,
            courseOpId: this.courseOpId
        });

       
        // console.log('coureOpId ========================', courseOpId);
        
        submitInquiry({ 
            courseId:this.courseOpId,
            firstName: this.firstName, 
            middleName: this.middleName, 
            lastName: this.lastName, 
            gender: this.gender, 
            dob:formsttedDob,
            emailAddress: this.emailAddress,
            phno: this.phno, 
            prevEdu: this.prevEdu, 
            stream: this.stream             
        })
        
        .then(result => {
            this.showToast('Success', result, 'success');
            this.resetForm();
            this.closeModal();
        })
        .catch(error => {
            console.error('Error submitting inquiry', error);
            this.showToast('Error', 'Failed to submit inquiry.', 'error');
        });
        console.log('courseId===========',this.cid);
    }

    resetForm() {
        this.firstName = '';
        this.middleName = '';
        this.lastName = '';
        this.prevEdu= '';
        this.gender = 'Male';
        this.dob = '';
        this.emailAddress = '';
        this.courseOpId = '';
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}
