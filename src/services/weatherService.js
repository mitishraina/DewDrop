import { WEATHER_CONFIG } from "../config/weatherConfig";

const WEATHER_API_KEY = WEATHER_CONFIG.WEATHER_API_KEY;
const WEATHER_API_URL = WEATHER_CONFIG.BASE_URL;
const DEFAULT_LAT = WEATHER_CONFIG.DEFAULT_LOCATION.lat;
const DEFAULT_LON = WEATHER_CONFIG.DEFAULT_LOCATION.lon;

class WeatherService {
  constructor() {
    this.apiKey = WEATHER_API_KEY;
    this.baseUrl = WEATHER_API_URL;
  }

  // Fetch weather data by coordinates
  async getWeatherByCoords(lat = DEFAULT_LAT, lon = DEFAULT_LON) {
    try {
      const url = `${this.baseUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      return this.formatWeatherData(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      // Return mock data as fallback
      return this.getMockWeatherData();
    }
  }

  // Fetch weather data by city name
  async getWeatherByCity(cityName = "Delhi") {
    try {
      const url = `${this.baseUrl}?q=${encodeURIComponent(cityName)}&appid=${
        this.apiKey
      }&units=metric`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      return this.formatWeatherData(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      // Return mock data as fallback
      return this.getMockWeatherData();
    }
  }

  // Format weather data to match our component's expected structure
  formatWeatherData(data) {
    return {
      temperature: `${Math.round(data.main.temp)}°C`,
      humidity: `${data.main.humidity}%`,
      condition: data.weather[0].main,
      description: data.weather[0].description,
      isOptimal: this.isOptimalForCollection(
        data.main.humidity,
        data.weather[0].main
      ),
      windSpeed: data.wind?.speed || 0,
      pressure: data.main.pressure,
      visibility: data.visibility / 1000, // Convert to km
      timestamp: new Date().toISOString(),
    };
  }

  // Determine if weather conditions are optimal for fog collection
  isOptimalForCollection(humidity, condition) {
    const highHumidity = humidity >= 70;
    const foggyConditions = ["Fog", "Mist", "Haze", "Clouds"].includes(
      condition
    );
    return highHumidity && foggyConditions;
  }

  // Mock weather data for testing/fallback
  getMockWeatherData() {
    return {
      temperature: "18°C",
      humidity: "85%",
      condition: "Heavy Fog",
      description: "Heavy fog conditions",
      isOptimal: true,
      windSpeed: 2.5,
      pressure: 1013,
      visibility: 0.5,
      timestamp: new Date().toISOString(),
    };
  }

  // Get user's current location and fetch weather
  async getCurrentLocationWeather() {
    return new Promise((resolve) => {
      // First try to get location from profile data
      const profileData = localStorage.getItem("profileData");
      if (profileData) {
        try {
          const profile = JSON.parse(profileData);
          if (profile.latitude && profile.longitude) {
            console.log("Using profile location for weather");
            this.getWeatherByCoords(profile.latitude, profile.longitude)
              .then(resolve)
              .catch(() => {
                console.log("Profile location failed, trying geolocation");
                this.tryGeolocation(resolve);
              });
            return;
          }
        } catch (error) {
          console.error("Error parsing profile data:", error);
        }
      }

      // Fallback to geolocation
      this.tryGeolocation(resolve);
    });
  }

  // Try geolocation as fallback
  tryGeolocation(resolve) {
    if (!navigator.geolocation) {
      console.log("Geolocation not supported, using default location");
      resolve(this.getWeatherByCoords());
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const weatherData = await this.getWeatherByCoords(latitude, longitude);
        resolve(weatherData);
      },
      (error) => {
        console.error("Error getting location:", error);
        console.log("Using default location");
        resolve(this.getWeatherByCoords());
      },
      {
        timeout: 10000,
        enableHighAccuracy: false,
      }
    );
  }
}

// Create and export a singleton instance
const weatherService = new WeatherService();
export default weatherService;
