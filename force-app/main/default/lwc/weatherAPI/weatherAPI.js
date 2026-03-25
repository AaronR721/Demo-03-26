/**
 * weatherAPI.js
 *
 * JavaScript controller for the Weather Lookup LWC component.
 * Handles user input, calls the WeatherAPI Apex class, and manages
 * the weather data and error state displayed in the template.
 *
 * Apex Class: WeatherAPI.getWeather(city)
 * Template:   weatherAPI.html
 */

// LightningElement is the base class for all LWC components.
// track makes properties reactive — when they change, the template re-renders automatically.
import { LightningElement, track } from 'lwc';

// Import the Apex method so we can call it from JavaScript.
// Format: import methodName from '@salesforce/apex/ClassName.methodName'
import getWeather from '@salesforce/apex/WeatherAPI.getWeather';

export default class WeatherAPI extends LightningElement {

    // @track city — stores the value typed into the City input field.
    // Reactive: the template will update whenever this changes.
    @track city = '';

    // @track state — stores the value typed into the State input field.
    // Combined with city to form the full query (e.g. "Portland, Oregon")
    // so WeatherAPI.com returns the correct location.
    @track state = '';

    // @track weatherData — holds the parsed JSON response from WeatherAPI.com.
    // Starts as undefined. When populated, the results section in the template renders.
    @track weatherData;

    // @track error — holds any error message if the Apex callout fails.
    // Starts as undefined. When populated, the error section in the template renders.
    @track error;

    /**
     * handleCityChange
     * Fires whenever the user types in the City input field.
     * Updates the city property with the current input value.
     */
    handleCityChange(event) {
        this.city = event.target.value;
    }

    /**
     * handleStateChange
     * Fires whenever the user types in the State input field.
     * Updates the state property with the current input value.
     */
    handleStateChange(event) {
        this.state = event.target.value;
    }

    /**
     * handleGetWeather
     * Fires when the user clicks the "Get Weather" button.
     *
     * - Clears any previous weather data or error before making a new request.
     * - Builds the query string: if a state is provided, combines city + state
     *   (e.g. "Portland, Oregon") to ensure WeatherAPI.com returns the right city.
     *   If no state is provided, just the city name is used.
     * - Calls the Apex method getWeather({ city: query }) and handles the result.
     */
    handleGetWeather() {
        // Clear previous results and errors so the UI resets before the new request
        this.weatherData = undefined;
        this.error = undefined;

        // Build the query — combining city and state prevents ambiguity.
        // e.g. "Oakland" alone could return Oakland, Michigan
        //      "Oakland, California" returns the correct city
        const query = this.state ? `${this.city}, ${this.state}` : this.city;

        // Call the Apex method — returns a Promise
        getWeather({ city: query })
            .then(result => {
                // result is a raw JSON string returned from Apex (res.getBody()).
                // JSON.parse converts it into a JS object so we can access
                // properties like weatherData.location.name, weatherData.current.temp_f, etc.
                this.weatherData = JSON.parse(result);
            })
            .catch(error => {
                // If the callout fails, capture the error message to display in the template.
                // error.body?.message safely accesses the Salesforce server error message.
                // Falls back to a generic message if none is available.
                this.error = error.body?.message || 'An error occurred fetching weather data.';
            });
    }
}
