import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import DealsPipeline from '@/components/organisms/DealsPipeline';
import DealModal from '@/components/organisms/DealModal';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import dealService from '@/services/api/dealService';
import contactService from '@/services/api/contactService';

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll()
      ]);
      setDeals(dealsData);
      setContacts(contactsData);
    } catch (err) {
      setError(err.message || 'Failed to load deals data');
      toast.error('Failed to load deals data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddDeal = () => {
    setSelectedDeal(null);
    setShowModal(true);
  };

  const handleEditDeal = (deal) => {
    setSelectedDeal(deal);
    setShowModal(true);
  };

  const handleDeleteDeal = async (dealId) => {
    if (!window.confirm('Are you sure you want to delete this deal?')) {
      return;
    }

    try {
      await dealService.delete(dealId);
      setDeals(prev => prev.filter(d => d.Id !== dealId));
      toast.success('Deal deleted successfully');
    } catch (err) {
      toast.error('Failed to delete deal');
    }
  };

  const handleDealMove = async (dealId, newStage) => {
    try {
      const updatedDeal = await dealService.updateStage(dealId, newStage);
      setDeals(prev => prev.map(d => 
        d.Id === dealId ? updatedDeal : d
      ));
      toast.success(`Deal moved to ${newStage}`);
    } catch (err) {
      toast.error('Failed to move deal');
    }
  };

  const handleSaveDeal = async (dealData) => {
    try {
      setModalLoading(true);
      
      let savedDeal;
      if (selectedDeal) {
        // Update existing deal
        savedDeal = await dealService.update(selectedDeal.Id, dealData);
        setDeals(prev => prev.map(d => 
          d.Id === selectedDeal.Id ? savedDeal : d
        ));
        toast.success('Deal updated successfully');
      } else {
        // Create new deal
        savedDeal = await dealService.create(dealData);
        setDeals(prev => [...prev, savedDeal]);
        toast.success('Deal created successfully');
      }
      
      setShowModal(false);
      setSelectedDeal(null);
    } catch (err) {
      toast.error('Failed to save deal');
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDeal(null);
  };

  const getTotalPipelineValue = () => {
    return deals.reduce((sum, deal) => sum + deal.value, 0);
  };

  const getWonDealsValue = () => {
    return deals
      .filter(deal => deal.stage === 'closed')
      .reduce((sum, deal) => sum + deal.value, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return <Loading type="pipeline" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deals Pipeline</h1>
          <p className="text-gray-600 mt-1">
            Track your sales opportunities through the pipeline
          </p>
        </div>
        <Button 
          icon="Plus" 
          onClick={handleAddDeal}
        >
          Add Deal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Pipeline</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(getTotalPipelineValue())}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">{deals.length}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Won Deals</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(getWonDealsValue())}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-success to-accent rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {deals.filter(d => d.stage === 'closed').length}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Win Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {deals.length > 0 
                  ? Math.round((deals.filter(d => d.stage === 'closed').length / deals.length) * 100)
                  : 0}%
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-info to-secondary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">📊</span>
            </div>
          </div>
        </div>
      </div>

      <DealsPipeline
        deals={deals}
        onDealMove={handleDealMove}
        onDealEdit={handleEditDeal}
        onDealDelete={handleDeleteDeal}
        loading={loading}
      />

      <DealModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSave={handleSaveDeal}
        deal={selectedDeal}
        contacts={contacts}
        loading={modalLoading}
      />
    </div>
  );
};

export default Deals;