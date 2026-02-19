import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ActivityTimeline from '../components/ActivityTimeline';
import api from '../services/api';
import { ArrowLeft, User, Mail, Phone, Building2, MapPin, Globe, DollarSign, Calendar, Clock } from 'lucide-react';

export default function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerAndDeals = async () => {
      try {
        const [customerRes, dealsRes] = await Promise.all([
          api.get(`/customers/${id}`),
          api.get('/deals') // Ideally filter by customer ID on backend
        ]);
        setCustomer(customerRes.data);
        // Filter deals client-side for now as backend doesn't support filtering by contactPerson yet
        const customerDeals = dealsRes.data.filter(d => d.contactPerson?._id === id || d.contactPerson === id);
        setDeals(customerDeals);
      } catch (err) {
        console.error('Error fetching customer details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomerAndDeals();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Loading customer details...</p>
        </div>
      </Layout>
    );
  }

  if (!customer) {
    return (
      <Layout>
        <div className="text-center py-10">
          <p className="text-gray-500">Customer not found.</p>
          <button onClick={() => navigate('/customers')} className="text-blue-600 hover:underline mt-2">
            Back to Customers
          </button>
        </div>
      </Layout>
    );
  }

  const totalValue = deals.reduce((sum, d) => sum + d.value, 0);

  return (
    <Layout>
      <div className="mb-6">
        <button 
          onClick={() => navigate('/customers')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-4"
        >
          <ArrowLeft size={18} /> Back to Customers
        </button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg font-bold shadow-sm">
                    {customer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{customer.name}</h1>
                    <p className="text-gray-500 flex items-center gap-2">
                        <Building2 size={16} /> {customer.company}
                    </p>
                </div>
              </div>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="text-right mr-4">
                  <p className="text-xs text-gray-500 uppercase">Total Value</p>
                  <p className="text-xl font-bold text-green-600">${totalValue.toLocaleString()}</p>
              </div>
              <a href={`mailto:${customer.email}`} className="p-2 bg-gray-50 rounded-full text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-colors">
                 <Mail size={20} />
              </a>
              <a href={`tel:${customer.phone}`} className="p-2 bg-gray-50 rounded-full text-gray-600 hover:bg-gray-100 hover:text-green-600 transition-colors">
                 <Phone size={20} />
              </a>
               <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                 Edit Customer
               </button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">Customer Information</h3>
              
              <div className="space-y-4">
                  <div className="flex items-start gap-3">
                     <Mail size={18} className="text-gray-400 mt-0.5" />
                     <div>
                        <p className="text-xs text-gray-500 uppercase">Email</p>
                        <p className="text-gray-700">{customer.email}</p>
                     </div>
                  </div>
                  <div className="flex items-start gap-3">
                     <Phone size={18} className="text-gray-400 mt-0.5" />
                     <div>
                        <p className="text-xs text-gray-500 uppercase">Phone</p>
                        <p className="text-gray-700">{customer.phone || 'N/A'}</p>
                     </div>
                  </div>
                   <div className="flex items-start gap-3">
                     <MapPin size={18} className="text-gray-400 mt-0.5" />
                     <div>
                        <p className="text-xs text-gray-500 uppercase">Address</p>
                        <p className="text-gray-700">
                            {customer.address?.street && <>{customer.address.street}<br/></>}
                            {customer.address?.city && <>{customer.address.city}, </>}
                            {customer.address?.state} {customer.address?.zip}
                            {customer.address?.country && <><br/>{customer.address.country}</>}
                        </p>
                        {(!customer.address?.city && !customer.address?.street) && <span className="text-gray-400">No address provided</span>}
                     </div>
                  </div>
                  <div className="flex items-start gap-3">
                     <Clock size={18} className="text-gray-400 mt-0.5" />
                     <div>
                        <p className="text-xs text-gray-500 uppercase">Customer Since</p>
                        <p className="text-gray-700">{new Date(customer.createdAt).toLocaleDateString()}</p>
                     </div>
                  </div>
              </div>
           </div>
           
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2 flex justify-between items-center">
                <span>Deals</span>
                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">{deals.length}</span>
              </h3>
               <div className="space-y-3">
                 {deals.length > 0 ? (
                    deals.map((deal) => (
                         <div key={deal._id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <h4 className="font-medium text-gray-800 text-sm">{deal.title}</h4>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-xs font-semibold text-green-600">${deal.value.toLocaleString()}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    deal.stage === 'Closed Won' ? 'bg-green-100 text-green-700' :
                                    deal.stage === 'Closed Lost' ? 'bg-red-100 text-red-700' :
                                    'bg-blue-50 text-blue-600'
                                }`}>
                                    {deal.stage}
                                </span>
                            </div>
                        </div>
                    ))
                 ) : (
                    <p className="text-gray-400 text-sm">No deals associated.</p>
                 )}
               </div>
            </div>
        </div>

        {/* Right Column: Activity Timeline */}
        <div className="lg:col-span-2">
           <ActivityTimeline relatedModel="Customer" relatedId={id} />
        </div>
      </div>
    </Layout>
  );
}
