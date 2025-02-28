import { LightningElement, track } from 'lwc';

export default class ContactPage extends LightningElement {
    @track showMessage = false;

    handleSubmit(event) {
        event.preventDefault(); // Prevent form from refreshing the page
        this.showMessage = true;

        // Clear form fields
        this.template.querySelector('form').reset();

        // Hide message after 3 seconds
        setTimeout(() => {
            this.showMessage = false;
        }, 3000);
    }
}
