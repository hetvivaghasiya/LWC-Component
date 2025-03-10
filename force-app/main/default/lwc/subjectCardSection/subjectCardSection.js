import { LightningElement, track } from 'lwc';
import fetchSubjectsForStudent from '@salesforce/apex/subjectSectionClass.fetchSubjectsForStudent';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class SubjectListDisplay extends LightningElement {
    @track subjects = [];  // Store fetched subjects
    @track errorMessage = '';  // Store error messages

    // Fetch subjects when the component is initialized
    connectedCallback() {
        const studentId = sessionStorage.getItem('studentId');
        if (studentId) {
            this.fetchSubjectsForStudent(studentId);
        } else {
            this.errorMessage = 'No student ID found in session.';
        }
    }

    // Call the Apex method to fetch subjects for a specific student
    fetchSubjectsForStudent(studentId) {
        fetchSubjectsForStudent({ studentId })
            .then(result => {
                if (result && result.length > 0) {
                    // Add showTable field to manage visibility of the subject table
                    this.subjects = result.map(subject => ({
                        ...subject,
                        showTable: false,  // Initialize showTable to false
                    }));
                } else {
                    this.errorMessage = 'No subjects found for this student.';
                }
            })
            .catch(error => {
                this.errorMessage = 'Error fetching student subjects.';
                console.error('Error:', error);
            });
    }

    // Handle click event on each subject card
    handleCardClick(event) {
        const clickedSubjectId = event.currentTarget.dataset.id;
        // Toggle the visibility of the subject table
        this.subjects = this.subjects.map(subject => {
            if (subject.Id === clickedSubjectId) {
                subject.showTable = !subject.showTable;
            }
            return subject;
        });
    }
}
