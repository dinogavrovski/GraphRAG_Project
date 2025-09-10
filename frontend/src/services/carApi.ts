import { Car, SearchResponse } from "@/types/car";

// Mock data for development
const mockCars: Car[] = [
  {
    id: "1",
    brandName: "BMW",
    model: "X5",
    year: 2022,
    imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop",
    adUrl: "#",
    fuel: "Gasoline",
    kilometers: 15000,
    gearbox: "Automatic",
    carBody: "SUV",
    color: "Black",
    registration: "2022-03-15",
    registeredTo: "Private",
    enginePower: "340 HP",
    showClass: "Luxury",
    price: 68000
  },
  {
    id: "2",
    brandName: "Audi",
    model: "A4",
    year: 2021,
    imageUrl: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop",
    adUrl: "#",
    fuel: "Gasoline",
    kilometers: 22000,
    gearbox: "Automatic",
    carBody: "Sedan",
    color: "Silver",
    registration: "2021-08-10",
    registeredTo: "Private",
    enginePower: "252 HP",
    showClass: "Premium",
    price: 42000
  },
  {
    id: "3",
    brandName: "Tesla",
    model: "Model 3",
    year: 2023,
    imageUrl: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop",
    adUrl: "#",
    fuel: "Electric",
    kilometers: 8000,
    gearbox: "Automatic",
    carBody: "Sedan",
    color: "White",
    registration: "2023-01-20",
    registeredTo: "Private",
    enginePower: "283 HP",
    showClass: "Electric",
    price: 48000
  },
  {
    id: "4",
    brandName: "Mercedes-Benz",
    model: "C-Class",
    year: 2020,
    imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop",
    adUrl: "#",
    fuel: "Gasoline",
    kilometers: 35000,
    gearbox: "Automatic",
    carBody: "Sedan",
    color: "Blue",
    registration: "2020-05-12",
    registeredTo: "Private",
    enginePower: "255 HP",
    showClass: "Luxury",
    price: 38000
  },
  {
    id: "5",
    brandName: "Toyota",
    model: "Camry",
    year: 2019,
    imageUrl: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop",
    adUrl: "#",
    fuel: "Hybrid",
    kilometers: 45000,
    gearbox: "Automatic",
    carBody: "Sedan",
    color: "Red",
    registration: "2019-09-05",
    registeredTo: "Private",
    enginePower: "208 HP",
    showClass: "Standard",
    price: 28000
  },
  {
    id: "6",
    brandName: "Porsche",
    model: "911",
    year: 2021,
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop",
    adUrl: "#",
    fuel: "Gasoline",
    kilometers: 12000,
    gearbox: "Manual",
    carBody: "Coupe",
    color: "Yellow",
    registration: "2021-04-18",
    registeredTo: "Private",
    enginePower: "379 HP",
    showClass: "Sports",
    price: 125000
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock search function that filters based on natural language query
const filterCarsByQuery = (cars: Car[], query: string): Car[] => {
  const lowerQuery = query.toLowerCase();
  
  return cars.filter(car => {
    // Check brand, model, color, fuel type, car body, etc.
    const searchableText = [
      car.brandName,
      car.model,
      car.color,
      car.fuel,
      car.carBody,
      car.gearbox,
      car.showClass,
      car.year.toString()
    ].join(' ').toLowerCase();

    // Simple keyword matching for demo
    const keywords = lowerQuery.split(' ');
    return keywords.some(keyword => {
      // Handle price ranges
      if (keyword.includes('under') || keyword.includes('<')) {
        const priceMatch = lowerQuery.match(/under.*?(\d+)k?/);
        if (priceMatch && car.price) {
          const maxPrice = parseInt(priceMatch[1]) * (lowerQuery.includes('k') ? 1000 : 1);
          return car.price <= maxPrice;
        }
      }
      
      // Handle year ranges  
      if (keyword.includes('newer') || keyword.includes('after') || keyword.includes('20')) {
        const yearMatch = lowerQuery.match(/(20\d{2})/);
        if (yearMatch) {
          const minYear = parseInt(yearMatch[1]);
          return car.year >= minYear;
        }
      }

      return searchableText.includes(keyword);
    });
  });
};

export const searchCars = async (query: string): Promise<SearchResponse> => {
  // Simulate API call delay
  await delay(800 + Math.random() * 700);
  
  // In production, this would be a real API call:
  // const response = await fetch('/api/search', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ query })
  // });
  // return response.json();

  const filteredCars = filterCarsByQuery(mockCars, query);
  
  return {
    cars: filteredCars,
    total: filteredCars.length
  };
};