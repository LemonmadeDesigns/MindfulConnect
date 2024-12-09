// src/config/navigation.js
import { 
  LayoutDashboard, 
  LineChart, 
  Users, 
  BookOpen,
  SmilePlus
} from 'lucide-react';

export const navigationItems = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard
  },
  // {
  //   path: '/analytics',
  //   label: 'Analytics',
  //   icon: LineChart
  // },
  {
    path: '/analytics',
    label: 'Mood Tracker',
    icon: SmilePlus
  },
  {
    path: '/support-groups',
    label: 'Support Groups',
    icon: Users
  },
  {
    path: '/resources',
    label: 'Resources',
    icon: BookOpen
  }
];