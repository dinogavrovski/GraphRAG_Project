import { useState } from "react";
import { MessageSquare, Search, Library, Plus, MoreHorizontal } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const chatHistory = [
  // "Car rental pricing comparison",
  // "Best SUVs for families",
  // "Electric vehicle options",
  // "Luxury car features",
  // "Budget-friendly sedans",
  // "Sports car recommendations",
  // "Truck rental availability",
  // "Hybrid vehicle benefits",
  // "Car insurance tips",
  // "Maintenance cost analysis"
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = chatHistory.filter(chat =>
    chat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Sidebar className="bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <SidebarContent className="bg-sidebar">
        {/* Sidebar Toggle - visible only when expanded, aligned to match outside position */}
        {!isCollapsed && (
          <div className="p-4 border-b border-sidebar-border">
            <SidebarTrigger className="bg-transparent hover:bg-sidebar-accent text-sidebar-foreground border-sidebar-border" />
          </div>
        )}
        {/* New Chat Button */}
        <div className="p-2">
          <Button 
            className="w-full bg-transparent hover:bg-sidebar-accent text-sidebar-foreground border border-sidebar-border justify-start"
            size="sm"
            onClick={() => window.location.reload()}
          >
            <Plus className="h-4 w-4 mr-2" />
            {!isCollapsed && "New chat"}
          </Button>
        </div>

        {/* Search */}
        <div className="px-2 pb-2 space-y-1">
          {/*<SidebarMenuButton className="w-full hover:bg-sidebar-accent text-sidebar-accent-foreground justify-start">*/}
          {/*  <Search className="h-4 w-4" />*/}
          {/*  {!isCollapsed && <span className="ml-2">Search chats</span>}*/}
          {/*</SidebarMenuButton>*/}
        </div>

        {/* Chat History */}
        {!isCollapsed && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-muted-foreground text-xs uppercase tracking-wider px-2 mb-2">
              {/*Today*/}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredChats.slice(0, 8).map((chat, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton className="w-full hover:bg-sidebar-accent text-sidebar-accent-foreground justify-between group px-2">
                      <div className="flex items-center min-w-0 flex-1">
                        <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate text-sm">{chat}</span>
                      </div>
                      <MoreHorizontal className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Yesterday Section */}
        {!isCollapsed && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-muted-foreground text-xs uppercase tracking-wider px-2 mb-2">
              {/*Yesterday*/}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredChats.slice(8).map((chat, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton className="w-full hover:bg-sidebar-accent text-sidebar-accent-foreground justify-between group px-2">
                      <div className="flex items-center min-w-0 flex-1">
                        <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate text-sm">{chat}</span>
                      </div>
                      <MoreHorizontal className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}