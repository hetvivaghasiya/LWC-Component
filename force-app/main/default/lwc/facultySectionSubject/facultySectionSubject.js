import { LightningElement ,track} from 'lwc';

export default class FacultySectionSubject extends LightningElement {
  
    @track isProfileActive = true;
    @track isDocumentActive = false;

    get profileTabClass() {
        return this.isProfileActive ? 'slds-is-active active-tab' : '';
    }
    
    get documentTabClass() {
        return this.isDocumentActive ? 'slds-is-active active-tab' : '';
    }   
    
   

    handleTabClick(event) {
        const selectedTab = event.target.dataset.id;

        this.isProfileActive = selectedTab === 'profile';
        this.isDocumentActive = selectedTab === 'document';
    }
}

