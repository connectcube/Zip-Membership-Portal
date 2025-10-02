import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
} from 'lucide-react';
import { useUserStore } from '@/lib/zustand';

interface SidebarProps {
  activePage?: string;
  userName?: string;
  membershipType?: string;
  membershipStatus?: string;
  expiryDate?: string;
  onLogout?: () => void;
  setCurrentPage?: (page: string) => void;
}

const Sidebar = ({
  activePage = 'dashboard',
  setCurrentPage = () => {},
  userName = 'John Doe',
  membershipType = 'Professional Planner',
  membershipStatus = 'Active',
  expiryDate = '31 Dec 2023',
  onLogout = () => {},
}: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useUserStore();
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home size={20} />,
      path: '/dashboard',
    },
    {
      id: 'profile',
      label: 'My Profile',
      icon: <User size={20} />,
      path: '/profile',
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: <CreditCard size={20} />,
      path: '/payments',
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: <FileText size={20} />,
      path: '/documents',
    },
    {
      id: 'events',
      label: 'Events & CPD',
      icon: <Calendar size={20} />,
      path: '/events',
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell size={20} />,
      path: '/notifications',
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: <MessageSquare size={20} />,
      path: '/messages',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings size={20} />,
      path: '/settings',
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: <HelpCircle size={20} />,
      path: '/help',
    },
  ];
  const getFullMembershipType = value => {
    const typeMap = {
      technician: 'Technician',
      associate: 'Associate',
      full: 'Full Member',
      fellow: 'Fellow',
      student: 'Student Chapter',
      postgrad: 'Post Grad.',
      'planning-firms': 'Planning Firms',
      'educational-ngo': 'Educational/Research Institutions or NGO',
    };

    return typeMap[value] || 'Unknown Type';
  };
  return (
    <div
      className={`h-full bg-slate-800 text-white flex flex-col transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Toggle button */}
      <div className="flex justify-end p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="hover:bg-slate-700 text-white"
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </Button>
      </div>

      {/* User profile section */}
      <div
        className={`flex flex-col items-center p-4 border-b border-slate-700 ${
          collapsed ? 'pb-2' : 'pb-4'
        }`}
      >
        <div
          style={{ backgroundImage: `url(${user.profile.photoURL})`, backgroundSize: 'cover' }}
          className={`flex justify-center ${
            !user.profile.photoURL && 'bg-gray-500'
          } items-center mb-2 rounded-full w-16 h-16`}
        >
          {!user.profile.photoURL && <User />}
        </div>
        {!collapsed && (
          <div className="text-center">
            <h3 className="font-medium">
              {(user &&
                user.profile.firstName +
                  ' ' +
                  user.profile.middleName +
                  ' ' +
                  user.profile.lastName) ||
                userName}
            </h3>
            <p className="text-slate-300 text-xs">
              {getFullMembershipType(user.profile.membershipInfo.membershipType)}
            </p>
            <div className="flex flex-col gap-1 mt-2">
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  user.profile.membershipInfo.isActive ? 'bg-green-600' : 'bg-red-600'
                }`}
              >
                {user.profile.membershipInfo.isActive ? 'Active' : 'Inactive'}
              </span>
              <span className="text-slate-300 text-xs">
                {user.profile.membershipInfo.expiryDate &&
                  `Expires: ${user.profile.membershipInfo.expiryDate}`}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map(item => (
            <li key={item.id}>
              <TooltipProvider>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => setCurrentPage(item.id)}
                      className={`flex w-full justify-start items-center p-2 rounded-md ${
                        activePage === item.id ? 'bg-slate-700' : 'hover:bg-slate-700'
                      } transition-colors ${collapsed ? 'justify-center' : 'px-4'}`}
                    >
                      <span className="text-slate-300">{item.icon}</span>
                      {!collapsed && <span className="ml-3">{item.label}</span>}
                    </Button>
                  </TooltipTrigger>
                  {collapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
                </Tooltip>
              </TooltipProvider>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout button */}
      <div className="p-4 border-slate-700 border-t">
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={`w-full text-white hover:bg-red-600 hover:text-white ${
                  collapsed ? 'justify-center' : 'justify-start'
                }`}
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
