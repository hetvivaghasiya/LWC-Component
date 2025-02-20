import { LightningElement,track, wire,api } from 'lwc';
import getStudentProfile from '@salesforce/apex/profileStudentClass.studentProfile';
import uploadStudentImage from '@salesforce/apex/profileStudentClass.uploadStudentAttachment';
// import getStudentImage from '@salesforce/apex/profileStudentClass.getStudentProfileImage';

export default class ProfileStudent extends LightningElement {
    @track studentData;
    @track errorMessage = '';

    @track uploadSuccessMessage = '';
    @track uploadErrorMessage = '';
    fileData=null;
   

    connectedCallback() {
        const studentId = sessionStorage.getItem('studentId'); // Get stored student ID
        console.log(sessionStorage.getItem('studentId'));

        
        if (studentId) {
            this.fetchStudentProfile(studentId);
            
        } else {
            this.errorMessage = 'No student ID found in session.';
        }
    }

    fetchStudentProfile(studentId) {
        getStudentProfile({ studentId })
            .then(result => {
                if (result) {
                    this.studentData = result;
                } else {
                    this.errorMessage = 'No profile data found for this Student ID.';
                }
            })
            .catch(error => {
                this.errorMessage = 'Error fetching student profile.';
                console.error('Error:', error);
            });
    }


    //upload Image
    handleFileChange(event) {
        const file = event.target.files[0];
        
        if (!file) {
            this.uploadErrorMessage = 'No file selected.';
            return;
        }
    
        if (file.size > 26214400) { // 25MB limit
            this.uploadErrorMessage = 'File size exceeds 25MB limit.';
            return;
        }
    
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result.split(',')[1];
            this.fileData = {
                filename: file.name,
                base64: base64,
                studentId: sessionStorage.getItem('studentId')
            };
        };
        reader.readAsDataURL(file);
        this.uploadErrorMessage = '';
    }
    
    handleUpload() {
        if (!this.fileData || !this.fileData.base64) {
            this.uploadErrorMessage = 'Please select a file first.';
            return;
        }

        if (!this.fileData.studentId) {
            this.uploadErrorMessage = 'Student ID not found.';
            return;
        }

        uploadStudentImage({
            studentId: this.fileData.studentId,
            fileName: this.fileData.filename,
            base64Data: this.fileData.base64
        })
        .then(() => {
            this.uploadSuccessMessage = 'Image uploaded successfully!';
            this.uploadErrorMessage = '';
            this.fileData = null; // Reset fileData after successful upload
        })
        .catch(error => {
            this.uploadErrorMessage = 'Error uploading file: ' + error.body.message;
            console.error('Upload Error:', error);
        });
    }
   

}