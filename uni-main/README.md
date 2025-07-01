# UDE Campus Navigator

A modern, interactive campus navigation application for the University of Duisburg-Essen.

## Features

- 🏛️ Interactive campus building exploration
- 🌤️ Real-time weather information
- 📅 Campus events calendar
- 💬 AI-powered chat assistant with voice support
- 🗺️ Campus maps and navigation
- 👥 Student forum and community features
- 🌐 Multi-language support (English/German)
- 📱 Responsive design for all devices

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd ude-campus-navigator
npm install
```

### 2. Configure Environment Variables

#### Weather API Setup (Required for real weather data)
1. Visit [OpenWeatherMap](https://openweathermap.org/api) and create a free account
2. Go to your API keys section and generate a new API key
3. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Edit the `.env` file and replace `your_api_key_here` with your actual API key:
   ```env
   VITE_OPENWEATHER_API_KEY=your_actual_api_key_here
   VITE_OPENWEATHER_CITY=Essen,DE
   ```

#### Optional: Supabase Setup (for production database)
If you want to use a real database instead of demo mode:
1. Create a project at [Supabase](https://supabase.com)
2. Add your Supabase credentials to `.env`:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 3. Start the Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Weather API Configuration

### Getting Your OpenWeatherMap API Key

1. **Sign Up**: Go to [OpenWeatherMap](https://openweathermap.org/api) and create a free account
2. **Verify Email**: Check your email and verify your account
3. **Generate API Key**: 
   - Log in to your dashboard
   - Go to "API keys" section
   - Click "Generate" or use the default key provided
   - Copy the API key

4. **Add to Environment**:
   ```env
   VITE_OPENWEATHER_API_KEY=your_api_key_here
   ```

5. **Restart the Application**: After adding the API key, restart your development server:
   ```bash
   npm run dev
   ```

### API Key Activation
- New API keys may take up to 2 hours to activate
- Free tier includes 1,000 API calls per day
- If you see "Invalid API key" errors, wait a bit longer for activation

### Troubleshooting Weather Issues

**"Using simulated weather data" message:**
- This means no API key is configured
- Add your OpenWeatherMap API key to the `.env` file

**"Invalid API key" error:**
- Check that your API key is correct
- Ensure the API key is activated (may take up to 2 hours)
- Verify your OpenWeatherMap account is verified

**"City not found" error:**
- Check the `VITE_OPENWEATHER_CITY` value in your `.env` file
- Use format: "CityName,CountryCode" (e.g., "Essen,DE")

## Demo Features

The application includes several demo features that work without external APIs:
- Simulated weather data (when API key is not configured)
- Mock user authentication
- Sample campus events
- Demo forum posts

## Technologies Used

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Weather**: OpenWeatherMap API
- **Database**: Supabase (optional)
- **Build Tool**: Vite

## Project Structure

```
src/
├── components/          # React components
├── contexts/           # React contexts (Auth, Language)
├── data/              # Static data and building information
├── services/          # API services and utilities
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
└── hooks/             # Custom React hooks
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.