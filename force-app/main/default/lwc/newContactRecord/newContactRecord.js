import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import FIRST_NAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LAST_NAME_FIELD from '@salesforce/schema/Contact.LastName';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';

export default class NewContactRecord extends LightningElement {
    isModalOpen = false; // To control modal visibility
    contactObject = CONTACT_OBJECT; // Contact object to pass to the form
    firstNameField = FIRST_NAME_FIELD; // First Name field for form
    lastNameField = LAST_NAME_FIELD; // Last Name field for form
    emailField = EMAIL_FIELD; // Email field for form

    // Open the modal dialog
    openModal() {
        this.isModalOpen = true;
    }

    // Close the modal dialog
    closeModal() {
        this.isModalOpen = false;
    }

    // Success callback for the form submission
    handleSuccess(event) {
        const evt = new ShowToastEvent({
            title: 'Success',
            message: 'Contact created successfully!',
            variant: 'success',
        });
        this.dispatchEvent(evt);
        this.closeModal(); // Close the modal after successful creation
    }
}










// import { LightningElement } from 'lwc';
// import {NavigationMixin} from 'lightning/navigation';

// export default class NewContactRecord extends NavigationMixin( LightningElement ){
//     navigateToNewRecordPage() {
//         this[NavigationMixin.Navigate]({
//             type: "standard__recordPage",
//             attributes: {
//             objectApiName: "Contact",
//             actionName: "new",
//             },
//         })
//     }
// }