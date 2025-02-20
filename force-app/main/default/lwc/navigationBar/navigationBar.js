import { LightningElement } from 'lwc';

export default class NavigationBar extends LightningElement {

    toggleMobileMenu(event){
        const evt = event.currentTarget;
        evt.classList.toggle("open");
    }
    
}