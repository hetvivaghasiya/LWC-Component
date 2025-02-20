import { LightningElement } from 'lwc';
import saveAccount from '@salesforce/apex/SendEmailForAccount.saveAccount'; // Apex method to save Account

export default class NewInquiryCourse extends LightningElement {
    accountName = ''; 
    emailAddress = ''; 

    handleInputChange(event) {
        this.accountName = event.target.value;
    }

    handleEmailChange(event) {
        this.emailAddress = event.target.value;
    }

    handleSave() {
        if (!this.emailAddress) {
            this.showToast('Error', 'Please enter a valid email address.', 'error');
            return;
        }

        saveAccount({ accountName: this.accountName, emailAddress: this.emailAddress })
            .then(() => {
                this.showToast('Success', 'Account has been created and email sent!', 'success');
            })
            .catch((error) => {
                this.showToast('Error', error.body.message, 'error');
            });
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title,
            message,
            variant,
        });
        this.dispatchEvent(event);
    }
}
