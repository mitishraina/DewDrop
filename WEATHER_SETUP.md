# Weather API Setup Instructions

This guide will help you set up the weather API integration for your DewDrop application.

## Prerequisites

- A free OpenWeatherMap account
- Internet connection

## Step 1: Get Your API Key

1. Go to [OpenWeatherMap API](https://openweathermap.org/api)
2. Click "Sign Up" to create a free account
3. Verify your email address
4. Go to the "API keys" section in your account dashboard
5. Copy your API key (it will look like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)

## Step 2: Configure the API Key

1. Open `src/config/weatherConfig.js`
2. Replace `YOUR_OPENWEATHERMAP_API_KEY` with your actual API key:

```javascript
export const WEATHER_CONFIG = {
    API_KEY: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6', // Your actual API key
    // ... rest of the config
};
```

## Step 3: Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to the User Dashboard
3. The weather card should now show real-time data
4. You should see:
   - Current temperature and humidity
   - Weather condition (e.g., "Clouds", "Clear", "Rain")
   - Optimal/Suboptimal status for fog collection

## Features

- **Real-time Weather Data**: Fetches current weather from OpenWeatherMap API
- **Location-based**: Uses your current location if available, falls back to Delhi, India
- **Auto-refresh**: Updates every 10 minutes automatically
- **Manual Refresh**: Click the refresh button to update immediately
- **Fallback Data**: Shows mock data if API fails
- **Loading States**: Shows loading spinner while fetching data
- **Error Handling**: Displays error messages if something goes wrong

## API Limits

The free tier includes:
- 1,000 API calls per day
- Current weather data
- 5-day/3-hour forecast (if needed later)

This is more than sufficient for the dashboard's 10-minute refresh interval.

## Troubleshooting

### Weather data shows "Loading..." forever
- Check if your API key is correctly set in `weatherConfig.js`
- Verify your internet connection
- Check browser console for error messages

### Weather data shows mock/fallback data
- API key might be invalid or expired
- Check if you've exceeded the daily API limit
- Verify the API key is correctly configured

### Location permission denied
- The app will fall back to the default location (Delhi, India)
- You can manually change the default location in `weatherConfig.js`

## Customization

### Change Default Location
Edit `src/config/weatherConfig.js`:

```javascript
DEFAULT_LOCATION: {
    lat: YOUR_LATITUDE,
    lon: YOUR_LONGITUDE,
    city: 'Your City'
}
```

### Change Refresh Interval
Edit the `REFRESH_INTERVAL` in `weatherConfig.js`:

```javascript
REFRESH_INTERVAL: 5 * 60 * 1000, // 5 minutes
```

### Add More Weather Data
You can extend the weather service to include additional data like:
- Wind speed and direction
- Pressure
- Visibility
- UV index
- Sunrise/sunset times

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify your API key is correct
3. Ensure you have an active internet connection
4. Check if you've exceeded the API rate limits

