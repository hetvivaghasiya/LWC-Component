import { LightningElement, track, api,wire } from 'lwc';
import studentProfileImg from '@salesforce/apex/homeStudentLoginClass.studentProfileImg';
import getEvents from '@salesforce/apex/homeStudentLoginClass.getEvents';
// import getSubjectsByCourse from '@salesforce/apex/homeStudentLoginClass.getSubjectsByCourse';
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
        @track collegeImage='';
        @track collegeName='';
        @track collegeDes='';
        @track event='';
        errorMessage = '';
    
        connectedCallback() {
            const studentId = sessionStorage.getItem('studentId');
            console.log('Student ID from session:', studentId);
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
                    // Check if College__r and its fields exist
                    if (result.College__r) {
                        this.collegeImage = result.College__r.college_Image__c || '';
                        this.collegeName = result.College__r.Name || 'We will help you find the right workplace for you.';
                        this.collegeDes = result.College__r.Description__c || 'We will help you find the right workplace for you.';
                        console.log('College Name:', this.collegeName);
                        console.log('College Image:', this.collegeImage);
                    } else {
                        console.warn('⚠ No College Data found.');
                        this.collegeName = 'We will help you find the right workplace for you.';    
                    }

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
            getEvents({ course, college })
                .then(result => {
                    this.events = result;
                    console.log('events:', this.events);
                })
                .catch(error => {
                    console.error('Error fetching events:', error);
                    this.errorMessage = 'Error fetching events.';
                });
        }

        // fetchSubjects(courseId) {
        //     getSubjectsByCourse({ courseId })
        //         .then(result => {
        //             this.subjects = result;
        //             console.log('events:', this.subjects);
        //         })
        //         .catch(error => {
        //             console.error('Error fetching events:', error);
        //             this.errorMessage = 'Error fetching events.';
        //         });
        // }
        
      
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
