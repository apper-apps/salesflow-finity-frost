import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import ApperIcon from '@/components/ApperIcon';
import { AuthContext } from '../../App';
const Header = ({ onMenuClick, title = 'Dashboard', onSearch, className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { logout } = useContext(AuthContext);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const handleSearch = (term) => {
    setSearchTerm(term);
    onSearch?.(term);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch?.('');
  };

  const handleLogout = () => {
    logout();
  };
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`bg-white shadow-sm border-b border-gray-200 ${className}`}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              icon="Menu"
              onClick={onMenuClick}
              className="lg:hidden mr-3"
            />
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:block w-96">
              <SearchBar
                placeholder="Search contacts, deals, tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onSearch={handleSearch}
                onClear={handleClear}
              />
            </div>
            
<div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                icon="Bell"
                className="relative"
              >
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full"></span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                icon="Settings"
              />

              {isAuthenticated && (
                <div className="flex items-center space-x-2 ml-4">
                  <div className="hidden md:block text-sm text-gray-600">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    icon="LogOut"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;