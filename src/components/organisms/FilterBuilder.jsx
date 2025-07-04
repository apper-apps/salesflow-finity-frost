import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import FilterCriterion from '@/components/molecules/FilterCriterion';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';
import filterService from '@/services/api/filterService';

const FilterBuilder = ({ 
  isOpen, 
  onClose, 
  onApplyFilter, 
  filterType, // 'contacts' or 'deals'
  currentFilters = [] 
}) => {
  const [criteria, setCriteria] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [savedFilters, setSavedFilters] = useState([]);
  const [selectedSavedFilter, setSelectedSavedFilter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSaveForm, setShowSaveForm] = useState(false);

  // Available fields based on filter type
  const availableFields = {
    contacts: [
      { value: 'name', label: 'Name' },
      { value: 'email', label: 'Email' },
      { value: 'company', label: 'Company' },
      { value: 'status', label: 'Status' },
      { value: 'tags', label: 'Tags' },
      { value: 'createdAt', label: 'Created Date' },
      { value: 'lastContact', label: 'Last Contact' }
    ],
    deals: [
      { value: 'title', label: 'Title' },
      { value: 'stage', label: 'Stage' },
      { value: 'value', label: 'Value' },
      { value: 'probability', label: 'Probability' },
      { value: 'expectedClose', label: 'Expected Close' },
      { value: 'createdAt', label: 'Created Date' }
    ]
  };

  const statusOptions = {
    contacts: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' }
    ],
    deals: [
      { value: 'lead', label: 'Lead' },
      { value: 'qualified', label: 'Qualified' },
      { value: 'proposal', label: 'Proposal' },
      { value: 'negotiation', label: 'Negotiation' },
      { value: 'closed', label: 'Closed' }
    ]
  };

  const tagOptions = {
    contacts: [
      { value: 'prospect', label: 'Prospect' },
      { value: 'client', label: 'Client' },
      { value: 'lead', label: 'Lead' },
      { value: 'technology', label: 'Technology' },
      { value: 'software', label: 'Software' },
      { value: 'enterprise', label: 'Enterprise' },
      { value: 'startup', label: 'Startup' },
      { value: 'consulting', label: 'Consulting' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'fintech', label: 'FinTech' },
      { value: 'healthcare', label: 'Healthcare' }
    ],
    deals: []
  };

  useEffect(() => {
    if (isOpen) {
      loadSavedFilters();
      if (currentFilters.length > 0) {
        setCriteria(currentFilters);
      }
    }
  }, [isOpen, currentFilters]);

  const loadSavedFilters = async () => {
    try {
      const filters = await filterService.getAll();
      setSavedFilters(filters.filter(f => f.type === filterType));
    } catch (error) {
      toast.error('Failed to load saved filters');
    }
  };

  const addCriterion = () => {
    const newCriterion = {
      id: Date.now(),
      field: '',
      operator: 'equals',
      value: ''
    };
    setCriteria([...criteria, newCriterion]);
  };

  const updateCriterion = (id, updates) => {
    setCriteria(criteria.map(c => 
      c.id === id ? { ...c, ...updates } : c
    ));
  };

  const removeCriterion = (id) => {
    setCriteria(criteria.filter(c => c.id !== id));
  };

  const handleApplyFilter = () => {
    const validCriteria = criteria.filter(c => 
      c.field && c.operator && c.value
    );
    onApplyFilter(validCriteria);
    onClose();
  };

  const handleSaveFilter = async () => {
    if (!filterName.trim()) {
      toast.error('Please enter a filter name');
      return;
    }

    const validCriteria = criteria.filter(c => 
      c.field && c.operator && c.value
    );

    if (validCriteria.length === 0) {
      toast.error('Please add at least one filter criterion');
      return;
    }

    try {
      setLoading(true);
      const filterData = {
        name: filterName.trim(),
        type: filterType,
        criteria: validCriteria
      };

      await filterService.create(filterData);
      toast.success('Filter saved successfully');
      setFilterName('');
      setShowSaveForm(false);
      loadSavedFilters();
    } catch (error) {
      toast.error('Failed to save filter');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSavedFilter = (filter) => {
    setCriteria(filter.criteria);
    setSelectedSavedFilter(filter);
    setFilterName(filter.name);
  };

  const handleDeleteSavedFilter = async (filterId) => {
    if (!window.confirm('Are you sure you want to delete this saved filter?')) {
      return;
    }

    try {
      await filterService.delete(filterId);
      toast.success('Filter deleted successfully');
      loadSavedFilters();
      if (selectedSavedFilter?.Id === filterId) {
        setSelectedSavedFilter(null);
      }
    } catch (error) {
      toast.error('Failed to delete filter');
    }
  };

  const clearAllFilters = () => {
    setCriteria([]);
    setSelectedSavedFilter(null);
    setFilterName('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Advanced Filter Builder - {filterType === 'contacts' ? 'Contacts' : 'Deals'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ApperIcon name="X" size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Saved Filters Section */}
          {savedFilters.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Saved Filters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {savedFilters.map((filter) => (
                  <div
                    key={filter.Id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedSavedFilter?.Id === filter.Id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    onClick={() => handleLoadSavedFilter(filter)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        {filter.name}
                      </span>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-500">
                          {filter.criteria.length} rules
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSavedFilter(filter.Id);
                          }}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <ApperIcon name="Trash2" size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Filter Criteria */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">Filter Criteria</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  icon="X"
                >
                  Clear All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addCriterion}
                  icon="Plus"
                >
                  Add Criterion
                </Button>
              </div>
            </div>

            {criteria.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ApperIcon name="Filter" size={48} className="mx-auto mb-2 text-gray-300" />
                <p>No filter criteria added yet</p>
                <p className="text-sm">Click "Add Criterion" to start building your filter</p>
              </div>
            ) : (
              <div className="space-y-3">
                {criteria.map((criterion, index) => (
                  <FilterCriterion
                    key={criterion.id}
                    criterion={criterion}
                    availableFields={availableFields[filterType]}
                    statusOptions={statusOptions[filterType]}
                    tagOptions={tagOptions[filterType]}
                    onUpdate={(updates) => updateCriterion(criterion.id, updates)}
                    onRemove={() => removeCriterion(criterion.id)}
                    showLogicalOperator={index > 0}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Save Filter Form */}
          {showSaveForm && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Save Filter</h3>
              <FormField
                type="text"
                name="filterName"
                label="Filter Name"
                value={filterName}
                onChange={(name, value) => setFilterName(value)}
                placeholder="Enter a name for this filter"
                required
              />
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleSaveFilter}
                  loading={loading}
                  disabled={!filterName.trim()}
                >
                  Save Filter
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowSaveForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {!showSaveForm && criteria.length > 0 && (
              <Button
                variant="outline"
                onClick={() => setShowSaveForm(true)}
                icon="Save"
              >
                Save Filter
              </Button>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApplyFilter}
              disabled={criteria.length === 0}
            >
              Apply Filter
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FilterBuilder;