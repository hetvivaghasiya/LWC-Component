// import { LightningElement, wire, track } from 'lwc';
// import { CurrentPageReference } from 'lightning/navigation';
// import sendEmail from '@salesforce/apex/dateScheduleClass.sendEmail';

// export default class DateSchedule extends LightningElement {
//     @track dateSlots = [];
//     selectedDate;
//     registrid; // Registered Student ID

//     //Add these when css update
//     interviewTips = [
//         { id: 1, title: '📅 Plan Ahead', content: 'Select an interview slot that works best for you and make sure to mark it in your calendar.' },
//         { id: 2, title: '📜 Research the Company', content: 'Understand the company’s mission, values, and latest news to show enthusiasm and preparedness.' },
//         { id: 3, title: '🖥️ Test Your Equipment', content: 'For virtual interviews, ensure your camera, microphone, and internet connection are working properly.' },
//         { id: 4, title: '👔 Dress Professionally', content: 'Wear professional attire to create a great first impression, even for virtual interviews.' },
//         { id: 5, title: '🗣️ Practice Common Questions', content: 'Prepare answers for common questions like “Tell me about yourself” and “Why do you want this job?”.' },
//         { id: 6, title: '💡 Prepare Your Own Questions', content: 'Show your interest by asking insightful questions about the role and company.' },
//         { id: 7, title: '⏳ Arrive on Time', content: 'For in-person interviews, arrive at least 15 minutes early. For virtual interviews, log in 10 minutes before.' },
//         { id: 8, title: '📁 Bring Necessary Documents', content: 'Have copies of your resume, a notepad, and references handy for in-person interviews.' },
//         { id: 9, title: '😀 Be Confident and Positive', content: 'Smile, make eye contact, and maintain good posture to show confidence and engagement.' },
//         { id: 10, title: '✍️ Follow Up', content: 'Send a thank-you email within 24 hours to express appreciation and reiterate your interest in the position.' }
//     ];
//     ////
//     @wire(CurrentPageReference)
//     getStateParameters(currentPageReference) {
//         if (currentPageReference && currentPageReference.state) {
//             this.registrid = currentPageReference.state.registrationId;
//             console.log('Extracted Registration ID from URL:', this.registrid);
//         } else {
//             console.error('Error: URL parameters not found!');
//         }
//     }

//     connectedCallback() {
//         this.calculateFutureDates();
//     }

//     calculateFutureDates() {
//         let today = new Date();
//         let futureDates = [];

//         for (let i = 0; i <= 3; i++) {
//             let futureDate = new Date(today);
//             futureDate.setDate(today.getDate() + i);

//             let day = String(futureDate.getDate()).padStart(2, '0'); // DD
//             let month = String(futureDate.getMonth() + 1).padStart(2, '0'); // MM
//             let year = futureDate.getFullYear(); // YYYY

//             let formattedDate = `${day}-${month}-${year}`; // Convert to DD-MM-YYYY format
//             futureDates.push(formattedDate);
//         }

//         this.dateSlots = futureDates;
//     }


//     handleClick(event) {
//         this.selectedDate = event.target.innerText.trim();
    
//         console.log('LWC Selected Date:', this.selectedDate);
//         console.log('LWC Registered Student ID:', this.registrid);
    
//         if (!this.registrid || !this.selectedDate) {
//             console.error('Error: Missing Registered Student ID or Selected Date in LWC.');
//             alert('Missing Registered Student ID or Selected Date. Please check.');
//             return;
//         }
    
//         // Convert DD-MM-YYYY → YYYY-MM-DD (for Apex)
//         let [day, month, year] = this.selectedDate.split('-');
//         let formattedDate = `${year}-${month}-${day}`;
    
//         // Validate if the date is correctly formatted
//         let testDate = new Date(`${year}-${month}-${day}`);
//         if (isNaN(testDate.getTime())) {
//             console.error('Error: Invalid Date Conversion:', formattedDate);
//             alert('Error: Invalid date selection. Please select a valid date.');
//             return;
//         }
    
//         console.log('Formatted Date for Apex:', formattedDate);
    
//         // ✅ Send email with corrected date format
//         sendEmail({ registrid: this.registrid, selectedDate: formattedDate })
//             .then(result => {
//                 console.log('Success:', result);
//                 alert('Email sent successfully!');
    
//                 // ❌ Disable all buttons after selection
//                 let buttons = this.template.querySelectorAll('.date-button');
//                 buttons.forEach(button => {
//                     button.disabled = true;
//                     button.classList.add('disabled-button'); // Add CSS for visual effect
//                 });
    
//                 // ✅ Highlight the selected date
//                 event.target.classList.add('selected-date');
//             })
//             .catch(error => {
//                 console.error('Error from Apex:', error);
//                 alert('Error sending email: ' + (error.body ? error.body.message : 'Unknown error'));
//             });
//     }
    
//     // handleClick(event) {
//     //     this.selectedDate = event.target.innerText.trim();

//     //     console.log('LWC Selected Date:', this.selectedDate);
//     //     console.log('LWC Registered Student ID:', this.registrid);
    
//     //     if (!this.registrid || !this.selectedDate) {
//     //         console.error('Error: Missing Registered Student ID or Selected Date in LWC.');
//     //         alert('Missing Registered Student ID or Selected Date. Please check.');
//     //         return;
//     //     }

//     //     // Convert from DD-MM-YYYY → YYYY-MM-DD (for Apex method)
//     //     let [day, month, year] = this.selectedDate.split('-');
//     //     let formattedDate = `${year}-${month}-${day}`;

//     //     console.log('Formatted Date for Apex:', formattedDate);

//     //     // ✅ Send email with corrected date format
//     //     sendEmail({ registrid: this.registrid, selectedDate: formattedDate })
//     //         .then(result => {
//     //             console.log('Success:', result);
//     //             alert('Email sent successfully!');
//     //         })
//     //         .catch(error => {
//     //             console.error('Error from Apex:', error);
//     //             alert('Error sending email: ' + (error.body ? error.body.message : 'Unknown error'));
//     //         });
//     // }


//     // handleClick(event) {
//     //     this.selectedDate = event.target.innerText.trim();
    
//     //     console.log('LWC Selected Date:', this.selectedDate);
//     //     console.log('LWC Registered Student ID:', this.registrid);
    
//     //     if (!this.registrid || !this.selectedDate) {
//     //         console.error('Error: Missing Registered Student ID or Selected Date in LWC.');
//     //         alert('Missing Registered Student ID or Selected Date. Please check.');
//     //         return;
//     //     }
    
//     //     // Convert DD-MM-YYYY → YYYY-MM-DD (for Apex)
//     //     let [day, month, year] = this.selectedDate.split('-');
//     //     let formattedDate = `${year}-${month}-${day}`;
    
//     //     // Validate if the date is correctly formatted
//     //     let testDate = new Date(`${year}-${month}-${day}`);
//     //     if (isNaN(testDate.getTime())) {
//     //         console.error('Error: Invalid Date Conversion:', formattedDate);
//     //         alert('Error: Invalid date selection. Please select a valid date.');
//     //         return;
//     //     }
    
//     //     console.log('Formatted Date for Apex:', formattedDate);
    
//     //     // ✅ Send email with corrected date format
//     //     sendEmail({ registrid: this.registrid, selectedDate: formattedDate })
//     //         .then(result => {
//     //             console.log('Success:', result);
//     //             alert('Email sent successfully!');
//     //         })
//     //         .catch(error => {
//     //             console.error('Error from Apex:', error);
//     //             alert('Error sending email: ' + (error.body ? error.body.message : 'Unknown error'));
//     //         });
//     // }
    
// }



import { LightningElement, wire, track } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import sendEmail from '@salesforce/apex/dateScheduleClass.sendEmail';

export default class DateSchedule extends LightningElement {
    @track dateSlots = [];
    selectedDate;
    registrid; // Registered Student ID
    successMessage = ''; // ✅ Store success message

    interviewTips = [
        { id: 1, title: '📅 Plan Ahead', content: 'Select an Exam slot that works best for you and make sure to mark it in your calendar.' },
        { id: 2, title: '📜 Research the Company', content: 'Understand the company’s mission, values, and latest news to show enthusiasm and preparedness.' },
        { id: 3, title: '🗣️ Practice Common Questions', content: 'Prepare answers for common questions like.' },
        { id: 4, title: '⏳ Arrive on Time', content: 'For in-person interviews, arrive at least 15 minutes early. For exam, log in 10 minutes before.' },
        { id: 5, title: '📁 Bring Necessary Documents', content: 'Have copies of your resume, a notepad, and references handy for in-person exam.' },
    ];

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

        for (let i = 3; i <= 5; i++) {
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
            return;
        }

        // Convert DD-MM-YYYY → YYYY-MM-DD (for Apex)
        let [day, month, year] = this.selectedDate.split('-');
        let formattedDate = `${year}-${month}-${day}`;

        let testDate = new Date(`${year}-${month}-${day}`);
        if (isNaN(testDate.getTime())) {
            console.error('Error: Invalid Date Conversion:', formattedDate);
            return;
        }

        console.log('Formatted Date for Apex:', formattedDate);

        // ✅ Send email and display message instead of alert
        sendEmail({ registrid: this.registrid, selectedDate: formattedDate })
            .then(result => {
                console.log('Success:', result);

                // ✅ Set success message
                this.successMessage = `✅ Interview Date Selected: ${this.selectedDate}`;
                
                // ❌ Disable all buttons
                let buttons = this.template.querySelectorAll('.date-button');
                buttons.forEach(button => {
                    button.disabled = true;
                    button.classList.add('disabled-button');
                });

                // ✅ Highlight selected date
                event.target.classList.add('selected-date');
            })
            .catch(error => {
                console.error('Error from Apex:', error);
                this.successMessage = '❌ Error scheduling interview. Please try again.';
            });
    }
}
