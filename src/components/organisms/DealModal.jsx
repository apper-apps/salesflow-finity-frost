import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import ApperIcon from '@/components/ApperIcon';

const DealModal = ({
  isOpen,
  onClose,
  onSave,
  deal = null,
  contacts = [],
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    contactId: '',
    stage: 'lead',
    value: '',
    probability: '25',
    expectedClose: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (deal) {
      setFormData({
        title: deal.title || '',
        contactId: deal.contactId || '',
        stage: deal.stage || 'lead',
        value: deal.value?.toString() || '',
        probability: deal.probability?.toString() || '25',
        expectedClose: deal.expectedClose ? deal.expectedClose.split('T')[0] : '',
      });
    } else {
      setFormData({
        title: '',
        contactId: '',
        stage: 'lead',
        value: '',
        probability: '25',
        expectedClose: '',
      });
    }
    setErrors({});
  }, [deal, isOpen]);

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
    
    if (!formData.title.trim()) {
      newErrors.title = 'Deal title is required';
    }
    
    if (!formData.contactId) {
      newErrors.contactId = 'Contact is required';
    }
    
    if (!formData.value || parseFloat(formData.value) <= 0) {
      newErrors.value = 'Deal value must be greater than 0';
    }
    
    if (!formData.probability || parseFloat(formData.probability) < 0 || parseFloat(formData.probability) > 100) {
      newErrors.probability = 'Probability must be between 0 and 100';
    }
    
    if (!formData.expectedClose) {
      newErrors.expectedClose = 'Expected close date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const dealData = {
      ...formData,
      Id: deal?.Id,
      value: parseFloat(formData.value),
      probability: parseFloat(formData.probability),
      createdAt: deal?.createdAt || new Date().toISOString(),
    };
    
    onSave(dealData);
  };

  const handleClose = () => {
    setFormData({
      title: '',
      contactId: '',
      stage: 'lead',
      value: '',
      probability: '25',
      expectedClose: '',
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const stageOptions = [
    { value: 'lead', label: 'Lead' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'closed', label: 'Closed Won' },
  ];

  const contactOptions = contacts.map(contact => ({
    value: contact.Id,
    label: `${contact.name} (${contact.company})`,
  }));

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="modal-content w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {deal ? 'Edit Deal' : 'Add New Deal'}
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
              name="title"
              label="Deal Title"
              value={formData.title}
              onChange={handleFieldChange}
              error={errors.title}
              required
              placeholder="Enter deal title"
              icon="Target"
            />

            <FormField
              name="contactId"
              label="Contact"
              type="select"
              value={formData.contactId}
              onChange={handleFieldChange}
              error={errors.contactId}
              required
              options={contactOptions}
              placeholder="Select a contact"
            />

            <FormField
              name="stage"
              label="Stage"
              type="select"
              value={formData.stage}
              onChange={handleFieldChange}
              error={errors.stage}
              required
              options={stageOptions}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="value"
                label="Deal Value"
                type="number"
                value={formData.value}
                onChange={handleFieldChange}
                error={errors.value}
                required
                placeholder="0"
                icon="DollarSign"
              />

              <FormField
                name="probability"
                label="Probability (%)"
                type="number"
                value={formData.probability}
                onChange={handleFieldChange}
                error={errors.probability}
                required
                placeholder="25"
                icon="Percent"
              />
            </div>

            <FormField
              name="expectedClose"
              label="Expected Close Date"
              type="date"
              value={formData.expectedClose}
              onChange={handleFieldChange}
              error={errors.expectedClose}
              required
              icon="Calendar"
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
                {deal ? 'Update Deal' : 'Add Deal'}
              </Button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default DealModal;