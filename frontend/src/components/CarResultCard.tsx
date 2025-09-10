import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Eye, MapPin, Fuel, Gauge, Calendar } from "lucide-react";

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage?: number;
  fuelType?: string;
  transmission?: string;
  location?: string;
  images?: string[];
  condition?: string;
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
          {car.images && car.images.length > 0 ? (
            <img 
              src={car.images[0]} 
              alt={`${car.year} ${car.make} ${car.model}`}
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
        {car.condition && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
            {car.condition}
          </Badge>
        )}
        
        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex gap-2">
          <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-white/90 hover:bg-white">
            <Heart className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-white/90 hover:bg-white">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Car Title and Price */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold text-lg text-foreground">
              {car.year} {car.make} {car.model}
            </h3>
            <p className="text-2xl font-bold text-primary">
              ${car.price.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Car Details Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {car.mileage && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Gauge className="h-4 w-4" />
              <span>{car.mileage.toLocaleString()} miles</span>
            </div>
          )}
          
          {car.fuelType && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Fuel className="h-4 w-4" />
              <span>{car.fuelType}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{car.year}</span>
          </div>
          
          {car.location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{car.location}</span>
            </div>
          )}
        </div>

        {/* Transmission Badge */}
        {car.transmission && (
          <Badge variant="outline" className="mb-3">
            {car.transmission}
          </Badge>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button className="flex-1" size="sm">
            View Details
          </Button>
          <Button variant="outline" className="flex-1" size="sm">
            Contact Seller
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};