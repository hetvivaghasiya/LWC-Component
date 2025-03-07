import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';


export default class LoginNavbar extends NavigationMixin(LightningElement) {
    openModel(){
        this.template.querySelector('c-inquiry-button').show();
    }
    handleCancel() {
        console.log('Action Canceled!');
    }
    handleLogout() {
        localStorage.removeItem('isLoggedIn');
         // // Redirect to home page
         this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name:"Home",
            }
        });
      
        setTimeout(() => {
            window.location.reload(); // Reload after redirect
        },100); 
    }
    
}