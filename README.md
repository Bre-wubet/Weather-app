# Advanced Weather App

A full-featured weather application built with the MERN stack (MongoDB, Express.js, React, Node.js) that provides real-time weather information and forecasts.

## Features

- 🌍 Current weather by location (geolocation or manual input)
- 📅 5-7 day weather forecast
- ⭐ Save favorite cities and view search history
- 📱 Responsive, mobile-first design
- 🌓 Dark/Light mode toggle
- 🎨 Weather icons and dynamic background animations
- ⚡ Real-time weather updates
- 🔔 Push notifications for severe weather (optional)

## Tech Stack

- **Frontend**: React, TailwindCSS, React Query
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **API**: OpenWeatherMap API

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- OpenWeatherMap API key

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd client && npm install
   cd ../server && npm install
   ```

3. Create `.env` file in the server directory with:
   ```
   MONGODB_URI=your_mongodb_uri
   OPENWEATHER_API_KEY=your_api_key
   PORT=5000
   ```

4. Start the development servers:
   - Backend: `cd server && npm run dev`
   - Frontend: `cd client && npm run dev`

## Project Structure

```
weather-app/
├── client/                   # React Frontend
│   ├── public/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React Context
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Helper functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── tailwind.config.js
├── server/                   # Node + Express Backend
│   ├── controllers/         # Route controllers
│   ├── routes/             # API routes
│   ├── models/             # MongoDB models
│   ├── middleware/         # Custom middleware
│   ├── config/            # Configuration files
│   ├── server.js          # Server entry point
│   └── .env
└── package.json
```

## License

MIT 