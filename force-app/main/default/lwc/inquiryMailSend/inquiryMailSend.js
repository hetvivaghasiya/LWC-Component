import { track, wire, api, LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import sendCourseEmail from '@salesforce/apex/cardCourse.sendCourseEmail';
import getCourse from '@salesforce/apex/cardCourse.getCourse';
import { CurrentPageReference } from 'lightning/navigation';
import { NavigationMixin } from 'lightning/navigation';

export default class InquiryMailSend extends LightningElement {
    @track courses = [];
    @track error;
    @track cid;

    // Variables to store form data
    firstName = '';
    lastName = '';
    emailAddress = '';
    semesterNumber = '';
    fees = '';
    startDate = '';
    endDate = '';

     //  Fetch courses based on accountId from URL
     @wire(getCourse, { cid: '$cid' },sendCourseEmail)
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
 
     // Format picklist values by replacing semicolons with spaces
     formatPicklistValues(value) {
        return value ? value.replace(/;/g, ' | ') : 'No Eligibility Criteria Available';
    }

    // Get state parameters from the URL (like collegeId)
    @wire(CurrentPageReference)
    getStateParameters(currentPageReference) {
        if (currentPageReference?.state?.cid) {
            this.cid = currentPageReference.state.cid;
        }
    }

    isModalOpen = false;

    // Open the modal
    openModal() {
        this.isModalOpen = true;
    }

    // Close the modal
    closeModal() {
        this.isModalOpen = false;
    }


        // Handle the save button click
        handleSuccess(event) { 
            // Extract course details (e.g., semester number, fees, dates)
            const course = this.courses.find(course => course.Id === event.target.dataset.accountId);
            if (course) {
                this.semesterNumber = course.Course_Year__c;
                this.fees = course.Course_Fees__c;
                this.startDate = course.Start_Date__c;
                this.endDate = course.End_Date__c;
            }
        
            // Debugging logs to verify the values being passed
            console.debug('Sending email with the following details:');
            console.debug('First Name: ' + this.firstName);
            console.debug('Last Name: ' + this.lastName);
            console.debug('Email Address: ' + this.emailAddress);
            console.debug('Semester Number: ' + this.semesterNumber);
            console.debug('Fees: ' + this.fees);
            console.debug('Start Date: ' + this.startDate);
            console.debug('End Date: ' + this.endDate);
        
            // Call Apex method to send email with course and inquiry details
            sendCourseEmail({
                firstName: this.firstName,
                lastName: this.lastName,
                emailAddress: this.emailAddress,
                semesterNumber: this.semesterNumber,
                fees: this.fees,
                startDate: this.startDate,
                endDate: this.endDate
            })
            .then(() => {
                // Show success toast
                this.showToast('Success', 'Inquiry submitted and email sent!', 'success');
        
                // Redirect to the course page (you can adjust the URL as per your requirement)
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: course.Id, // Redirecting to the course record page
                        objectApiName: 'Course_Data__c', // The object API name (replace with your actual object name)
                        actionName: 'view'
                    }
                });
            })
            .catch(error => {
                this.showToast('Error', error.body.message, 'error');
                console.error('Error:', error);
            });
        }



    // Show toast notification
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(event);
    }

    // Handle form field changes
    handleInputChange(event) {
        const field = event.target.name;
        if (field === 'firstName') {
            this.firstName = event.target.value;
        } else if (field === 'lastName') {
            this.lastName = event.target.value;
        } else if (field === 'emailAddress') {
            this.emailAddress = event.target.value;
        }
    }
}