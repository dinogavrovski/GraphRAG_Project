import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import homeBackground from "@/assets/home_poster_1.jpg"

interface HeroSectionProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const HeroSection = ({ onSearch, isLoading }: HeroSectionProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
   <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
  {/* Background image stays fixed */}
  <img
    src={homeBackground}
    alt="Home Poster"
    className="fixed inset-0 w-full h-full object-cover brightness-50 -z-10"
  />

  {/* Hero content */}
  <div className="relative z-10 w-full text-center transition-all duration-300 ease-in-out">
    <div className="space-y-6 mb-12">
      <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
        Car Search - Find,
        <span className="block">Compare & Drive</span>
      </h1>

      <div className="space-y-4 text-gray-300">
        <div className="flex items-center gap-3 justify-center">
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-white text-shadow-lg">Smart natural language search</span>
        </div>
        <div className="flex items-center gap-3 justify-center">
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-white text-shadow-lg">Compare multiple listings instantly</span>
        </div>
        <div className="flex items-center gap-3 justify-center">
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-white text-shadow-lg">Find your perfect match</span>
        </div>
      </div>
    </div>

    {/* Search Form */}
    <div className="bg-white/10 backdrop-blur-sm rounded-full p-2 shadow-lg max-w-xl mx-auto border border-white/20">
      <form onSubmit={handleSubmit} className="flex gap-2 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 h-4 w-4" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Red SUV under $30k with low mileage"
            className="pl-10 h-8 border-0 bg-transparent focus:ring-0 focus:outline-none rounded-full text-white placeholder:text-gray-400"
            disabled={isLoading}
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="h-8 px-6 text-sm font-semibold rounded-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </form>
    </div>
  </div>
</section>

  );
};