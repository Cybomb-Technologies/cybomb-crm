import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { DollarSign, Calendar, Building, User } from 'lucide-react';
import api from '../services/api';

const columns = [
  { id: 'Discovery', title: 'Discovery', color: 'border-blue-500' },
  { id: 'Demo', title: 'Demo', color: 'border-purple-500' },
  { id: 'Proposal', title: 'Proposal', color: 'border-yellow-500' },
  { id: 'Negotiation', title: 'Negotiation', color: 'border-orange-500' },
  { id: 'Closed Won', title: 'Closed Won', color: 'border-green-500' },
  { id: 'Closed Lost', title: 'Closed Lost', color: 'border-red-500' }
];

export default function DealBoard({ deals, onDealUpdate, onDealClick }) {

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      // Create a copy of the deal to pass back for optimistic update or API call
      const updatedDeal = deals.find(d => d._id === draggableId);
      if (updatedDeal) {
          onDealUpdate(draggableId, destination.droppableId);
      }
    }
  };

  const getStageTotal = (stage) => {
    return deals
      .filter(d => d.stage === stage)
      .reduce((sum, d) => sum + d.value, 0);
  };


  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 h-[calc(100vh-140px)] overflow-y-auto">
        {columns.map(column => (
          <div key={column.id} className="flex flex-col h-full min-h-[400px] bg-gray-50/50 rounded-xl border border-gray-200">
            <div className={`p-3 border-t-4 ${column.color} bg-white rounded-t-xl`}>
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-semibold text-gray-700">{column.title}</h3>
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-medium">
                  {deals.filter(d => d.stage === column.id).length}
                </span>
              </div>
              <div className="text-xs text-gray-500 font-medium">
                ${getStageTotal(column.id).toLocaleString()}
              </div>
            </div>

            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`flex-1 p-2 overflow-y-auto ${snapshot.isDraggingOver ? 'bg-blue-50/50' : ''}`}
                >
                  {deals
                    .filter(deal => deal.stage === column.id)
                    .map((deal, index) => (
                      <Draggable key={deal._id} draggableId={deal._id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => onDealClick(deal)}
                            className={`bg-white p-3 mb-3 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow group cursor-pointer ${snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-500 rotate-2' : ''}`}
                            style={provided.draggableProps.style}
                          >
                            <h4 className="font-medium text-gray-900 mb-2">{deal.title}</h4>
                            
                            <div className="flex items-center text-gray-500 text-xs mb-2">
                                <Building size={12} className="mr-1" />
                                <span className="truncate">{deal.contactPerson?.company || 'No Company'}</span>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-2">
                                <div className="flex items-center text-gray-700 font-semibold text-sm">
                                    <DollarSign size={14} className="text-green-600" />
                                    {deal.value.toLocaleString()}
                                </div>
                                <div className="flex items-center text-gray-400 text-xs" title={`Close Date: ${new Date(deal.expectedCloseDate).toLocaleDateString()}`}>
                                    <Calendar size={12} className="mr-1" />
                                    {new Date(deal.expectedCloseDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </div>
                            </div>
         
                            {deal.assignedTo && (
                                <div className="mt-2 flex items-center justify-end">
                                     <div className="flex items-center text-xs text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                                        <User size={10} className="mr-1" />
                                        {deal.assignedTo.name}
                                     </div>
                                </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
