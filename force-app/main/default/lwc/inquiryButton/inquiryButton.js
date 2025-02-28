import { LightningElement, api } from 'lwc';

export default class InquiryButton extends LightningElement {
    @api isModalOpen = false;  // Control modal visibility
    @api message = 'Are you sure you want to proceed?'; // Default message

    // Open Modal
    @api show() {
        this.isModalOpen = true;
    }

    // Close Modal
    closeModal() {
        this.isModalOpen = false;
    }

    // Handle Cancel Button
    handleCancel() {
        this.closeModal();
        this.dispatchEvent(new CustomEvent('cancel'));
    }

    // Handle Confirm Button
    handleConfirm() {
        this.closeModal();
        this.dispatchEvent(new CustomEvent('confirm'));
    }
}
