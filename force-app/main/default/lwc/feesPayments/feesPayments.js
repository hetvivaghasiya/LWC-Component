import { LightningElement, track, api } from 'lwc';
import getStudentProfileWithSemesters from '@salesforce/apex/feesPaymentSem.getStudentProfileWithSemesters';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class FeesPayments extends LightningElement {
    @track studentData = {};
    @track semesters = [];
    @track errorMessage = '';

    connectedCallback() { 
        const studentId = sessionStorage.getItem('studentId'); 
        console.log('📢 Student ID from session:', studentId); // ✅ Debugging
        
        if (studentId) {
            this.fetchStudentProfile(studentId);
        } else {
            this.errorMessage = 'No student ID found in session.';
        }
    }

    fetchStudentProfile(studentId) {
        console.log('📢 Fetching Student Data for ID:', studentId); // ✅ Debugging
        getStudentProfileWithSemesters({ studentId })
            .then(result => {
                console.log('✅ Data Received:', result);
                if (result && result.student) {
                    this.studentData = result.student;
                    this.semesters = result.semesters;
                } else {
                    this.errorMessage = 'No profile data found for this Student ID.';
                }
            })
            .catch(error => {
                this.errorMessage = 'Error fetching student profile.';
                console.error('❌ Error:', error);
            });
    }

    //Payment Button
    handlePayClick(event) {
        const semesterId = event.target.dataset.id;
        console.log('📝 Pay button clicked for Semester ID:', semesterId);
    
        // Show a toast message
        this.showToast('Payment Initiated', `Payment started for Semester ID: ${semesterId}`, 'success');
    
        // You can add payment logic here (e.g., navigate to a payment page)
    }
    

    // ✅ Toast Notification Function
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }
}
