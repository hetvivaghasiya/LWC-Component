import { LightningElement, track } from 'lwc';
import ICONS from '@salesforce/resourceUrl/Icons';
import { loadStyle } from 'lightning/platformResourceLoader';

export default class NavigationBar extends LightningElement {


    renderedCallback() {

                    loadStyle(this, ICONS + '/style.css');
                }
    @track showMenu = false; // Initially menu is hidden
    
    get menuClass() {
        return this.showMenu ? 'nav-links show' : 'nav-links'; // Add 'show' class when active
    }


    get iconClass() {
        return this.showMenu ? 'icon-menu active' : 'icon-menu';
    }
    handleHamburgerClicked() {
        this.showMenu = !this.showMenu; // Toggle menu visibility
    }

    
}


    
