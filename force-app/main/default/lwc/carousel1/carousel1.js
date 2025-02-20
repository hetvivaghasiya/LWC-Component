import { LightningElement } from 'lwc';
import IMAGES from '@salesforce/resourceUrl/Images';


export default class Carousel1 extends LightningElement {


    currentIndex = 0;
    images = [
        {
            id: '1',
            src: `${IMAGES}/c5.jpg`,
            alt: 'Image 1',
            text: 'The Best University',
            secondaryText: 'Enjoy smooth learning'  // Secondary text
        },
        {
            id: '2',
            src: `${IMAGES}/c2.jpg`,
            alt: 'Image 2',
            text: 'Education For Better',
            secondaryText: 'Enjoy smooth learning'  // Secondary text
            
        },
        {
            id: '3',
            src: `${IMAGES}/c3.jpg`,
            alt: 'Image 3',
            text: 'Achieving Knowledge',
            secondaryText: 'Enjoy smooth learning'  // Secondary text
        },
        {
            id: '4',
            src: `${IMAGES}/c4.jpg`,
            alt: 'Image 4',
            text: 'Learning Today',
            secondaryText: 'Enjoy smooth learning'  // Secondary text
        }
    ];


    connectedCallback(){
        this.startAutoScroll();
    }

    startAutoScroll(){
        this.autoScrollInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);}

    disconnectedCallback(){
        if(this.autoScrollInterval){
            clearInterval(this.interval);
        }
    }


    get carouselClass() {
        return `carousel-position-${this.currentIndex}`;
    }

    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }


}

