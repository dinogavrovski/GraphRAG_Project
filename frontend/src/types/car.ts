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

export interface SearchResponse {
  cars: Car[];
  total: number;
}