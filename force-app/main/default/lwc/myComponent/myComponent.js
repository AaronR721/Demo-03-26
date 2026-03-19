import { LightningElement, api, track } from 'lwc';

export default class MyComponent extends LightningElement {
    @api myVariable = '';

    @track myVariable = '';



    connectedCallback() {
        this.myVariable = this.myVariable || '';
    } 

    handleChange(event) {
        this.myVariable = event.target.value;
    }
}