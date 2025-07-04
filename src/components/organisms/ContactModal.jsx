import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import ApperIcon from '@/components/ApperIcon';

const ContactModal = ({
  isOpen,
  onClose,
  onSave,
  contact = null,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'active',
    tags: [],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name || '',
        email: contact.email || '',
        phone: contact.phone || '',
        company: contact.company || '',
        status: contact.status || 'active',
        tags: contact.tags || [],
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        status: 'active',
        tags: [],
      });
    }
    setErrors({});
  }, [contact, isOpen]);

  const handleFieldChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }
    
    if (!formData.company.trim()) {
      newErrors.company = 'Company is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const contactData = {
      ...formData,
      Id: contact?.Id,
      createdAt: contact?.createdAt || new Date().toISOString(),
      lastContact: contact?.lastContact || new Date().toISOString(),
    };
    
    onSave(contactData);
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      status: 'active',
      tags: [],
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="modal-content w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {contact ? 'Edit Contact' : 'Add New Contact'}
            </h2>
            <Button
              variant="outline"
              size="sm"
              icon="X"
              onClick={handleClose}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card-body space-y-6">
            <FormField
              name="name"
              label="Full Name"
              value={formData.name}
              onChange={handleFieldChange}
              error={errors.name}
              required
              placeholder="Enter full name"
              icon="User"
            />

            <FormField
              name="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleFieldChange}
              error={errors.email}
              required
              placeholder="Enter email address"
              icon="Mail"
            />

            <FormField
              name="phone"
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={handleFieldChange}
              error={errors.phone}
              required
              placeholder="Enter phone number"
              icon="Phone"
            />

            <FormField
              name="company"
              label="Company"
              value={formData.company}
              onChange={handleFieldChange}
              error={errors.company}
              required
              placeholder="Enter company name"
              icon="Building"
            />

            <FormField
              name="status"
              label="Status"
              type="select"
              value={formData.status}
              onChange={handleFieldChange}
              error={errors.status}
              required
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
            />
          </div>

          <div className="card-footer">
            <div className="flex items-center justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                disabled={loading}
              >
                {contact ? 'Update Contact' : 'Add Contact'}
              </Button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ContactModal;