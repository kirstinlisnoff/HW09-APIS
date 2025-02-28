import fs from 'fs/promises';

// TODO: Define a City class with name and id properties
class City {
  name: string;
  id: number;

  constructor(name: string, id: number) {
    this.name = name;
    this.id = id;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
    private path: string = './db/db.json';
   // private async read() {}
    private async read(): Promise<City[]> {
      try {
        const data = await fs.readFile(this.path, 'utf-8');
        return JSON.parse(data);
      } catch (error) {
        console.log('error fetching history');
        return [];
      }
    }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
   // private async write(cities: City[]) {}
    private async write(cities: City[]): Promise<void> {
        await fs.writeFile(this.path, JSON.stringify(cities, null, 2), 'utf-8');
    }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  // async getCities() {}
  async getCities(): Promise<City[]> {
    return await this.read();
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  // async addCity(city: string) {}
  async addCity(city: string): Promise<void> {
    try {
    const cities = await this.getCities();
    const newCity = new City(city, Date.now());
    cities.push(newCity);
    await this.write(cities);
  } catch (error) {
    console.log('error adding city to search history');
  }
}
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}
}

export default new HistoryService();

