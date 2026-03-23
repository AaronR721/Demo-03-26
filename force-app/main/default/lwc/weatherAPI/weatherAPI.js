import { LightningElement, track } from 'lwc';
import getWeather from '@salesforce/apex/WeatherAPI.getWeather';

export default class WeatherAPI extends LightningElement {
    @track city = '';
    @track state = '';
    @track weatherData;
    @track error;

    handleCityChange(event) {
        this.city = event.target.value;
    }

    handleStateChange(event) {
        this.state = event.target.value;
    }

    handleGetWeather() {
        this.weatherData = undefined;
        this.error = undefined;

        const query = this.state ? `${this.city}, ${this.state}` : this.city;

        getWeather({ city: query })
            .then(result => {
                this.weatherData = JSON.parse(result);
            })
            .catch(error => {
                this.error = error.body?.message || 'An error occurred fetching weather data.';
            });
    }
}
