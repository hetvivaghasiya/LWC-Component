import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getCollegeIdByStudentId from '@salesforce/apex/FacultyCardClass.getCollegeIdByStudentId';
import fetchFacultyForCollege from '@salesforce/apex/FacultyCardClass.fetchFacultyForCollege';

export default class FacultyCard extends LightningElement {
    @track facultyList = [];  // Store fetched faculty data
    @track errorMessage = '';  // Store error messages
    @track studentId; // Store student ID
    @track collegeId; // Store college ID

    connectedCallback() {
        // Fetch studentId from sessionStorage (or elsewhere)
        this.studentId = sessionStorage.getItem('studentId');
        
        if (this.studentId) {
            this.fetchCollegeIdForStudent(this.studentId);  // Get the collegeId for the student
        } else {
            this.errorMessage = 'No student ID found in session.';
        }
    }

    // Fetch the college ID by studentId
    fetchCollegeIdForStudent(studentId) {
        getCollegeIdByStudentId({ studentId })
            .then(result => {
                if (result) {
                    this.collegeId = result;  // Set the collegeId
                    this.fetchFacultyData(this.collegeId); // Fetch faculty data using the collegeId
                } else {
                    this.errorMessage = 'No college found for this student.';
                }
            })
            .catch(error => {
                this.errorMessage = 'Error fetching college ID.';
                console.error('Error:', error);
            });
    }

    // Fetch faculty for the given collegeId
    fetchFacultyData(collegeId) {
        fetchFacultyForCollege({ collegeId })
            .then(result => {
                if (result && result.length > 0) {
                    // Add showTable field to manage visibility of the faculty table
                    this.facultyList = result.map(faculty => ({
                        ...faculty,
                        showTable: false  // Initially, all cards are collapsed
                    }));
                } else {
                    this.errorMessage = 'No faculty found for this college.';
                }
            })
            .catch(error => {
                this.errorMessage = 'Error fetching faculty list.';
                console.error('Error:', error);
            });
    }

    // Handle click event on each faculty card
    handleCardClick(event) {
        const clickedFacultyId = event.currentTarget.dataset.id; // Get the faculty ID from the clicked card
        this.facultyList = this.facultyList.map(faculty => {
            if (faculty.Id === clickedFacultyId) {
                faculty.showTable = !faculty.showTable; // Toggle the visibility
            }
            return faculty;
        });
    }
}


