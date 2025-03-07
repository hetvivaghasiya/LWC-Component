import { LightningElement, track, api } from 'lwc';
import getStudentProfile from '@salesforce/apex/profileStudentClass.studentProfile';
import uploadStudentImage from '@salesforce/apex/profileStudentClass.uploadStudentImage';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class UploadeDocument extends LightningElement {
    @track studentData = {};
    @track errorMessage = '';
    @track successMessage = '';
    @track selectedFile = null;
    @track selectedMarksheetType = '';

    // ✅ Independent status tracking (Restored from session storage)
    @track tenthMarksheetStatus = 'Not Uploaded';
    @track twelfthMarksheetStatus = 'Not Uploaded';

    connectedCallback() {
        const studentId = sessionStorage.getItem('studentId');
        if (studentId) {
            this.fetchStudentProfile(studentId);
        } else {
            this.errorMessage = 'No student ID found in session.';
        }

        // ✅ Restore status from sessionStorage
        const storedTenthStatus = sessionStorage.getItem('tenthMarksheetStatus');
        const storedTwelfthStatus = sessionStorage.getItem('twelfthMarksheetStatus');

        if (storedTenthStatus) {
            this.tenthMarksheetStatus = storedTenthStatus;
        }
        if (storedTwelfthStatus) {
            this.twelfthMarksheetStatus = storedTwelfthStatus;
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

    handleFileChange(event) {
        this.selectedFile = event.target.files[0];
        this.selectedMarksheetType = event.target.dataset.marksheetType;
    }

    uploadFile(event) {
        const marksheetType = event.target.dataset.marksheetType;

        if (!this.studentData || !this.studentData.Id) {
            this.showToast('Error', 'Student profile not loaded. Please try again.', 'error');
            return;
        }

        if (!this.selectedFile || this.selectedMarksheetType !== marksheetType) {
            this.showToast('Error', `Please select a file for ${marksheetType} marksheet.`, 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result.split(',')[1];

            uploadStudentImage({ 
                studentId: this.studentData.Id, 
                fileName: this.selectedFile.name, 
                base64Data: base64 
            })
            .then(() => {
                if (marksheetType === 'tenth') {
                    this.tenthMarksheetStatus = 'Uploaded';
                    sessionStorage.setItem('tenthMarksheetStatus', 'Uploaded'); // ✅ Save status
                } else if (marksheetType === 'twelfth') {
                    this.twelfthMarksheetStatus = 'Uploaded';
                    sessionStorage.setItem('twelfthMarksheetStatus', 'Uploaded'); // ✅ Save status
                }

                this.showToast('Success', `${marksheetType} Marksheet uploaded successfully ✅`, 'success');

                this.template.querySelector(`input[data-marksheet-type="${marksheetType}"]`).value = '';

                this.selectedFile = null;
                this.selectedMarksheetType = '';
            })
            .catch(error => {
                this.showToast('Error', `Error uploading file: ${error.body?.message || error}`, 'error');
                console.error(error);
            });
        };
        reader.readAsDataURL(this.selectedFile);
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

    get tenthMarksheetClass() {
        return this.tenthMarksheetStatus === 'Uploaded' ? 'status-uploaded' : 'status-not-uploaded';
    }

    get twelfthMarksheetClass() {
        return this.twelfthMarksheetStatus === 'Uploaded' ? 'status-uploaded' : 'status-not-uploaded';
    }
}




// import { LightningElement, track } from 'lwc';
// import getStudentProfile from '@salesforce/apex/profileStudentClass.studentProfile';
// import uploadStudentImage from '@salesforce/apex/profileStudentClass.uploadStudentImage';
// import { ShowToastEvent } from 'lightning/platformShowToastEvent';

// export default class UploadeDocument extends LightningElement {
//     @track studentData = {};
//     @track errorMessage = '';
//     @track selectedFile = null;
//     @track selectedMarksheetType = '';

//     @track tenthMarksheetStatus = 'Not Uploaded';
//     @track twelfthMarksheetStatus = 'Not Uploaded';

//     connectedCallback() {
//         const studentId = this.getCookie('studentId');
//         if (studentId) {
//             this.fetchStudentProfile(studentId);
//         } else {
//             this.errorMessage = 'No student ID found in cookies.';
//         }

//         // Restore status from cookies
//         this.tenthMarksheetStatus = this.getCookie('tenthMarksheetStatus') || 'Not Uploaded';
//         this.twelfthMarksheetStatus = this.getCookie('twelfthMarksheetStatus') || 'Not Uploaded';
//         this.refreshUI();
//     }

//     async fetchStudentProfile(studentId) {
//         try {
//             const result = await getStudentProfile({ studentId });
//             if (result) {
//                 this.studentData = result;
//             } else {
//                 this.errorMessage = 'No profile data found for this Student ID.';
//             }
//         } catch (error) {
//             this.errorMessage = 'Error fetching student profile.';
//             console.error('Error:', error);
//         }
//     }

//     handleFileChange(event) {
//         this.selectedFile = event.target.files[0];
//         this.selectedMarksheetType = event.target.dataset.marksheetType;
//     }

//     async uploadFile(event) {
//         const marksheetType = event.target.dataset.marksheetType;
    
//         if (!this.studentData?.Id) {
//             this.showToast('Error', 'Student profile not loaded. Please try again.', 'error');
//             return;
//         }
    
//         if (!this.selectedFile || this.selectedMarksheetType !== marksheetType) {
//             this.showToast('Error', `Please select a file for ${marksheetType} marksheet.`, 'error');
//             return;
//         }
    
//         try {
//             console.log('📢 Preparing to upload file:', this.selectedFile.name);
//             const base64 = await this.readFileAsBase64(this.selectedFile);
//             console.log('📢 Base64 content of file:', base64.substring(0, 100));
    
//             const response = await uploadStudentImage({
//                 studentId: this.studentData.Id,
//                 fileName: this.selectedFile.name,
//                 base64Data: base64
//             });
    
//             console.log('📢 Response from Apex:', response);
    
//             if (response === 'File uploaded successfully') {  // ✅ Ensure response matches Apex return
//                 if (marksheetType === 'tenth') {
//                     this.tenthMarksheetStatus = 'Uploaded'; 
//                     this.setCookie('tenthMarksheetStatus', 'Uploaded');
//                 } else if (marksheetType === 'twelfth') {
//                     this.twelfthMarksheetStatus = 'Uploaded'; 
//                     this.setCookie('twelfthMarksheetStatus', 'Uploaded');
//                 }
    
//                 console.log('✅ Updated Status:', this.tenthMarksheetStatus, this.twelfthMarksheetStatus);
    
//                 this.showToast('Success', `${marksheetType} Marksheet uploaded successfully ✅`, 'success');
    
//                 // ✅ Force LWC UI Refresh
//                 this.refreshUI();
//             } else {
//                 this.showToast('Error', `Failed to upload ${marksheetType} Marksheet.`, 'error');
//             }
//         } catch (error) {
//             this.showToast('Error', `Error uploading file: ${error.body?.message || error}`, 'error');
//             console.error(error);
//         }
//     }
    
//    refreshUI() {
//     this.tenthMarksheetStatus = this.tenthMarksheetStatus === 'Uploaded' ? 'Uploaded ' : 'Uploaded'; 
//     this.twelfthMarksheetStatus = this.twelfthMarksheetStatus === 'Uploaded' ? 'Uploaded ' : 'Uploaded'; 
// }

    
//     readFileAsBase64(file) {
//         return new Promise((resolve, reject) => {
//             const reader = new FileReader();
//             reader.onload = () => resolve(reader.result.split(',')[1]);
//             reader.onerror = error => reject(error);
//             reader.readAsDataURL(file);
//         });
//     }

//     showToast(title, message, variant) {
//         this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
//     }

//     get tenthMarksheetClass() {
//         return this.tenthMarksheetStatus === 'Uploaded' ? 'status-uploaded' : 'status-not-uploaded';
//     }

//     get twelfthMarksheetClass() {
//         return this.twelfthMarksheetStatus === 'Uploaded' ? 'status-uploaded' : 'status-not-uploaded';
//     }

//     // Helper Methods to Handle Cookies
//     setCookie(name, value, days = 365) {
//         let expires = "";
//         if (days) {
//             const date = new Date();
//             date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
//             expires = "; expires=" + date.toUTCString();
//         }
//         document.cookie = name + "=" + value + "; path=/" + expires;
//     }

//     getCookie(name) {
//         const cookies = document.cookie.split('; ');
//         for (let cookie of cookies) {
//             const [cookieName, cookieValue] = cookie.split('=');
//             if (cookieName === name) {
//                 return cookieValue;
//             }
//         }
//         return null;
//     }
// }
