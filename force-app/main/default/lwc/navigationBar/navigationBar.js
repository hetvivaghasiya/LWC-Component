import { LightningElement,track } from 'lwc';

export default class NavigationBar extends LightningElement {

    // @track isLoggedIn = false;

    toggleMobileMenu(event){
        const evt = event.currentTarget;
        evt.classList.toggle("open");
    }

    
//login successful then display navbar
    // connectedCallback() {
    //     this.isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    // }

    // //logout button
    // handleLogout() {
    //     sessionStorage.removeItem('isLoggedIn');
    //     this.isLoggedIn = false;
    //     window.location.href = "/student-login";
    // }
    
}