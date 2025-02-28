import { Router, type Request, type Response } from 'express';
const router = Router();


import weatherService from '../../service/weatherService.js';
import historyService from '../../service/historyService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  const { city } = req.body;
try {
  const weatherData = await weatherService.getWeatherForCity(city);
  res.json(weatherData);
} catch (error) {
  console.error('Error finding weather data');
  res.status(500).send({error: 'error'});
}
  // TODO: save city to search history
  try {
    await historyService.addCity(city);
  } catch (error) {
    console.error('Error saving city');
    res.status(500).send({error})
  }
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
try {
  const cities = await historyService.getCities();
  res.json(cities);
} catch (error) {
  console.error('Error getting history');
  res.status(500).send({error})
}
});
// * BONUS TODO: DELETE city from search history
// router.delete('/history/:id', async (req: Request, res: Response) => {});

export default router;
