import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ActivityTimeline from '../components/ActivityTimeline';
import api from '../services/api';
import { ArrowLeft, User, Mail, Phone, Building, MapPin, Globe, Linkedin, Clock, Tag } from 'lucide-react';

export default function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const res = await api.get(`/leads/${id}`);
        setLead(res.data);
      } catch (err) {
        console.error('Error fetching lead:', err);
        // navigate('/leads'); // Redirect if not found
      } finally {
        setLoading(false);
      }
    };
    fetchLead();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Loading lead details...</p>
        </div>
      </Layout>
    );
  }

  if (!lead) {
    return (
      <Layout>
        <div className="text-center py-10">
          <p className="text-gray-500">Lead not found.</p>
          <button onClick={() => navigate('/leads')} className="text-blue-600 hover:underline mt-2">
            Back to Leads
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
        <button 
          onClick={() => navigate('/leads')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-4"
        >
          <ArrowLeft size={18} /> Back to Leads
        </button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-gray-800">{lead.name}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                    lead.status === 'new' ? 'bg-blue-100 text-blue-700' :
                    lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                    lead.status === 'qualified' ? 'bg-purple-100 text-purple-700' :
                    lead.status === 'converted' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {lead.status}
                </span>
              </div>
              <p className="text-gray-500 flex items-center gap-2">
                <Building size={16} /> {lead.company}
              </p>
           </div>
           
           <div className="flex items-center gap-4">
              <a href={`mailto:${lead.email}`} className="p-2 bg-gray-50 rounded-full text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-colors">
                 <Mail size={20} />
              </a>
              <a href={`tel:${lead.phone}`} className="p-2 bg-gray-50 rounded-full text-gray-600 hover:bg-gray-100 hover:text-green-600 transition-colors">
                 <Phone size={20} />
              </a>
               <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                 Edit Lead
               </button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">Lead Information</h3>
              
              <div className="space-y-4">
                  <div className="flex items-start gap-3">
                     <Mail size={18} className="text-gray-400 mt-0.5" />
                     <div>
                        <p className="text-xs text-gray-500 uppercase">Email</p>
                        <p className="text-gray-700">{lead.email}</p>
                     </div>
                  </div>
                  <div className="flex items-start gap-3">
                     <Phone size={18} className="text-gray-400 mt-0.5" />
                     <div>
                        <p className="text-xs text-gray-500 uppercase">Phone</p>
                        <p className="text-gray-700">{lead.phone}</p>
                     </div>
                  </div>
                   <div className="flex items-start gap-3">
                     <Globe size={18} className="text-gray-400 mt-0.5" />
                     <div>
                        <p className="text-xs text-gray-500 uppercase">Source</p>
                        <p className="text-gray-700 capitalize">{lead.source?.replace('_', ' ')}</p>
                     </div>
                  </div>
                   <div className="flex items-start gap-3">
                     <User size={18} className="text-gray-400 mt-0.5" />
                     <div>
                        <p className="text-xs text-gray-500 uppercase">Owner</p>
                        <p className="text-gray-700">{lead.assignedTo?.name || 'Unassigned'}</p>
                     </div>
                  </div>
                  <div className="flex items-start gap-3">
                     <Clock size={18} className="text-gray-400 mt-0.5" />
                     <div>
                        <p className="text-xs text-gray-500 uppercase">Created</p>
                        <p className="text-gray-700">{new Date(lead.createdAt).toLocaleDateString()}</p>
                     </div>
                  </div>
              </div>
           </div>
           
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">Tags</h3>
               <div className="flex flex-wrap gap-2">
                 {lead.tags?.length > 0 ? (
                    lead.tags.map((tag, index) => (
                         <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                            <Tag size={12} /> {tag}
                        </span>
                    ))
                 ) : (
                    <p className="text-gray-400 text-sm">No tags added.</p>
                 )}
               </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">Notes</h3>
              <p className="text-gray-600 text-sm whitespace-pre-wrap">
                {lead.notes || 'No notes available.'}
              </p>
            </div>
        </div>

        {/* Right Column: Activity Timeline */}
        <div className="lg:col-span-2">
           <ActivityTimeline relatedModel="Lead" relatedId={id} />
        </div>
      </div>
    </Layout>
  );
}
