import { LightningElement, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getUniversity from '@salesforce/apex/cardUniversity.getUniversity'; // Apex call to fetch contacts
import customImage from './customImage.html';

export default class CustomDataTable extends NavigationMixin(LightningElement) {
static customTypes = {
        customImage: {
            template: customImage,
            typeAttributes: ['title']
        }

    }

    @track recordId;
      @track university = [];  // Stores the fetched contacts
        @track error;  // Stores any errors that occur during data fetch
    
        // Fetch the contact records using the wire service
        @wire(getUniversity)
        wiredContacts({ error, data }) {
            if (data) {
                this.university = data;
                console.log('data 24=====>'+JSON.stringify(data));
                this.error = undefined;
            } else if (error) {
                this.error = error;
                this.university = [];
            }
        }

        //Navigation College
         navigateCollege(event){
                        this.recordId=event.target.dataset.uid;
                        this[NavigationMixin.Navigate]({
                            type:"comm__namedPage",
                            attributes:{
                                name:"Course_Data__c",
                            },
                            state: {
                                uid: this.recordId 
                            }
                        });
        }
}