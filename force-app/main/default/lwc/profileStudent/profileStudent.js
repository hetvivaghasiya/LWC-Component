// import { LightningElement,track, wire,api } from 'lwc';
// import getStudentProfile from '@salesforce/apex/profileStudentClass.studentProfile';
// import uploadStudentImage from '@salesforce/apex/profileStudentClass.uploadStudentImage';

// export default class ProfileStudent extends LightningElement {
//     @track studentData; 
//     @track errorMessage = '';
//     @track successMessage = ''; // ✅ Success message


//     connectedCallback() {
//         const studentId = sessionStorage.getItem('studentId'); // Get stored student ID
//         console.log(sessionStorage.getItem('studentId'));

        
//         if (studentId) {
//             this.fetchStudentProfile(studentId);
            
//         } else {
//             this.errorMessage = 'No student ID found in session.';
//         }
//     }

    // fetchStudentProfile(studentId) {
    //     getStudentProfile({ studentId })
    //         .then(result => {
    //             if (result) {
    //                 this.studentData = result;
    //             } else {
    //                 this.errorMessage = 'No profile data found for this Student ID.';
    //             }
    //         })
    //         .catch(error => {
    //             this.errorMessage = 'Error fetching student profile.';
    //             console.error('Error:', error);
    //         });
    //     }
//         //Upload files 
//         handleFileChange(event) {
//             this.selectedFile = event.target.files[0];
//         }

//         uploadFile() {
//             if (!this.selectedFile) {
//                 alert('Please select a file first.');
//                 return;
//             }

//             const reader = new FileReader();
//             reader.onload = () => {
//                 const base64 = reader.result.split(',')[1];
//                 uploadStudentImage({ studentId: this.studentData.Id, fileName: this.selectedFile.name, base64Data: base64 })
//                     .then(() => {
//                         this.successMessage = 'File uploaded successfully ✅';

//                          // Fetch the recent uploaded image
//                     // this.fetchRecentImage(this.studentData.Id);

//                         // Clear success message after 3 seconds
//                         setTimeout(() => {
//                             this.successMessage = '';
//                             // this.fetchRecentImage(this.studentData.Id);
//                         }, 2500);
//                     })
//                     .catch(error => {
//                         alert('Error uploading file: ' + error.body.message);
//                         console.error(error);
//                     });
//             };
//             reader.readAsDataURL(this.selectedFile);
//         }



        

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
// }



import { LightningElement, track, api, wire } from 'lwc';
import getStudentProfile from '@salesforce/apex/profileStudentClass.studentProfile';
import uploadStudentImage from '@salesforce/apex/profileStudentClass.uploadStudentImage';
import getStudentAttachment from '@salesforce/apex/profileStudentClass.getStudentAttachment';

export default class ProfileStudent extends LightningElement {
    @track studentData;
    @track errorMessage = '';
    @track successMessage = '';
    studentId='a04dL000001h8plQAA';
    studentImageUrl ; 
    // fileName = 'https://kriittechnologies44-dev-ed.develop.my.salesforce.com/sfc/p/dL00000JDyBm/a/dL0000004f7p/lb7TYT6s1qgdv3nSZfgk5b.vOnQrj_mlun9QMIAoKmo';// Store image URL

    connectedCallback() {
        const studentId = sessionStorage.getItem('studentId');
        if (studentId) {
            this.fetchStudentProfile(studentId);
            this.fetchStudentAttachment();
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

    fetchStudentAttachment() {
        if (!this.studentId) {
            this.errorMessage = 'Student ID is missing!';
            return;
        }

        getStudentAttachment({ studentId: this.studentId })
            .then(result => {
                if (result) {
                    this.studentImageUrl = result;
                    console.log('✅ Image URL:', this.studentImageUrl);
                } else {
                    this.errorMessage = 'No attachment found for this student.';
                }
            })
            .catch(error => {
                this.errorMessage = 'Error fetching student image: ' + (error.body ? error.body.message : error);
                console.error('❌ Error:', this.errorMessage);
            });
    }
    
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
                    setTimeout(() => {
                        this.successMessage = '';
                        this.fetchStudentAttachment(); // Refresh image
                    }, 2500);
                })
                .catch(error => {
                    alert('Error uploading file: ' + error.body.message);
                    console.error(error);
                });
        };
        reader.readAsDataURL(this.selectedFile);
    }
    
}



