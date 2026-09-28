import React from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  FolderOpen,
  ClipboardList,
  Users,
  Settings,
} from "lucide-react";
import { DASHBOARD_PATHS, type DashboardPath } from "@/app/router/paths";

export interface SidebarItem {
  label: string;
  path: DashboardPath;
  icon: React.ReactNode;
}

export const menuItems: SidebarItem[] = [
  {
    label: "Overview",
    path: DASHBOARD_PATHS.overview,
    icon: <LayoutDashboard size={20} />,
  },
  {
    label: "Products",
    path: DASHBOARD_PATHS.products,
    icon: <ShoppingBag size={20} />,
  },
  {
    label: "Categories",
    path: DASHBOARD_PATHS.categories,
    icon: <FolderOpen size={20} />,
  },
  {
    label: "Inventory",
    path: DASHBOARD_PATHS.inventory,
    icon: <ClipboardList size={20} />,
  },
  {
    label: "Customers",
    path: DASHBOARD_PATHS.customers,
    icon: <Users size={20} />,
  },
  {
    label: "Settings",
    path: DASHBOARD_PATHS.settings,
    icon: <Settings size={20} />,
  },
];
