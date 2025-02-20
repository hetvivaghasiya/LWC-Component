import { LightningElement,track,wire } from 'lwc';
// import { CurrentPageReference } from 'lightning/navigation';
// import USER_ID from '@salesforce/user/Id';
export default class MainNavbar extends LightningElement {
    @track isLoggedIn = false;

    connectedCallback() {
        this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    }

}