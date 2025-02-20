import { LightningElement } from 'lwc';
import sendInquiryLeadEmail from '@salesforce/apex/SendMailSchedule.sendEmail';

export default class SendEmailScedule extends LightningElement {
    showMessage = false;
    message = '';
    messageClass = '';

    // Handler for button click
    handleSendEmail() {
        sendInquiryLeadEmail()
            .then(() => {
                // Success message
                this.message = 'Emails scheduled successfully!';
                this.messageClass = 'slds-text-color_success';
            })
            .catch((error) => {
                // Error message
                this.message = 'Error scheduling emails: ' + error.body.message;
                this.messageClass = 'slds-text-color_error';
            })
            .finally(() => {
                // Show message
                this.showMessage = true;
                // Hide message after 3 seconds
                setTimeout(() => {
                    this.showMessage = false;
                }, 3000);
            });
    }
}
