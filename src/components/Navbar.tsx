import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ChartBarIcon, 
  ClipboardDocumentListIcon, 
  UserGroupIcon, 
  TruckIcon,
  ShieldExclamationIcon,
  Cog6ToothIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon },
    { name: 'Tasks', href: '/tasks', icon: ClipboardDocumentListIcon },
    // { name: 'Operators', href: '/operators', icon: UserGroupIcon },
    { name: 'Machines & Safety', href: '/machines', icon: TruckIcon },
    // { name: 'Safety', href: '/safety', icon: ShieldExclamationIcon },
    { name: 'E-Learning', href: '/elearning', icon: AcademicCapIcon },
  ];

  return (
    <nav className="bg-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <TruckIcon className="h-8 w-8 text-yellow-400" />
              <span className="ml-2 text-xl font-bold text-white">
                CAT Smart Assistant
              </span>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'text-yellow-400 border-b-2 border-yellow-400'
                        : 'text-gray-300 hover:text-white hover:border-gray-300 border-b-2 border-transparent'
                    }`
                  }
                >
                  <item.icon className="h-5 w-5 mr-2" />
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
          
          {/* Settings */}
          <div className="flex items-center">
            <button className="text-gray-300 hover:text-white p-2">
              <Cog6ToothIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 