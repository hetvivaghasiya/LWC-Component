// import {track,wire, LightningElement } from 'lwc';
// import getCollege from '@salesforce/apex/cardCollege.getCollege';
// import { NavigationMixin } from 'lightning/navigation';
// import { CurrentPageReference } from 'lightning/navigation';
// import customImage from './cardImage.html';

// // import CollegeImage from '@salesforce/resourceUrl/Images';

// export default class CardCollegeAnimation extends NavigationMixin(LightningElement) {
//     static customTypes = {
//         customImage: {
//             template: customImage,
//             typeAttributes: ['title']
//         }

//     }
//                 @track uid;
//                 @track college ;
//                 error;
        
//                 @wire(getCollege,{uid:'$uid'})
//                 //function
//                 wiredContacts({error,data}){
//                     if(data){
//                         this.college=data;
//                         this.error=undefined;
//                     }else if(error){
//                         this.error=error;
//                         this.college=undefined;
//                     }
//                 }
                
//             //Course Data Builder Page Navigate using "More Info" Button
//                 navigateCourse(event){
//                     this.recordId=event.target.dataset.cid;
//                     this[NavigationMixin.Navigate]({
//                         type:"comm__namedPage",
//                         attributes:{
//                             name:"College_Data__c",
//                         },
//                         state: {
//                             cid: this.recordId
//                         }
//                     });
//                 }
    
    
//             //University Button Reference
//             @wire(CurrentPageReference)
//              getStateParameters(currentPageReference) {
//             if (currentPageReference?.state?.uid) {
//                 this.uid = currentPageReference.state.uid;
//             }
//         }
// }



import { track, wire, LightningElement } from 'lwc';
import getCollege from '@salesforce/apex/cardCollege.getCollege';
import { NavigationMixin } from 'lightning/navigation';
import { CurrentPageReference } from 'lightning/navigation';

export default class CardCollegeAnimation extends NavigationMixin(LightningElement) {
    @track uid;
    @track college;
    @track filterText = ''; // Stores filter input
    error;

    @wire(getCollege, { uid: '$uid' })
    wiredContacts({ error, data }) {
        if (data) {
            this.college = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.college = undefined;
        }
    }

    // Handle filter change
    handleFilterChange(event) {
        this.filterText = event.target.value.toLowerCase();
    }

    // Getter to return filtered colleges
    get filteredColleges() {
        if (!this.college) {
            return [];
        }
        return this.college.filter(clg => clg.Name.toLowerCase().includes(this.filterText));
    }

    // Course Data Navigation
    navigateCourse(event) {
        this.recordId = event.target.dataset.cid;
        this[NavigationMixin.Navigate]({
            type: "comm__namedPage",
            attributes: {
                name: "College_Data__c",
            },
            state: {
                cid: this.recordId
            }
        });
    }

    // Capture State Parameter (uid)
    @wire(CurrentPageReference)
    getStateParameters(currentPageReference) {
        if (currentPageReference?.state?.uid) {
            this.uid = currentPageReference.state.uid;
        }
    }
}
