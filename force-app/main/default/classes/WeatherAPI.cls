public with sharing class WeatherAPI {
    @AuraEnabled(cacheable=true)
    public static String getWeather(String city) {
        Http http = new Http();
        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:WeatherAPI/current.json?q=' + EncodingUtil.urlEncode(city, 'UTF-8'));
        req.setMethod('GET');
        req.setHeader('Content-Type', 'application/json');
        HttpResponse res = http.send(req);
        return res.getBody();
    }
}
