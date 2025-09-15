import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Eye, MapPin, Fuel, Gauge, Calendar } from "lucide-react";

interface Car {
  mileage?: number;
  gearbox?: string;
  location?: string;
  condition?: string;

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
  brand_name: string;
  price?: number | string;
}

interface CarResultCardProps {
  car: Car;
}

export const CarResultCard = ({ car }: CarResultCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-card border-border">
      <div className="relative">
        {/* Car Image */}
        <div className="aspect-video bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
          {car.image_url ? (
            <img 
              src={`https:${car.image_url}`}
              alt={`${car.year} ${car.brand_name} ${car.model}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-muted-foreground text-center">
              <div className="text-4xl mb-2">🚗</div>
              <p className="text-sm">No image available</p>
            </div>
          )}
        </div>
        
        {/* Condition Badge */}
        {/*<Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">*/}
        {/*  {['Excellent', 'Good', 'Fair'][Math.floor(Math.random() * 3)]}*/}
        {/*</Badge>*/}
      </div>

      <CardContent className="p-4">
        {/* Car Title and Price */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold text-lg text-foreground">
              {car.year} {car.brand_name} {car.model}
            </h3>
            <p className="text-2xl font-bold text-primary">
              €{typeof(car.price) == "number" ? car.price.toLocaleString() : car.price}
            </p>
          </div>
        </div>

        {/* Car Details Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {car.kilometers && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Gauge className="h-4 w-4" />
              <span>{car.kilometers.toLocaleString()} kilometers</span>
            </div>
          )}
          
          {car.fuel && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Fuel className="h-4 w-4" />
              <span>{car.fuel}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{car.year}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>Macedonia</span>
          </div>
        </div>

        {/* Transmission Badge */}
        {car.gearbox && (
          <Badge variant="outline" className="mb-3">
            {car.gearbox}
          </Badge>
        )}

        {/* Action Buttons */}
        <div className="flex pt-2">
          <Button className="flex-1" size="sm" onClick={() => window.open(`${car.link}`, "_blank")}>
            View advertisement
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};