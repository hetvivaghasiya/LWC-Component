import { LightningElement, track, wire } from 'lwc';
import getColleges from '@salesforce/apex/filterCollegeCourseClass.getColleges';

export default class FilterCollegeCourse extends LightningElement {
    @track colleges = [];
    @track isLoading = false;
    @track hasError = false;

    sortBy = 'Name'; 
    sortOrder = 'ASC'; 

    sortOptions = [
        { label: 'Course Name', value: 'Name' },
        { label: 'Fees', value: 'Course_Fees__c' }
    ];

    sortOrderOptions = [
        { label: 'Ascending', value: 'ASC' },
        { label: 'Descending', value: 'DESC' }
    ];

    columns = [
        { label: 'Course Name', fieldName: 'Name' },
        { label: 'College Name', fieldName: 'CollegeName' }, // Use the new flattened field
        { label: 'Fees', fieldName: 'Course_Fees__c', type: 'currency' }
    ];

    @wire(getColleges, { 
        nameFilter: '', 
        cityFilter: '', 
        sortBy: '$sortBy', 
        sortOrder: '$sortOrder' 
    })
    wiredColleges({ error, data }) {
        if (data) {
            this.colleges = data;
            this.isLoading = false;
            this.hasError = false;
        } else if (error) {
            this.hasError = true;
            this.isLoading = false;
        }
    }

    handleSortByChange(event) {
        this.sortBy = event.target.value;
    }

    handleSortOrderChange(event) {
        this.sortOrder = event.target.value;
    }
}
