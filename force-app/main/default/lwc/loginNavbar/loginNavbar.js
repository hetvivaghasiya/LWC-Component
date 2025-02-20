import { LightningElement } from 'lwc';

export default class LoginNavbar extends LightningElement {
    handleLogout() {
        localStorage.removeItem('isLoggedIn');
        location.reload(); // Refresh to show Simple Navigation Bar
    }
}