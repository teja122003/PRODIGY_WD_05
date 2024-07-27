const express = require('express');
const axios = require('axios');
require('dotenv').config();
const path = require('path');

const app = express();
const port = 3000;

const API_KEY = process.env.API_KEY;

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Define a route for fetching weather data
app.get('/weather', (req, res) => {
  const address = req.query.address; // Read the address query parameter from the request
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${address}&units=metric&appid=${API_KEY}`;
  console.log(url);

  // Make an HTTP GET request to the API using axios
  axios.get(url)
    .then(response => {
      const data = response.data;
      const cityName = data.name;
      const temperature = data.main.temp;
      const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString();
      const message = `City Name: ${cityName}<br>Temperature: ${temperature}&deg;C<br>Sunset Time: ${sunsetTime}`;

      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Weather App</title>
          <style>
            body, html {
              height: 100%;
              margin: 0;
              font-family: Arial, sans-serif;
              color: white;
            }
            body {
              background-image: url('https://race.com/wp-content/uploads/2023/04/can-weather-impact-wifi-1000x510.webp');
              background-size: cover;
              background-position: center;
              background-repeat: no-repeat;
            }
            #container {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              text-align: center;
              background-color: rgba(0, 0, 0, 0.5); /* Optional: Add a semi-transparent background for better readability */
              padding: 20px;
              border-radius: 10px;
            }
            h1 {
              margin: 0.5em 0;
            }
          </style>
        </head>
        <body>
          <div id="container">
            <h1>${message}</h1>
          </div>
        </body>
        </html>
      `);
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Error occurred while fetching weather data');
    });
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
