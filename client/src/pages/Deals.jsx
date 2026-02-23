import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import DealBoard from '../components/DealBoard';
import DealModal from '../components/DealModal';
import api from '../services/api';
import { Plus } from 'lucide-react';

export default function Deals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);

  const fetchDeals = async () => {
    try {
      const res = await api.get('/deals');
      setDeals(res.data);
    } catch (err) {
      console.error('Error fetching deals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const handleDealUpdate = async (dealId, newStage) => {
    // Optimistic Update
    const originalDeals = [...deals];
    setDeals(prev => prev.map(d => d._id === dealId ? { ...d, stage: newStage } : d));

    try {
      await api.put(`/deals/${dealId}`, { stage: newStage });
    } catch (err) {
      console.error('Failed to update deal stage:', err);
      setDeals(originalDeals); // Revert
      alert('Failed to move deal');
    }
  };

  const handleEditDeal = (deal) => {
    setSelectedDeal(deal);
    setIsModalOpen(true);
  };

  const handleNewDeal = () => {
    setSelectedDeal(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedDeal(null);
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Deals Pipeline</h1>
        <button 
          onClick={handleNewDeal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          New Deal
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
           <div className="w-8 h-8 border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
        </div>
      ) : (
        <DealBoard 
          deals={deals} 
          onDealUpdate={handleDealUpdate} 
          onDealClick={handleEditDeal} 
        />
      )}

      <DealModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
        dealToEdit={selectedDeal}
        onDealUpdated={fetchDeals}
      />
    </Layout>
  );
}
