import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Home,
  User,
  CreditCard,
  FileText,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Calendar,
  MessageSquare,
} from "lucide-react";

interface SidebarProps {
  activePage?: string;
  userName?: string;
  membershipType?: string;
  membershipStatus?: string;
  expiryDate?: string;
  onLogout?: () => void;
}

const Sidebar = ({
  activePage = "dashboard",
  userName = "John Doe",
  membershipType = "Professional Planner",
  membershipStatus = "Active",
  expiryDate = "31 Dec 2023",
  onLogout = () => {},
}: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <Home size={20} />,
      path: "/dashboard",
    },
    {
      id: "profile",
      label: "My Profile",
      icon: <User size={20} />,
      path: "/profile",
    },
    {
      id: "payments",
      label: "Payments",
      icon: <CreditCard size={20} />,
      path: "/payments",
    },
    {
      id: "documents",
      label: "Documents",
      icon: <FileText size={20} />,
      path: "/documents",
    },
    {
      id: "events",
      label: "Events & CPD",
      icon: <Calendar size={20} />,
      path: "/events",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell size={20} />,
      path: "/notifications",
    },
    {
      id: "messages",
      label: "Messages",
      icon: <MessageSquare size={20} />,
      path: "/messages",
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings size={20} />,
      path: "/settings",
    },
    {
      id: "help",
      label: "Help & Support",
      icon: <HelpCircle size={20} />,
      path: "/help",
    },
  ];

  return (
    <div
      className={`h-full bg-slate-800 text-white flex flex-col transition-all duration-300 ${collapsed ? "w-20" : "w-64"}`}
    >
      {/* Toggle button */}
      <div className="flex justify-end p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-white hover:bg-slate-700"
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </Button>
      </div>

      {/* User profile section */}
      <div
        className={`flex flex-col items-center p-4 border-b border-slate-700 ${collapsed ? "pb-2" : "pb-4"}`}
      >
        <div className="w-16 h-16 rounded-full bg-slate-600 flex items-center justify-center mb-2">
          <User size={32} />
        </div>
        {!collapsed && (
          <div className="text-center">
            <h3 className="font-medium">{userName}</h3>
            <p className="text-xs text-slate-300">{membershipType}</p>
            <div className="mt-2 flex flex-col gap-1">
              <span
                className={`text-xs px-2 py-1 rounded-full ${membershipStatus === "Active" ? "bg-green-600" : "bg-red-600"}`}
              >
                {membershipStatus}
              </span>
              <span className="text-xs text-slate-300">
                Expires: {expiryDate}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <TooltipProvider>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.path}
                      className={`flex items-center p-2 rounded-md ${activePage === item.id ? "bg-slate-700" : "hover:bg-slate-700"} transition-colors ${collapsed ? "justify-center" : "px-4"}`}
                    >
                      <span className="text-slate-300">{item.icon}</span>
                      {!collapsed && <span className="ml-3">{item.label}</span>}
                    </Link>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout button */}
      <div className="p-4 border-t border-slate-700">
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={`w-full text-white hover:bg-red-600 hover:text-white ${collapsed ? "justify-center" : "justify-start"}`}
                onClick={onLogout}
              >
                <LogOut size={20} />
                {!collapsed && <span className="ml-2">Logout</span>}
              </Button>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right">Logout</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default Sidebar;
