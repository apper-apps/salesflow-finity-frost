import { motion } from 'framer-motion';
import NavigationItem from '@/components/molecules/NavigationItem';
import ApperIcon from '@/components/ApperIcon';

const Sidebar = ({ isOpen, onClose, className = '' }) => {
  const navigationItems = [
    { to: '/', icon: 'LayoutDashboard', label: 'Dashboard' },
    { to: '/contacts', icon: 'Users', label: 'Contacts' },
    { to: '/deals', icon: 'Target', label: 'Deals' },
    { to: '/tasks', icon: 'CheckSquare', label: 'Tasks' },
    { to: '/activities', icon: 'Activity', label: 'Activities' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:block bg-gradient-to-b from-primary to-primary/90 text-white w-64 min-h-screen shadow-xl ${className}`}>
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">SalesFlow</h1>
              <p className="text-sm text-white/70">CRM Dashboard</p>
            </div>
          </div>
          
          <nav className="space-y-2">
            {navigationItems.map((item) => (
              <NavigationItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
              />
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="relative bg-gradient-to-b from-primary to-primary/90 text-white w-80 max-w-sm shadow-xl"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Zap" className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold">SalesFlow</h1>
                    <p className="text-sm text-white/70">CRM Dashboard</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>
              
              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <NavigationItem
                    key={item.to}
                    to={item.to}
                    icon={item.icon}
                    label={item.label}
                    onClick={onClose}
                  />
                ))}
              </nav>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Sidebar;