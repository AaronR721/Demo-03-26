import { LightningElement, api, track } from 'lwc';

export default class MyComponent extends LightningElement {
    @api myVariable = '';

    handleChange(event) {
        this.myVariable = event.target.value;
    }
}