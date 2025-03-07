import { LightningElement, track } from 'lwc';
import getStudentProfileWithSemesters from '@salesforce/apex/feesPaymentSem.getStudentProfileWithSemesters';
import createRazorpayPaymentLink from '@salesforce/apex/feesPaymentSem.createRazorpayPaymentLink';
import sendPaymentLinkEmail from '@salesforce/apex/feesPaymentSem.sendPaymentLinkEmail';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import checkIfPaid from '@salesforce/apex/feesPaymentSem.checkIfPaid';

export default class FeesPayments extends LightningElement {
    @track studentData;
    @track semesters = [];
    @track errorMessage;
    @track paymentStatusMessage;

    // Fetch student profile on component load
    connectedCallback() {
        const studentId = sessionStorage.getItem('studentId');
        console.log('Student ID from session:', studentId);

        if (studentId) {
            this.fetchStudentProfile(studentId);
        } else {
            this.errorMessage = 'No student ID found in session.';
        }
    }

    // Fetch student data and related semesters
    fetchStudentProfile(studentId) {
        console.log('Fetching Student Data for ID:', studentId);
        getStudentProfileWithSemesters({ studentId })
            .then(result => {
                console.log('Data Received:', result);
                if (result && result.student) {
                    this.studentData = result.student;
                    this.semesters = result.semesters;

                    // Fetch payment status for each semester asynchronously
                    this.checkPaymentStatus();
                } else {
                    this.errorMessage = 'No profile data found for this Student ID.';
                }
            })
            .catch(error => {
                this.errorMessage = 'Error fetching student profile.';
                console.error('Error:', error);
            });
    }

    checkPaymentStatus() {
        const currentDate = new Date();
    
        Promise.all(
            this.semesters.map((semester, index) =>
                checkIfPaid({ semesterId: semester.Id, studentId: this.studentData.Id })
                    .then(isPaid => {
                        const semesterStartDate = new Date(semester.Start_date__c); // Convert the start date to Date object
    
                        // Disable the button if the current date is before the semester start date
                        const isButtonDisabled = isPaid || currentDate < semesterStartDate;
    
                        // Create a copy of the semester object and add the properties
                        const updatedSemester = {
                            ...semester,
                            isPaid: isPaid,  // Add the isPaid property
                            buttonText: isPaid ? 'Paid' : (currentDate < semesterStartDate ? ' Not Available Yet' : 'Pay'),  // Change button text
                            buttonDisabled: isButtonDisabled  // Disable button if already paid or before the start date
                        };
    
                        return updatedSemester; // Return the updated semester object
                    })
                    .catch(error => {
                        console.error('Error checking payment status:', error);
                        return semester; // If there's an error, keep the original semester object
                    })
            )
        ).then(updatedSemesters => {
            this.semesters = updatedSemesters;
        });
    }
    
    
    

    // Payment Button Logic
    handlePayClick(event) {
        const semesterId = event.target.dataset.id;
        const semester = this.semesters.find(s => s.Id === semesterId);

        if (semester.isPaid) {
            this.paymentStatusMessage = `Payment has already been made for the ${semester.Name} semester.`;
            this.showToast('Info', this.paymentStatusMessage, 'info');
            return;
        }

        // Call Apex to create Razorpay Payment Link if not paid
        createRazorpayPaymentLink({ semesterId, studentId: this.studentData.Id })
            .then(paymentLink => {
                console.log('Razorpay Payment Link Created:', paymentLink);
                this.paymentStatusMessage = 'Payment link created. Please follow the link to complete the payment.';
                this.showToast('Success', this.paymentStatusMessage, 'success');
                sendPaymentLinkEmail({ paymentLink, studentEmail: this.studentData.Email__c });
            })
            .catch(error => {
                this.errorMessage = 'Error creating payment link.';
                console.error('Error:', error);
                this.showToast('Error', 'An error occurred while creating the payment link.', 'error');
            });
    }

    // Show Toast Message
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }
}
