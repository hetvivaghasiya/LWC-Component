import { LightningElement, api, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import uploadFile from '@salesforce/apex/profileImgAcls.uploadFile';  // Apex method to handle the file upload
import getImageUrl from '@salesforce/apex/profileImgAcls.getImageUrl';  // Apex method to retrieve the image URL
import studentProfileImg from '@salesforce/apex/profileImgAcls.studentProfileImg';  // Apex method to retrieve the image URL

export default class ProfileImg extends LightningElement {
    @track studentData={};
    imageUrl; 
    isOverlayClosed = false; 

    connectedCallback() {
        const studentId = sessionStorage.getItem('studentId');
        console.log('📢 Student ID from session:', studentId); // ✅ Debugging

        if (studentId) {
            this.fetchStudentProfile(studentId);
            this.fetchStudentAttachment(studentId);
        } else {
            this.errorMessage = 'No student ID found in session.';
        }
    }

    fetchStudentProfile(studentId) {
        console.log('📢 Fetching Student Data for ID:', studentId); // ✅ Debugging

        studentProfileImg({ studentId })
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

    fetchStudentAttachment(studentId) {
            console.log('📢 Fetching Student Data form Student Attachment ID:', studentId); // ✅ Debugging
    
            getImageUrl({ studentId })
                .then(result => {
                    if (result) {
                        console.log('✅ Image URL:', this.imageUrl);
                        this.imageUrl = result;
                    } else {
                        this.errorMessage = 'No attachment found for this student.';
                    }
                })
                .catch(error => {
                    this.errorMessage = 'Error fetching student image: ' + (error.body ? error.body.message : error);
                    console.error('❌ Error:', this.errorMessage);
                });
        }
    // Method triggered when the upload finishes
    handleUploadFinished(event) {
        // Get the document ID of the uploaded file
        const uploadedFiles = event.detail.files;
        // console.log('✅ Data uploade:', result);

        if (uploadedFiles.length > 0) {
            const documentId = uploadedFiles[0].documentId;
            this.uploadImageToRecord(documentId);
        }
    }

    uploadImageToRecord(documentId) {
        if (this.isOverlayClosed) {
            console.log('Overlay is already closed or in the process of closing');
            return; 
        }
    
        this.isOverlayClosed = true; 
    
        uploadFile({ studentId: sessionStorage.getItem('studentId'), documentId: documentId })
        .then((result) => {
            console.log('Image URL:', result);
            this.imageUrl = result;  
            this.showToast('Success', 'Image uploaded successfully!', 'success');
            this.closeOverlay();
        })
        .catch(error => {
            let errorMessage = 'Unknown error occurred';
            if (error && error.body && error.body.message) {
                errorMessage = error.body.message;
            } else if (error && error.message) {
                errorMessage = error.message;
            }
            
            this.showToast('Error', 'Error uploading image: ' + errorMessage, 'error');
            console.error(error);
        })
        .finally(() => {
            // Reset isOverlayClosed after the process is complete
            this.isOverlayClosed = false;
        });
    }
    

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }

    // HTML template part for showing the image
    get imageSrc() {
        return this.imageUrl;
    }
    get showGraduationDetails() {
        return this.studentData?.Graduation_Year__c && this.studentData?.Graduation_CGPA__c;
    }
    
    
}