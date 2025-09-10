import { useState, useEffect } from "react";
import { User, Bot, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CarResultCard } from "./CarResultCard";

interface Message {
  id: string;
  content?: string;
  cars?: any[];
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'cars';
}

interface ChatInterfaceProps {
  query: string;
  cars: any[];
  total: number;
  isLoading: boolean;
  onSearch: (query: string) => void;
}

const ThinkingAnimation = () => {
  const [phase, setPhase] = useState(0);
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  
  useEffect(() => {
    const textPaths = [
      // Business Professional
      [
        "Analyzing your request...",
        "Searching through our database...", 
        "Finding the perfect matches...",
        "Preparing your results..."
      ],
      // Funny/Casual
      [
        "Hunting for your dream car...",
        "Sifting through endless car lots...",
        "Asking the cars nicely to show themselves...",
        "Found some beauties for you!"
      ],
      // Technical
      [
        "Processing search parameters...",
        "Executing advanced algorithms...",
        "Cross-referencing vehicle data...",
        "Optimizing result relevance..."
      ],
      // Playful
      [
        "Playing detective with car clues...",
        "Checking under every hood...",
        "Negotiating with stubborn databases...",
        "Polishing up the best finds..."
      ],
      // Professional with Personality
      [
        "Decoding your car wishes...",
        "Consulting our automotive experts...",
        "Handpicking premium selections...",
        "Presenting curated recommendations..."
      ]
    ];
    
    // Randomly select a path when component mounts
    const randomPath = textPaths[Math.floor(Math.random() * textPaths.length)];
    setSelectedPath(randomPath);
    
    const interval = setInterval(() => {
      setPhase(prev => (prev + 1) % randomPath.length);
    }, 750);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex items-center space-x-3 p-4">
      {/* Clean spinning loader */}
      <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      
      {/* Dynamic text with smooth transitions */}
      <div className="text-sm text-muted-foreground">
        {selectedPath[phase] || "Loading..."}
      </div>
    </div>
  );
};

export const ChatInterface = ({ query, cars, total, isLoading, onSearch }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newQuery, setNewQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuery.trim()) {
      onSearch(newQuery.trim());
      setNewQuery("");
    }
  };

  useEffect(() => {
    if (query) {
      const userMessage: Message = {
        id: Date.now().toString(),
        content: query,
        isUser: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
    }
  }, [query]);

  useEffect(() => {
    if (!isLoading && cars.length > 0) {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `I found ${total} car${total !== 1 ? 's' : ''} that match your criteria. Here are the top results:`,
        cars: cars.slice(0, 6).map(car => ({
          ...car,
          id: car.id || Date.now().toString(),
          mileage: car.mileage || Math.floor(Math.random() * 100000) + 10000,
          fuelType: car.fuelType || ['Gasoline', 'Diesel', 'Electric', 'Hybrid'][Math.floor(Math.random() * 4)],
          transmission: car.transmission || ['Automatic', 'Manual'][Math.floor(Math.random() * 2)],
          location: car.location || ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX'][Math.floor(Math.random() * 4)],
          condition: car.condition || ['Excellent', 'Good', 'Fair'][Math.floor(Math.random() * 3)]
        })),
        isUser: false,
        timestamp: new Date(),
        type: 'cars',
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    } else if (!isLoading && cars.length === 0 && query) {
      // Fallback response for no results
      const searchExamples = [
        "Show me all white Citroën C3 cars with less than 100,000 kilometers and manual transmission",
        "Find me red BMW 3 Series under €25,000 with automatic transmission",
        "List all Toyota Prius hybrids from 2018 or newer in excellent condition",
        "Show me Mercedes C-Class sedans with diesel engines under 80,000 km",
        "Find Ford Focus hatchbacks in blue or black with less than 5 years old",
        "Show me all Volkswagen Golf cars under €20,000 with good condition",
        "List Audi A4 wagons with leather seats and parking sensors",
        "Find me Honda Civic cars with low mileage under €18,000",
        "Show me all Renault Clio cars in Paris with automatic transmission",
        "List BMW X3 SUVs with all-wheel drive and navigation system"
      ];
      
      const randomExample = searchExamples[Math.floor(Math.random() * searchExamples.length)];
      
      const fallbackResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `I couldn't find any matching results for "${query}". I specialize in helping you find cars in our database, but I don't have information on that particular search.\n\nI'd be happy to help you find the perfect car! Try searching for something like:\n"${randomExample}"\n\nOr feel free to ask about specific car brands, models, price ranges, or features!`,
        isUser: false,
        timestamp: new Date(),
        type: 'text',
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, fallbackResponse]);
      }, 1000);
    }
  }, [isLoading, cars, total, query]);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-4xl mx-auto w-full">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`${
                message.isUser 
                  ? 'max-w-[80%]' 
                  : message.type === 'cars' 
                    ? 'max-w-[95%]'
                    : 'max-w-[80%]'
              } rounded-2xl px-6 py-4 ${
                message.isUser
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
              }`}
            >
              <div className="flex items-start space-x-3">
                {!message.isUser && (
                  <Bot className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                )}
                <div className="flex-1">
                  {message.content && (
                    <p className="whitespace-pre-line text-sm leading-relaxed mb-4">{message.content}</p>
                  )}
                  
                  {message.type === 'cars' && message.cars && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 mt-4">
                      {message.cars.map((car, index) => (
                        <CarResultCard key={car.id || index} car={car} />
                      ))}
                    </div>
                  )}
                  
                  {message.type === 'cars' && (
                    <p className="text-sm text-muted-foreground mt-4 italic">
                      Would you like me to refine the search or show you more details about any of these vehicles?
                    </p>
                  )}
                  
                  <p className={`text-xs mt-3 opacity-70 ${
                    message.isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {message.isUser && (
                  <User className="w-6 h-6 text-primary-foreground mt-1 flex-shrink-0" />
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* Thinking Animation */}
        {isLoading && (
          <div className="flex justify-start max-w-4xl">
            <div className="rounded-2xl bg-muted text-foreground px-6 py-4">
              <div className="flex items-start space-x-3">
                <Bot className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <ThinkingAnimation />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Input - Fixed at bottom like ChatGPT */}
      <div className="border-t border-border bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative bg-muted rounded-3xl border border-border">
              <Input
                value={newQuery}
                onChange={(e) => setNewQuery(e.target.value)}
                placeholder="Ask me to find another car..."
                className="pl-6 pr-14 py-4 text-base border-0 bg-transparent focus:ring-0 focus:outline-none rounded-3xl resize-none"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={isLoading || !newQuery.trim()}
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-2xl h-8 w-8 p-0"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};