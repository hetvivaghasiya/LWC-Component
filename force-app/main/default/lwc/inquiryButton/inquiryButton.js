import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
export default class InquiryButton extends NavigationMixin(LightningElement) {
    handleClick() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Account', // Change this to your desired object API name
                actionName: 'new'
            }
        });
    }
}