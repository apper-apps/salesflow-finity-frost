import { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { format } from 'date-fns';

const DealsPipeline = ({ 
  deals = [], 
  onDealMove, 
  onDealEdit, 
  onDealDelete,
  loading = false,
  className = '' 
}) => {
  const [draggedDeal, setDraggedDeal] = useState(null);
  const [dragOverStage, setDragOverStage] = useState(null);

  const stages = [
    { id: 'lead', name: 'Lead', color: 'lead' },
    { id: 'qualified', name: 'Qualified', color: 'qualified' },
    { id: 'proposal', name: 'Proposal', color: 'proposal' },
    { id: 'negotiation', name: 'Negotiation', color: 'negotiation' },
    { id: 'closed', name: 'Closed Won', color: 'closed' },
  ];

  const getDealsByStage = (stage) => {
    return deals.filter(deal => deal.stage === stage);
  };

  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e, stage) => {
    e.preventDefault();
    setDragOverStage(stage);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOverStage(null);
  };

  const handleDrop = (e, stage) => {
    e.preventDefault();
    setDragOverStage(null);
    
    if (draggedDeal && draggedDeal.stage !== stage) {
      onDealMove?.(draggedDeal.Id, stage);
    }
    
    setDraggedDeal(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const DealCard = ({ deal, isDragging }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      draggable
      onDragStart={(e) => handleDragStart(e, deal)}
      className={`deal-card ${isDragging ? 'dragging' : ''}`}
    >
      <Card className="mb-3 cursor-move">
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <h4 className="font-medium text-gray-900 text-sm">{deal.title}</h4>
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                icon="Edit"
                onClick={() => onDealEdit?.(deal)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <Button
                variant="outline"
                size="sm"
                icon="Trash2"
                onClick={() => onDealDelete?.(deal.Id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">
                {formatCurrency(deal.value)}
              </span>
              <Badge variant="info" size="sm">
                {deal.probability}%
              </Badge>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
              {format(new Date(deal.expectedClose), 'MMM d, yyyy')}
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <ApperIcon name="User" className="w-4 h-4 mr-1" />
              Contact ID: {deal.contactId}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 ${className}`}>
        {stages.map((stage) => (
          <div key={stage.id} className="space-y-4">
            <div className="skeleton h-8 w-24"></div>
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="skeleton h-32 w-full rounded-lg"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 ${className}`}>
      {stages.map((stage) => {
        const stageDeals = getDealsByStage(stage.id);
        const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
        const isDragOver = dragOverStage === stage.id;
        
        return (
          <div
            key={stage.id}
            className={`min-h-[500px] ${isDragOver ? 'drag-over' : ''}`}
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, stage.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, stage.id)}
          >
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                <Badge variant={stage.color} size="sm">
                  {stageDeals.length}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                {formatCurrency(stageValue)}
              </p>
            </div>
            
            <div className="space-y-3">
              {stageDeals.map((deal) => (
                <DealCard
                  key={deal.Id}
                  deal={deal}
                  isDragging={draggedDeal?.Id === deal.Id}
                />
              ))}
              
              {stageDeals.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <ApperIcon name="Plus" className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No deals in this stage</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DealsPipeline;