/**
 * Service Layer Abstraction
 * This layer abstracts external APIs so they can be easily replaced.
 */

export interface WeatherData {
  temp: number;
  condition: string;
  forecast: any[];
}

export const WeatherService = {
  async getCurrentWeather(location: string): Promise<WeatherData> {
    // Mock implementation - Replace with OpenWeatherMap or similar
    console.log(`Fetching weather for ${location}`);
    return {
      temp: 72,
      condition: 'Sunny',
      forecast: [70, 72, 75, 68, 71]
    };
  }
};

export const ThermostatService = {
  async getStatus(deviceId: string) {
    // Mock implementation - Replace with Nest/Ecobee API
    return {
      currentTemp: 71,
      targetTemp: 68,
      mode: 'cool',
      fan: 'auto'
    };
  },
  async setTemperature(deviceId: string, temp: number) {
    console.log(`Setting thermostat ${deviceId} to ${temp}°F`);
    return { success: true };
  }
};

export const EnergyService = {
  async getRealTimeUsage(homeId: string) {
    // Mock implementation - Replace with Sense/Emporia API
    return {
      currentUsage: 1.2, // kW
      dailyTotal: 24.5, // kWh
      peakUsage: 4.8 // kW
    };
  }
};
