import { LightningElement, track, api,wire } from 'lwc';
import studentProfileImg from '@salesforce/apex/homeStudentLoginClass.studentProfileImg';
import getSubjects from '@salesforce/apex/homeStudentLoginClass.getSubjects';
import customImage from './homeLoginS.html'; 

export default class HomeLoginStudent extends LightningElement {
    static customTypes = {
            customImage: {
                template: customImage,
                typeAttributes: ['title']
            }
    
        }

        @track isModalOpen = false;
        @track studentData = {};
        @track events = [];
        @track selectedSubject = {};
        @track userName = '';
        @track userEmail = '';
        @track showSuccessMessage = false;
        @track event='';
        errorMessage = '';
    
        connectedCallback() {
            const studentId = sessionStorage.getItem('studentId');
            console.log('📢 Student ID from session:', studentId);
            if (studentId) {
                this.fetchStudentProfile(studentId);
            } else {
                this.errorMessage = 'No student ID found in session.';
            }
        }
    
        fetchStudentProfile(studentId) {
            studentProfileImg({ studentId })
                .then(result => {
                    if (result) {
                        this.studentData = result;
                        this.fetchSubjects(result.Course__c, result.College__c);
                    } else {
                        this.errorMessage = 'No profile data found for this Student ID.';
                    }
                })
                .catch(error => {
                    this.errorMessage = 'Error fetching student profile.';
                    console.error('Error:', error);
                });
        }
    
        fetchSubjects(course, college) {
            getSubjects({ course, college })
                .then(result => {
                    this.events = result;
                    console.log('📢 events:', this.events);
                })
                .catch(error => {
                    console.error('Error fetching events:', error);
                    this.errorMessage = 'Error fetching events.';
                });
        }
        
      
        handleOpenModal(event) {
            this.isModalOpen = true;
            this.selectedSubject = {
                Id: event.target.dataset.id,
                Name: event.target.dataset.name
            };
        }
    
        handleCloseModal() {
            this.isModalOpen = false;
            this.showSuccessMessage = false; // Hide success message when closing
        }
    
        handleInputChange(event) {
            const field = event.target.dataset.field;
            this[field] = event.target.value;
        }
    
        handleSubmit() {
            if (this.userName && this.userEmail) {
                this.showSuccessMessage = true; // Show success message
    
                // Optional: Clear input fields
                this.userName = '';
                this.userEmail = '';
    
                // Hide message after 3 seconds
                setTimeout(() => {  
                    this.showSuccessMessage = false;
                    this.handleCloseModal();
                }, 2000);
            }
        }
}
