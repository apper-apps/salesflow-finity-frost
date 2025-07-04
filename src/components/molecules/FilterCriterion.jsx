import { useState } from 'react';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const FilterCriterion = ({
  criterion,
  availableFields,
  statusOptions,
  tagOptions,
  onUpdate,
  onRemove,
  showLogicalOperator = false
}) => {
  const [logicalOperator, setLogicalOperator] = useState('and');

  const operatorOptions = {
    text: [
      { value: 'equals', label: 'Equals' },
      { value: 'contains', label: 'Contains' },
      { value: 'startsWith', label: 'Starts with' },
      { value: 'endsWith', label: 'Ends with' },
      { value: 'notEquals', label: 'Not equals' }
    ],
    number: [
      { value: 'equals', label: 'Equals' },
      { value: 'greaterThan', label: 'Greater than' },
      { value: 'lessThan', label: 'Less than' },
      { value: 'greaterThanOrEqual', label: 'Greater than or equal' },
      { value: 'lessThanOrEqual', label: 'Less than or equal' },
      { value: 'notEquals', label: 'Not equals' }
    ],
    date: [
      { value: 'equals', label: 'On date' },
      { value: 'before', label: 'Before' },
      { value: 'after', label: 'After' },
      { value: 'between', label: 'Between' }
    ],
    select: [
      { value: 'equals', label: 'Is' },
      { value: 'notEquals', label: 'Is not' },
      { value: 'in', label: 'Is one of' }
    ]
  };

  const getFieldType = (fieldName) => {
    const dateFields = ['createdAt', 'lastContact', 'expectedClose'];
    const numberFields = ['value', 'probability'];
    const selectFields = ['status', 'stage'];
    const multiSelectFields = ['tags'];

    if (dateFields.includes(fieldName)) return 'date';
    if (numberFields.includes(fieldName)) return 'number';
    if (selectFields.includes(fieldName)) return 'select';
    if (multiSelectFields.includes(fieldName)) return 'multiselect';
    return 'text';
  };

  const getOperatorOptions = (fieldName) => {
    const fieldType = getFieldType(fieldName);
    if (fieldType === 'multiselect') return operatorOptions.select;
    return operatorOptions[fieldType] || operatorOptions.text;
  };

  const getValueOptions = (fieldName) => {
    if (fieldName === 'status') return statusOptions;
    if (fieldName === 'tags') return tagOptions;
    if (fieldName === 'stage') return statusOptions;
    return [];
  };

  const renderValueInput = () => {
    const fieldType = getFieldType(criterion.field);
    const valueOptions = getValueOptions(criterion.field);

    if (fieldType === 'date') {
      return (
        <FormField
          type="date"
          name="value"
          value={criterion.value}
          onChange={(name, value) => onUpdate({ value })}
        />
      );
    }

    if (fieldType === 'number') {
      return (
        <FormField
          type="number"
          name="value"
          value={criterion.value}
          onChange={(name, value) => onUpdate({ value })}
          placeholder="Enter value"
        />
      );
    }

    if (fieldType === 'select' || fieldType === 'multiselect') {
      return (
        <FormField
          type="select"
          name="value"
          value={criterion.value}
          onChange={(name, value) => onUpdate({ value })}
          options={valueOptions}
          multiple={fieldType === 'multiselect'}
        />
      );
    }

    return (
      <FormField
        type="text"
        name="value"
        value={criterion.value}
        onChange={(name, value) => onUpdate({ value })}
        placeholder="Enter value"
      />
    );
  };

  return (
    <div className="border rounded-lg p-4 bg-white">
      {showLogicalOperator && (
        <div className="flex items-center mb-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setLogicalOperator('and')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                logicalOperator === 'and'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              AND
            </button>
            <button
              onClick={() => setLogicalOperator('or')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                logicalOperator === 'or'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              OR
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <FormField
            type="select"
            name="field"
            label="Field"
            value={criterion.field}
            onChange={(name, value) => onUpdate({ field: value, operator: 'equals', value: '' })}
            options={availableFields}
            placeholder="Select field"
          />
        </div>

        <div>
          <FormField
            type="select"
            name="operator"
            label="Operator"
            value={criterion.operator}
            onChange={(name, value) => onUpdate({ operator: value })}
            options={getOperatorOptions(criterion.field)}
            disabled={!criterion.field}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
          {criterion.field ? renderValueInput() : (
            <FormField
              type="text"
              name="value"
              value=""
              disabled
              placeholder="Select field first"
            />
          )}
        </div>

        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={onRemove}
            icon="Trash2"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterCriterion;