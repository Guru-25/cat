import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ChartBarIcon, 
  ClipboardDocumentListIcon, 
  UserGroupIcon, 
  TruckIcon,
  ShieldExclamationIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon },
    { name: 'Tasks', href: '/tasks', icon: ClipboardDocumentListIcon },
    { name: 'Operators', href: '/operators', icon: UserGroupIcon },
    { name: 'Machines', href: '/machines', icon: TruckIcon },
    { name: 'Safety', href: '/safety', icon: ShieldExclamationIcon },
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

          {/* User menu */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-300 hover:text-white p-2 rounded-md">
              <Cog6ToothIcon className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm font-medium text-white">John Smith</div>
                <div className="text-xs text-gray-300">Operator</div>
              </div>
              <div className="h-8 w-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-black">JS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'text-yellow-400 bg-gray-900'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`
              }
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 