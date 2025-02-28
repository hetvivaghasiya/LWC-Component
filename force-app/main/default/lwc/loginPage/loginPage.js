import { LightningElement, track } from 'lwc';

export default class LoginPage extends LightningElement {
    @track isProfileActive = true;
    @track isDocumentActive = false;
    @track isFeesPaymentActive = false;

    get profileTabClass() {
        return this.isProfileActive ? 'slds-is-active active-tab' : '';
    }
    
    get documentTabClass() {
        return this.isDocumentActive ? 'slds-is-active active-tab' : '';
    }   
    
    get feesPaymentTabClass() {
        return this.isFeesPaymentActive ? 'slds-is-active active-tab' : '';
    }

    handleTabClick(event) {
        const selectedTab = event.target.dataset.id;

        this.isProfileActive = selectedTab === 'profile';
        this.isDocumentActive = selectedTab === 'document';
        this.isFeesPaymentActive = selectedTab === 'fees-payment';
    }
}
