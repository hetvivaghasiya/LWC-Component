import { LightningElement,track } from 'lwc';

export default class NavigationBar extends LightningElement {

    // @track isLoggedIn = false;

    // toggleMobileMenu(event){
    //     const evt = event.currentTarget;
    //     evt.classList.toggle("open");
    // }
    toggleMobileMenu() {
        // Select the hamburger menu and mobile menu elements
        const hamburgerMenu = this.template.querySelector('.hamburger-menu');
        const mobileMenu = this.template.querySelector('.mobile-menu');
        
        // Toggle the "open" class on the hamburger menu to change its appearance
        hamburgerMenu.classList.toggle('open');
        
        // Toggle the "display" of the mobile menu
        mobileMenu.classList.toggle('open');
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