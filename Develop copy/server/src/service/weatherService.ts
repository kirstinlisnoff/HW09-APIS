import dotenv from 'dotenv';
import { error } from 'node:console';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}
// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  icon: string;
  description: string;
  temp:number;
  humidity: number;
  windSpeed: number;

  constructor(
    city: string,
    date: string,
    icon: string,
    description: string,
    temp:number,
    humidity: number,
    windSpeed: number,
  ) {
    this.city = city,
    this.date = date;
    this.icon = icon;
    this.description = description;
    this.temp = temp;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
private baseURL = process.env.API_BASE_URL as string;
private apiKey = process.env.API_KEY as string;
private cityName: string = '';

  // TODO: Create fetchLocationData method
  // private async fetchLocationData(query: string) {} 
   private async fetchLocationData(query:string) {
    try {
      const response = await fetch(query);
      const data = await response.json();
      console.log('Location Data:', data);
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    return {
      lat: locationData.lat,
      lon: locationData.lon
    };
  }

  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.apiKey}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${this.apiKey}`
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const locationData = await this.fetchLocationData(this.buildGeocodeQuery());
    if (Array.isArray(locationData) && locationData.length > 0) {
      return this.destructureLocationData(locationData[0]);
    } else {
      console.error(error);
      return null;
    }
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    const data = await response.json();
    return data
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const city = this.cityName;
    const date = new Date(response.list[0].dt * 1000).toLocaleDateString();
    const icon = response.list[0].weather[0].icon;
    const description = response.list[0].weather[0].description;
    const temp = response.list[0].main.temp;
    const humidity = response.list[0].main.humidity
    const windSpeed = response.list[0].windSpeed
    
    return new Weather(city, date, icon, description, temp, humidity, windSpeed)
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecastArray = [];
    forecastArray.push(currentWeather);
    for (let i = 1; 1 < weatherData.length; i++){
      const city = this.cityName;
      const date = new Date(weatherData[i] * 1000).toLocaleDateString();
      const icon = weatherData[i].weather[0].icon;
      const description = weatherData[i].weather[0].description;
      const temp = weatherData[i].main.temp;
      const humidity = weatherData[i].main.humidity
      const windSpeed = weatherData[i].windSpeed
      forecastArray.push(new Weather(city, date, icon, description, temp, humidity, windSpeed))
    }
    }
  
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
      const coordinates = await this.fetchAndDestructureLocationData();
    if (!coordinates) {
      console.error(error);
      return null;
    }
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecastArray = this.buildForecastArray(currentWeather, weatherData.list);
    return{ currentWeather, forecastArray};
} 
  }

export default new WeatherService();
