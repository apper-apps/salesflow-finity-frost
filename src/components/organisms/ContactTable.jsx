import { useState } from 'react';
import { motion } from 'framer-motion';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { format } from 'date-fns';

const ContactTable = ({ 
  contacts = [], 
  onEdit, 
  onDelete, 
  onView,
  loading = false,
  className = '' 
}) => {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedContacts = [...contacts].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  if (loading) {
    return (
      <div className="table-container">
        <div className="bg-white rounded-lg">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="skeleton w-12 h-12 rounded-full"></div>
                <div className="flex-1">
                  <div className="skeleton h-4 w-32 mb-2"></div>
                  <div className="skeleton h-3 w-48"></div>
                </div>
                <div className="skeleton h-6 w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="table-container">
        <div className="bg-white rounded-lg p-12 text-center">
          <ApperIcon name="Users" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No contacts found</h3>
          <p className="text-gray-600 mb-6">Get started by adding your first contact</p>
          <Button icon="Plus" onClick={() => onEdit?.()}>
            Add Contact
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`table-container ${className}`}>
      <table className="table">
        <thead>
          <tr>
            <th 
              className="cursor-pointer hover:bg-primary/90"
              onClick={() => handleSort('name')}
            >
              <div className="flex items-center">
                Name
                <ApperIcon 
                  name={sortField === 'name' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                  className="w-4 h-4 ml-1" 
                />
              </div>
            </th>
            <th 
              className="cursor-pointer hover:bg-primary/90"
              onClick={() => handleSort('email')}
            >
              <div className="flex items-center">
                Email
                <ApperIcon 
                  name={sortField === 'email' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                  className="w-4 h-4 ml-1" 
                />
              </div>
            </th>
            <th 
              className="cursor-pointer hover:bg-primary/90"
              onClick={() => handleSort('company')}
            >
              <div className="flex items-center">
                Company
                <ApperIcon 
                  name={sortField === 'company' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                  className="w-4 h-4 ml-1" 
                />
              </div>
            </th>
            <th 
              className="cursor-pointer hover:bg-primary/90"
              onClick={() => handleSort('status')}
            >
              <div className="flex items-center">
                Status
                <ApperIcon 
                  name={sortField === 'status' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                  className="w-4 h-4 ml-1" 
                />
              </div>
            </th>
            <th 
              className="cursor-pointer hover:bg-primary/90"
              onClick={() => handleSort('lastContact')}
            >
              <div className="flex items-center">
                Last Contact
                <ApperIcon 
                  name={sortField === 'lastContact' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                  className="w-4 h-4 ml-1" 
                />
              </div>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedContacts.map((contact, index) => (
            <motion.tr
              key={contact.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="hover:bg-gray-50 transition-colors"
            >
              <td>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold text-sm">
                      {contact.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{contact.name}</div>
                    <div className="text-sm text-gray-600">{contact.phone}</div>
                  </div>
                </div>
              </td>
              <td>
                <div className="text-sm text-gray-900">{contact.email}</div>
              </td>
              <td>
                <div className="text-sm text-gray-900">{contact.company}</div>
              </td>
              <td>
                <Badge 
                  variant={contact.status === 'active' ? 'active' : 'inactive'}
                  size="sm"
                >
                  {contact.status}
                </Badge>
              </td>
              <td>
                <div className="text-sm text-gray-900">
                  {contact.lastContact ? format(new Date(contact.lastContact), 'MMM d, yyyy') : 'Never'}
                </div>
              </td>
              <td>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon="Eye"
                    onClick={() => onView?.(contact)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    icon="Edit"
                    onClick={() => onEdit?.(contact)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    icon="Trash2"
                    onClick={() => onDelete?.(contact.Id)}
                  />
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContactTable;