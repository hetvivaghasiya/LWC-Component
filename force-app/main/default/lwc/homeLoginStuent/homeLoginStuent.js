// import { LightningElement, track, api,wire } from 'lwc';
// import studentProfileImg from '@salesforce/apex/homeStudentLoginClass.studentProfileImg';
// import getEvents from '@salesforce/apex/homeStudentLoginClass.getEvents';
// import registerStudentForEvent from '@salesforce/apex/homeStudentLoginClass.registerStudentForEvent';

// // import getSubjectsByCourse from '@salesforce/apex/homeStudentLoginClass.getSubjectsByCourse';
// import customImage from './homeLoginS.html'; 

// export default class HomeLoginStudent extends LightningElement {
//     static customTypes = {
//             customImage: {
//                 template: customImage,
//                 typeAttributes: ['title']
//             }
    
//         }

//         @track isModalOpen = false;
//         @track studentData = {};
//         @track events = [];
//         @track selectedSubject = {};
//         @track userName = '';
//         @track userEmail = '';
//         @track showSuccessMessage = false;
//         @track showErrorMessage = false;
//         @track collegeImage='';
//         @track collegeName='';
//         @track collegeDes='';
//         @track event='';
//         errorMessage = '';
    
//         connectedCallback() {
//             const studentId = sessionStorage.getItem('studentId');

//             console.log('Student ID from session:', studentId);
//             if (studentId) {
//                 this.fetchStudentProfile(studentId);
//             } else {
//                 this.errorMessage = 'No student ID found in session.';
//             }
//         }
    
//         fetchStudentProfile(studentId) {
//             studentProfileImg({ studentId })
//                 .then(result => {
//                     if (result) {
//                         this.studentData = result;
//                         this.fetchSubjects(result.Course__c, result.College__c);
//                     // Check if College__r and its fields exist
//                     if (result.College__r) {
//                         this.collegeImage = result.College__r.college_Image__c || '';
//                         this.collegeName = result.College__r.Name || 'We will help you find the right workplace for you.';
//                         this.collegeDes = result.College__r.Description__c || 'We will help you find the right workplace for you.';
//                         console.log('College Name:', this.collegeName);
//                         console.log('College Image:', this.collegeImage);
//                     } else {
//                         console.warn('⚠ No College Data found.');
//                         this.collegeName = 'We will help you find the right workplace for you.';    
//                     }

//                     } else {
//                         this.errorMessage = 'No profile data found for this Student ID.';
//                     }
//                 })
//                 .catch(error => {
//                     this.errorMessage = 'Error fetching student profile.';
//                     console.error('Error:', error);
//                 });
//         }
    
//         fetchSubjects(course, college) {
//             getEvents({ course, college })
//                 .then(result => {
//                     console.log('events:', this.events);
//                     this.events = result;
//                 })
//                 .catch(error => {
//                     console.error('Error fetching events:', error);
//                     this.errorMessage = 'Error fetching events.';
//                 });
//         }

     
        
      
//         handleOpenModal(event) {
//             // this.isModalOpen = true;
//             // this.selectedSubject = {
//             //     Id: event.target.dataset.id,
//             //     Name: event.target.dataset.name
//             // };

//             const studentId = sessionStorage.getItem('studentId'); // Get Student ID from session

//                 if (!studentId) {
//                     console.error("No student ID found in session.");
//                     return;
//                 }

//                 this.isModalOpen = true;
//                 this.selectedSubject = {
//                     Id: event.target.dataset.id, 
//                     Name: event.target.dataset.name 
//                 };
//                 this.userName = this.studentData.Name__c || '';  
//                 this.userEmail = this.studentData.Email__c || '';
//             }



//         handleSubmit() {    
//             if (this.userName && this.userEmail) {
//                 const studentId = sessionStorage.getItem('studentId');
//                 const eventId = this.selectedSubject.Id;
        
//                 registerStudentForEvent({ studentId, eventId })
//                     .then(result=> {
//                         this.showSuccessMessage = true;
//                         this.message = result;
        
//                         setTimeout(() => {  
//                             this.showSuccessMessage = false;
//                             this.handleCloseModal();
//                         }, 2000);
//                     })
//                     .catch(error => {
//                         console.error('Error registering:', error);
//                     });    
//             }
//         }
        

    
//         handleCloseModal() {
//             this.isModalOpen = false;
//             this.showSuccessMessage = false; // Hide success message when closing
//         }
    
//         handleInputChange(event) {
//             const field = event.target.dataset.field;
//             this[field] = event.target.value;
//         }

// }


import { LightningElement, track } from 'lwc';
import studentProfileImg from '@salesforce/apex/homeStudentLoginClass.studentProfileImg';
import getEvents from '@salesforce/apex/homeStudentLoginClass.getEvents';
import registerStudentForEvent from '@salesforce/apex/homeStudentLoginClass.registerStudentForEvent';

export default class HomeLoginStudent extends LightningElement {
    @track isModalOpen = false;
    @track studentData = {};
    @track events = [];
    @track selectedEvent = {};
    @track userName = '';
    @track userEmail = '';
    @track showSuccessMessage = false;
    @track showErrorMessage = false;
    @track collegeImage = '';
    @track collegeName = '';
    @track collegeDes = '';
    errorMessage = '';

    connectedCallback() {
        const studentId = sessionStorage.getItem('studentId');
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
                    this.userName = result.Name;
                    this.userEmail = result.Email__c;
                    if (result.College__r) {
                        this.collegeImage = result.College__r.college_Image__c || '';
                        this.collegeName = result.College__r.Name || 'College Name';
                        this.collegeDes = result.College__r.Description__c || 'College Description';
                    }
                    this.fetchEvents(result.Course__c, result.College__c);
                }
            })
            .catch(error => {
                this.errorMessage = error.body.message;
            });
    }

    fetchEvents(course, college) {
        getEvents({ course, college })
            .then(result => {
                this.events = result;
            })
            .catch(error => {
                this.errorMessage = error.body.message;
            });
    }

    handleOpenModal(event) {
        const eventId = event.target.dataset.id;
        this.selectedEvent = this.events.find(e => e.Id === eventId);
        this.isModalOpen = true;
    }

    handleCloseModal() {
        this.isModalOpen = false;
        this.showSuccessMessage = false;
        this.showErrorMessage = false;
    }

    handleSubmit() {
        registerStudentForEvent({ studentId: this.studentData.Name, eventId: this.selectedEvent.Id })
            .then(result => {
                if (result.includes('Success')) {
                    this.showSuccessMessage = true;
                    this.showErrorMessage = false;
                } else {
                    this.showErrorMessage = true;
                    this.errorMessage = result;
                }
            })
            .catch(error => {
                this.showErrorMessage = true;
                this.errorMessage = error.body.message;
            });
    }
}
