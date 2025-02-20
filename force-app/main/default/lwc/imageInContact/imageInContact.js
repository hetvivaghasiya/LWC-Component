import { LightningElement, wire, track } from 'lwc';
import getRecords from '@salesforce/apex/getContactRecord.getRecords'; // Apex call to fetch contacts

export default class CustomDataTable extends LightningElement {
    @track contacts = [];  // Stores the fetched contacts
    @track error;  // Stores any errors that occur during data fetch

    // Fetch the contact records using the wire service
    @wire(getRecords)
    wiredContacts({ error, data }) {
        if (data) {
            this.contacts = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.contacts = [];
        }
    }
}












// import { LightningElement, track, wire } from 'lwc';
// import { NavigationMixin } from 'lightning/navigation';
// import getRecords from '@salesforce/apex/getContactRecord.getRecords';

// export default class ImageInContact extends NavigationMixin(LightningElement) {

//     @track recordId;
//     contacts;
//     error;


//     @wire(getRecords)
//     wiredContacts({error,data}){
//         if(data){
//             this.contacts=data;
//             this.error=undefined;
//         }else if(error){
//             this.error=error;
//             this.contacts=undefined
//             console.error('Error fetching contact data', error);
//         }

//     }


      //Course Data Builder Page Navigate using "More Info" Button
    //   navigateCourse(event){
    //     this.recordId=event.target.dataset.contactId;
    //     this[NavigationMixin.Navigate]({
    //         type:"comm__namedPage",
    //         attributes:{
    //             name:"Course_Data__c",
    //         },
    //         state: {
    //             contactId: this.recordId // Pass Account ID as a parameter
    //         }
    //     });
    // }


// }






// import { LightningElement, track, wire } from 'lwc';
// import getRecords from '@salesforce/apex/getContactRecord.getRecords'

// export default class ImageInContact extends LightningElement {

//     @track columns=[
//         //{ label: 'Price', fieldName: 'Price', type:'currency' },
//         { label: 'First Name', fieldName: 'FirstName' },
//         { label: 'Last Name', fieldName: 'LastName' },
//         { label: 'Photo URL', fieldName:'PhotoUrl__c' , type:'customImage' },
//         { label: 'Description', fieldName: 'Description' },
//         { label: 'Title', fieldName: 'Title' }
//     ]


//     @track contacts;

//      //Method 1 
//    // @wire(getRecords) contacts;

//      //Method 2
//      @wire (getRecords) wiredContacts({data,error}){
//         if (data) {
        
//             this.contacts=data;
//             console.log(data); 

//         } else if (error) {
//         console.log(error);
//         }
//    }
// }