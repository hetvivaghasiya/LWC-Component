import { LightningElement, track, wire } from 'lwc';

export default class Calender extends LightningElement {
    todayDate = new Date().toLocaleDateString();
    
    get dateSlot1() {
        const date = new Date();
        date.setDate(date.getDate() + 1); // Slot 1 - Tomorrow
        return date.toLocaleDateString();
    }

    get dateSlot2() {
        const date = new Date();
        date.setDate(date.getDate() + 2); // Slot 2 - Day After Tomorrow
        return date.toLocaleDateString();
    }

    get dateSlot3() {
        const date = new Date();
        date.setDate(date.getDate() + 3); // Slot 3 - 3 Days from Today
        return date.toLocaleDateString();
    }

    selectDate(event) {
        const selectedSlot = event.target.dataset.id;
        console.log('You selected: ' + this[selectedSlot]);
    }
}   