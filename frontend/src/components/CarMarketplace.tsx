import { useState } from "react";
import { Navbar } from "./Navbar";
import { HeroSection } from "./HeroSection";
import { ChatInterface } from "./ChatInterface";
import { searchCars } from "@/services/carApi";
import { Car } from "@/types/car";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const CarMarketplaceContent = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");
  const [total, setTotal] = useState(0);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setCurrentQuery(query);
    
      // Start timer for minimum 3-second loading
    const startTime = Date.now();
    
    try {
      const response = await searchCars(query);
      setCars([...response.results.exact_matches, ...response.results.similar_matches]);
      console.log("setCars: ", response.results.exact_matches)
      setTotal(response.results.exact_matches.length + response.results.similar_matches.length);
      setHasSearched(true);
      
      // Ensure minimum 3-second loading time
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 3000 - elapsedTime);
      
      setTimeout(() => {
        setIsLoading(false);
      }, remainingTime);
      
    } catch (error) {
      console.error("Search error:", error);
      setCars([]);
      setTotal(0);
      
      // Still respect minimum loading time even on error
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 3000 - elapsedTime);
      
      setTimeout(() => {
        setIsLoading(false);
      }, remainingTime);
    }
  };

  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      
      {/* Sidebar Toggle - visible only when collapsed */}
      {isCollapsed && (
        <div className="absolute top-4 left-4 z-30">
          <SidebarTrigger className="bg-white/20 hover:bg-white/30 text-white border-white/20" />
        </div>
      )}
      
      <div className="flex-1">
        <div className="min-h-screen">
          <Navbar />
          
          {!hasSearched ? (
            <HeroSection onSearch={handleSearch} isLoading={isLoading} />
          ) : (
            <ChatInterface 
              query={currentQuery}
              cars={cars}
              total={total}
              isLoading={isLoading}
              onSearch={handleSearch}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export const CarMarketplace = () => {
  return (
    <SidebarProvider>
      <CarMarketplaceContent />
    </SidebarProvider>
  );
};