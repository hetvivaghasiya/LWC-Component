import { LightningElement,track, wire,api } from 'lwc';
import getStudentProfile from '@salesforce/apex/profileStudentClass.studentProfile';
import uploadStudentImage from '@salesforce/apex/profileStudentClass.uploadStudentImage';
import getLastUploadedImage from '@salesforce/apex/profileStudentClass.getLastUploadedImage';



export default class ProfileStudent extends LightningElement {
    @track studentData; 
    @track errorMessage = '';
    @track successMessage = ''; // ✅ Success message
    @track selectedFile;
     @track imageUrl;// ✅ Stores the uploaded image URL

  
   

    connectedCallback() {
        const studentId = sessionStorage.getItem('studentId'); // Get stored student ID
        console.log(sessionStorage.getItem('studentId'));

        
        if (studentId) {
            this.fetchStudentProfile(studentId);
            //   this.fetchRecentImage(studentId);
            
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


        //Upload files 
        handleFileChange(event) {
            this.selectedFile = event.target.files[0];
        }

        uploadFile() {
            if (!this.selectedFile) {
                alert('Please select a file first.');
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result.split(',')[1];
                uploadStudentImage({ studentId: this.studentData.Id, fileName: this.selectedFile.name, base64Data: base64 })
                    .then(() => {
                        this.successMessage = 'File uploaded successfully ✅';

                         // Fetch the recent uploaded image
                    // this.fetchRecentImage(this.studentData.Id);

                        // Clear success message after 3 seconds
                        setTimeout(() => {
                            this.successMessage = '';
                            // this.fetchRecentImage(this.studentData.Id);
                        }, 2500);
                    })
                    .catch(error => {
                        alert('Error uploading file: ' + error.body.message);
                        console.error(error);
                    });
            };
            reader.readAsDataURL(this.selectedFile);
        }

    // ID of the record (e.g., Account, Case)
        imageUrl;
    
        @wire(getLastUploadedImage, { studentId: '$studentId' })
        wiredImage({ error, data }) {
            if (data) {
                console.log('Fetched Image Data:', JSON.stringify(data));
                this.imageUrl = `/sfc/servlet.shepherd/version/download/${data.LatestPublishedVersionId}`;
                console.log('Image :'+this.imageUrl);
            } else if (error) {
                console.error('Error fetching image:', error);
            }
        }
        
    // handleFileUpload(event) {
    //     const file = event.target.files[0];

    //     if (file) {
    //         console.log('Selected file:', file.name);
    //         const reader = new FileReader();
    //         reader.onload = () => {
    //             const base64 = reader.result.split(',')[1]; // Extract base64 data
    //             console.log('Base64 Data Length:', base64.length);

    //             if (!this.studentData || !this.studentData.Id) {
    //                 console.error('Error: Student ID not available.');
    //                 alert('Student ID is missing. Cannot upload image.');
    //                 return;
    //             }

    //             const studentId = this.studentData.Id;
    //             console.log('Uploading Image for Student ID:', studentId);

    //             uploadStudentImage({ studentId, fileName: file.name, base64Data: base64 })
    //                 .then(result => {
    //                     console.log('Upload Success:', result);
    //                 })
    //                 .catch(error => {
    //                     console.error('Error uploading file:', error);
    //                 });
    //         };
    //         reader.readAsDataURL(file);
    //     } else {
    //         console.error('No file selected.');
    //     }
    // }
}