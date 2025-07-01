export interface WeatherData {
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'windy' | 'snow' | 'thunderstorm' | 'mist';
  humidity: number;
  windSpeed: number;
  visibility: number;
  location: string;
  description: string;
  feelsLike: number;
  pressure: number;
}

export interface OpenWeatherResponse {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  visibility: number;
  name: string;
  sys: {
    country: string;
  };
}

class WeatherService {
  private apiKey: string;
  private baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
  private defaultCity = 'Essen,DE';

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY || '';
  }

  private mapWeatherCondition(weatherId: number, main: string): WeatherData['condition'] {
    // OpenWeatherMap weather condition IDs
    if (weatherId >= 200 && weatherId < 300) return 'thunderstorm';
    if (weatherId >= 300 && weatherId < 400) return 'rainy';
    if (weatherId >= 500 && weatherId < 600) return 'rainy';
    if (weatherId >= 600 && weatherId < 700) return 'snow';
    if (weatherId >= 700 && weatherId < 800) return 'mist';
    if (weatherId === 800) return 'sunny';
    if (weatherId > 800) return 'cloudy';
    
    // Fallback based on main weather type
    switch (main.toLowerCase()) {
      case 'clear': return 'sunny';
      case 'clouds': return 'cloudy';
      case 'rain': return 'rainy';
      case 'drizzle': return 'rainy';
      case 'thunderstorm': return 'thunderstorm';
      case 'snow': return 'snow';
      case 'mist':
      case 'fog':
      case 'haze': return 'mist';
      default: return 'cloudy';
    }
  }

  async getCurrentWeather(city?: string): Promise<WeatherData> {
    if (!this.apiKey) {
      throw new Error('OpenWeatherMap API key not configured');
    }

    const cityQuery = city || this.defaultCity;
    const url = `${this.baseUrl}?q=${encodeURIComponent(cityQuery)}&appid=${this.apiKey}&units=metric`;

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
        }
        if (response.status === 404) {
          throw new Error('City not found. Please check the city name.');
        }
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data: OpenWeatherResponse = await response.json();

      return {
        temperature: Math.round(data.main.temp),
        condition: this.mapWeatherCondition(data.weather[0].id, data.weather[0].main),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        visibility: Math.round(data.visibility / 1000), // Convert meters to kilometers
        location: `${data.name}, ${data.sys.country}`,
        description: data.weather[0].description,
        feelsLike: Math.round(data.main.feels_like),
        pressure: data.main.pressure
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  async getWeatherByCoordinates(lat: number, lon: number): Promise<WeatherData> {
    if (!this.apiKey) {
      throw new Error('OpenWeatherMap API key not configured');
    }

    const url = `${this.baseUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data: OpenWeatherResponse = await response.json();

      return {
        temperature: Math.round(data.main.temp),
        condition: this.mapWeatherCondition(data.weather[0].id, data.weather[0].main),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6),
        visibility: Math.round(data.visibility / 1000),
        location: `${data.name}, ${data.sys.country}`,
        description: data.weather[0].description,
        feelsLike: Math.round(data.main.feels_like),
        pressure: data.main.pressure
      };
    } catch (error) {
      console.error('Error fetching weather data by coordinates:', error);
      throw error;
    }
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }
}

export const weatherService = new WeatherService();