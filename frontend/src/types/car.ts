export interface Car {
  id: string;
  brandName: string;
  model: string;
  year: number;
  imageUrl: string;
  adUrl: string;
  fuel: string;
  kilometers: number;
  gearbox: string;
  carBody: string;
  color: string;
  registration: string;
  registeredTo: string;
  enginePower: string;
  showClass: string;
  price?: number;
}

export interface Results {
  exact_matches: Car[]
  similar_matches: Car[]
}

export interface SearchResponse {
  results: Results
  query: string
}