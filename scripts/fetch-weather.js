import 'dotenv/config';
import { MongoClient } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI;
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

async function run() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();

  // DB donde están las estaciones
  const stationsDb = client.db('weather-flow-db');
  const stationsCollection = stationsDb.collection('weatherstations');

  // DB donde guardás observaciones
  const weatherDb = client.db('weather');
  const observationsCollection = weatherDb.collection('observations');

  const stations = await stationsCollection.find({}).toArray();

  console.log(`Stations found: ${stations.length}`);

  for (const station of stations) {
    const lat = station?.location?.latitude;
    const lon = station?.location?.longitude;

    if (!lat || !lon) {
      console.log('Skipping station (missing coords)', station._id);
      continue;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data.cod !== 200) {
        console.log('OpenWeather error:', station._id, data);
        continue;
      }

      console.log('Weather OK:', station._id, data.main.temp);

      await observationsCollection.insertOne({
        stationId: station._id,
        location: station.location,
        weather: data.weather,
        main: data.main,
        temp: data.main?.temp,
        humidity: data.main?.humidity,
        wind: data.wind,
        createdAt: new Date(),
        source: 'openweathermap',
      });
    } catch (err) {
      console.error('Error station:', station._id, err);
    }
  }

  await client.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
