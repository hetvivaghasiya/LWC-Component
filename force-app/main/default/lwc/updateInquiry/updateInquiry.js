import { LightningElement, api, track, wire } from 'lwc';
import updateStudentInquiryLead from '@salesforce/apex/UpdateStudentInquiry.updateStudentInquiryLead';
import getStudentInquiryLead from '@salesforce/apex/UpdateStudentInquiry.getInquiryData';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CurrentPageReference } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';



export default class UpdateInquiry extends NavigationMixin(LightningElement) {
    @api leadId;
    @api recordId;
    fieldValues;


    @track studentLead = {};

    
    // @track email;

    @track firstName;
    @track middleName;
    @track lastName;
    @track email;   
    @track phone;
    @track gender;
    @track street;
    @track country;
    @track city;
    @track state;
    @track xpy;
    @track xper;
    @track xipy;
    @track xiper;
    

    connectedCallback() {
        this.getLeadIdFromUrl();
        if (this.leadId) {
            this.fetchLeadData();
        }
    }

    getLeadIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        this.leadId = urlParams.get('leadId');
        if (!this.leadId) {
            console.error('No leadId found in URL');
            return;
        }
        console.log('Lead ID from URL:', this.leadId);
    }

    fetchLeadData() {
        if (this.leadId) {
            getStudentInquiryLead({ leadId: this.leadId })
                .then(result => {
                    if (result) {
                        this.firstName = result.First_Name__c;
                        this.middleName = result.Middle_Name__c;
                        this.lastName = result.Last_Name__c;
                        this.email = result.Email__c;
                        this.phone = result.Phone__c;
                        this.gender = result.Gender__c;
                        this.street = result.Street__c;
                        this.city = result.City__c;
                        this.country = result.Country__c;
                        this.state = result.State__c;
                        this.xpy = result.X10th_Pass_Year__c;
                        this.xper = result.X10th_Percentage__c;
                        this.xipy = result.X12th_Pass_Year__c;
                        this.xiper = result.X12th_Percentage__c;
                    } else {
                        console.error('No lead data found.');
                    }
                })
                .catch(error => {
                    console.error('Error fetching lead data: ', error);
                });   
        }
    }
    
    genderOptions = [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
        { label: 'Other', value: 'Other' }
    ];


    handleInputChange(event) {
        // const fieldName = event.target.name; 
        this[event.target.name] = event.target.value; 
    }

   
        
    //Update record call "Update Button"
    handleUpdate() {  
        if (!this.leadId) {
            console.error('Lead ID is missing');
            return;
        }
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Updating Student Details and check your Email...',
                message: 'Please wait while we update the student record...',
                variant: 'info'
            })
        );
        const fieldValues = {
            First_Name__c: this.firstName,
            Middle_Name__c: this.middleName,
            Last_Name__c: this.lastName,
            Email__c: this.email,
            Phone__c: this.phone,
            Gender__c: this.gender,
            Street__c: this.street,
            City__c: this.city,
            Country__c: this.country,
            State__c: this.state,
            X10th_Pass_Year__c: this.xpy ? parseInt(this.xpy, 10) : null,  // Convert to Integer
            X10th_Percentage__c: this.xper ? parseFloat(this.xper) : null,  // Convert to Decimal
            X12th_Pass_Year__c: this.xipy ? parseInt(this.xipy, 10) : null,  // Convert to Integer
            X12th_Percentage__c: this.xiper ? parseFloat(this.xiper) : null
        };
        console.log('===fieldValues=====',fieldValues);
        
        updateStudentInquiryLead({ leadId: this.leadId,fieldValues : fieldValues })
        .then(registrationStudentId => {
            if (registrationStudentId.startsWith('Error')) {
                throw new Error(registrationStudentId);
            }
        // const guestSiteUrl = `https://kriittechnologies44-dev-ed.develop.my.site.com/studentEnrollmentProcess/schedule-date?registrationId=${registrationStudentId}`;

        // this[NavigationMixin.Navigate]({
        //     type: 'standard__webPage',
        //     attributes: {
        //         url: guestSiteUrl
        //     }
        // });

        // Refresh lead data after update
        return refreshApex(this.wiredLeadResponse);
    })
            .then(result => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: result,
                        variant: 'success'
                    })
                );
              
                console.log("firstName ========",this.firstName);
                console.log("middleName ========",this.middleName);
                console.log("Phone ========",this.phone);
                
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error updating lead',
                        message: error.body ? error.body.message : error.message,
                        variant: 'error'
                    })
                );  
            });
            

           

            // leadId = 'some-lead-id'; 
                    // Construct the URL to the guest site
                    // const guestSiteUrl = `https://kriittechnologies44-dev-ed.develop.my.site.com/studentEnrollmentProcess/schedule-date?leadId=${this.leadId}`;
                    
                    // // Navigate to the guest site URL
                    // this[NavigationMixin.Navigate]({
                    //     type: 'standard__webPage',
                    //     attributes: {
                    //         url: guestSiteUrl
                    //     }
                    // });
                    // Redirect to guest site with Registration Student ID
               
            
                
            //Navigate Date Schedule
           
                // this[NavigationMixin.Navigate]({
                //     type:"comm__namedPage",
                //     attributes:{
                //         name:"Schedule_Date__c",
                //     } 
                // });
            

            // //send mail
            // sendEmail()
            // .then(result => {
            //     this.dispatchEvent(
            //         new ShowToastEvent({
            //             title: 'Success',
            //             message: result,
            //             variant: 'success'
            //         })
            //     );
            //     console.log("email send From JS..");
            // })
            // .catch(error => {
            //     this.dispatchEvent(
            //         new ShowToastEvent({
            //             title: 'Error updating lead',
            //             message: error.body ? error.body.message : error.message,
            //             variant: 'error'
            //         })
            //     );  
            // });
    }




    
    // Handle form errors
    handleError(event) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error',
                message: event.detail.message,
                variant: 'error'
            })
        );
    }

    @wire(CurrentPageReference)
    setCurrentPageReference(currentPageReference) {
        if (currentPageReference && currentPageReference.state.leadId) {
            this.leadId = currentPageReference.state.leadId;  
            console.log('PageReference ID from URL:', this.leadId);
            this.fetchLeadData();  
        }
    }
}