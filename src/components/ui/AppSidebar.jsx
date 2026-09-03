import {
  LayoutDashboard,
  PlusCircle,
  Search,
  Calculator,
  Users,
  Ship,
  MapPin,
  FileText,
  MessageSquare,
  User,
  Settings,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";

import { Link } from "react-router-dom";

const mainItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
];

const importItems = [
  {
    title: "New Import",
    url: "/new-import",
    icon: PlusCircle,
  },
  {
    title: "HS Code Search",
    url: "/hs-code-search",
    icon: Search,
  },
  {
    title: "Import Calculator",
    url: "/calculator",
    icon: Calculator,
  },
];

const serviceItems = [
  {
    title: "Find Clearing Agent",
    url: "/find-agent",
    icon: Users,
  },
  {
    title: "Shipments",
    url: "/shipments",
    icon: Ship,
  },
  {
    title: "Track Shipment",
    url: "/track-shipment",
    icon: MapPin,
  },
  {
    title: "Documents",
    url: "/documents",
    icon: FileText,
  },
  {
    title: "Messages",
    url: "/messages",
    icon: MessageSquare,
  },
];

const accountItems = [
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

function NavGroup({ label, items }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>

      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link to={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {/* Brand */}
        <div className="px-4 py-5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
              IE
            </div>

            <div className="group-data-[collapsible=icon]:hidden">
              <h1 className="font-bold text-lg">ImportEase</h1>
              <p className="text-xs text-muted-foreground">
                Import Management
              </p>
            </div>
          </div>
        </div>

        <NavGroup label="Overview" items={mainItems} />

        <NavGroup label="Import" items={importItems} />

        <NavGroup label="Services" items={serviceItems} />

        <NavGroup label="Account" items={accountItems} />
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <LogOut />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}