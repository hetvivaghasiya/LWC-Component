import { LightningElement, wire, track } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import sendEmail from '@salesforce/apex/dateScheduleClass.sendEmail';

export default class DateSchedule extends LightningElement {
    @track dateSlots = [];
    selectedDate;
    registrid; // Registered Student ID

    @wire(CurrentPageReference)
    getStateParameters(currentPageReference) {
        if (currentPageReference && currentPageReference.state) {
            this.registrid = currentPageReference.state.registrationId;
            console.log('Extracted Registration ID from URL:', this.registrid);
        } else {
            console.error('Error: URL parameters not found!');
        }
    }

    connectedCallback() {
        this.calculateFutureDates();
    }

    calculateFutureDates() {
        let today = new Date();
        let futureDates = [];

        for (let i = 0; i <= 3; i++) {
            let futureDate = new Date(today);
            futureDate.setDate(today.getDate() + i);

            let day = String(futureDate.getDate()).padStart(2, '0'); // DD
            let month = String(futureDate.getMonth() + 1).padStart(2, '0'); // MM
            let year = futureDate.getFullYear(); // YYYY

            let formattedDate = `${day}-${month}-${year}`; // Convert to DD-MM-YYYY format
            futureDates.push(formattedDate);
        }

        this.dateSlots = futureDates;
    }

    handleClick(event) {
        this.selectedDate = event.target.innerText.trim();

        console.log('LWC Selected Date:', this.selectedDate);
        console.log('LWC Registered Student ID:', this.registrid);
    
        if (!this.registrid || !this.selectedDate) {
            console.error('Error: Missing Registered Student ID or Selected Date in LWC.');
            alert('Missing Registered Student ID or Selected Date. Please check.');
            return;
        }

        // Convert from DD-MM-YYYY → YYYY-MM-DD (for Apex method)
        let [day, month, year] = this.selectedDate.split('-');
        let formattedDate = `${year}-${month}-${day}`;

        console.log('Formatted Date for Apex:', formattedDate);

        // ✅ Send email with corrected date format
        sendEmail({ registrid: this.registrid, selectedDate: formattedDate })
            .then(result => {
                console.log('Success:', result);
                alert('Email sent successfully!');
            })
            .catch(error => {
                console.error('Error from Apex:', error);
                alert('Error sending email: ' + (error.body ? error.body.message : 'Unknown error'));
            });
    }
}
