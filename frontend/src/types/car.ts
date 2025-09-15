export interface Car {
  "c": {
    engine_power: string;
    show_class: string;
    color: string;
    year: number;
    fuel: string;
    image_url: string;
    link: string;
    registered_to: string;
    car_body: string;
    kilometers: number;
    model: string;
    registration: string;
    id: string;
    gearbox: string;
    brand_name: string;
    price?: number | string;
  }
}

export interface Results {
  exact_matches: Car[]
  similar_matches: Car[]
}

export interface SearchResponse {
  results: Results
  query: string
}