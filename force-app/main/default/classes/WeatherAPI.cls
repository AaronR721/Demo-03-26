/**
 * WeatherAPI
 *
 * This Apex class handles callouts to the WeatherAPI.com service.
 * It retrieves current weather data for a given city and state.
 *
 * Named Credential: WeatherAPI
 *   - Base URL: https://api.weatherapi.com/v1
 *   - The API key is stored securely in the Named Credential — do NOT hardcode it here.
 *
 * Used by: weatherAPI LWC component (force-app/main/default/lwc/weatherAPI)
 */
public with sharing class WeatherAPI {

    /**
     * getWeather
     *
     * Makes a GET callout to WeatherAPI.com to retrieve current weather conditions.
     *
     * @param city - The city (and optionally state) to look up. Examples:
     *               "Portland, Oregon"  → returns Portland, OR weather
     *               "Portland, Maine"   → returns Portland, ME weather
     *               Passing city + state ensures the correct location is returned
     *               when multiple cities share the same name across different states.
     *
     * @return String - Raw JSON response body from WeatherAPI.com.
     *                  The LWC component parses this JSON to display weather details
     *                  such as temperature, condition, humidity, and wind speed.
     *
     * Note: @AuraEnabled(cacheable=true) allows this method to be called from LWC.
     *       cacheable=true means Salesforce can cache the result for performance —
     *       only use this on methods that read data and do NOT modify records.
     */
    @AuraEnabled(cacheable=true)
    public static String getWeather(String city) {

        // Initialize the Http object required to send the HTTP request
        Http http = new Http();

        // Create a new HTTP request object to configure our callout
        HttpRequest req = new HttpRequest();

        // Set the endpoint using the Named Credential (callout:WeatherAPI) as the base URL.
        // The Named Credential handles authentication (API key) securely.
        // EncodingUtil.urlEncode ensures special characters (spaces, commas) in the
        // city/state string are properly encoded for a URL (e.g., "Portland, Oregon" → "Portland%2C+Oregon")
        req.setEndpoint('callout:WeatherAPI/current.json?q=' + EncodingUtil.urlEncode(city, 'UTF-8'));

        // We are retrieving data, so use GET
        req.setMethod('GET');

        // Tell the API we expect a JSON response
        req.setHeader('Content-Type', 'application/json');

        // Send the request and capture the response
        HttpResponse res = http.send(req);

        // Return the raw JSON body back to the LWC component.
        // The LWC will call JSON.parse() on this string to access individual fields
        // like location.name, location.region, current.temp_f, current.condition.text, etc.
        return res.getBody();
    }
}
