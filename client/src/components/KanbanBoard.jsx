import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Link } from 'react-router-dom';
import api from '../services/api';

const columns = {
  new: { id: 'new', title: 'New', color: 'bg-blue-100 text-blue-800' },
  contacted: { id: 'contacted', title: 'Contacted', color: 'bg-yellow-100 text-yellow-800' },
  qualified: { id: 'qualified', title: 'Qualified', color: 'bg-purple-100 text-purple-800' },
  converted: { id: 'converted', title: 'Converted', color: 'bg-green-100 text-green-800' },
  lost: { id: 'lost', title: 'Lost', color: 'bg-gray-100 text-gray-800' }
};

export default function KanbanBoard({ leads, onLeadUpdate }) {
  const [boardData, setBoardData] = useState({});

  useEffect(() => {
    // Group leads by status
    const newBoardData = {
      new: [],
      contacted: [],
      qualified: [],
      converted: [],
      lost: []
    };

    leads.forEach(lead => {
      if (newBoardData[lead.status]) {
        newBoardData[lead.status].push(lead);
      }
    });

    setBoardData(newBoardData);
  }, [leads]);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Optimistic Update
    const startColumn = source.droppableId;
    const endColumn = destination.droppableId;

    const startList = Array.from(boardData[startColumn]);
    const endList = startColumn === endColumn ? startList : Array.from(boardData[endColumn]);
    
    const [movedLead] = startList.splice(source.index, 1);
    
    // Update local state first
    if (startColumn === endColumn) {
        startList.splice(destination.index, 0, movedLead);
        setBoardData({
            ...boardData,
            [startColumn]: startList
        });
    } else {
        const updatedLead = { ...movedLead, status: endColumn };
        endList.splice(destination.index, 0, updatedLead);
        setBoardData({
            ...boardData,
            [startColumn]: startList,
            [endColumn]: endList
        });

        // API Call
        try {
            await api.put(`/leads/${draggableId}`, { status: endColumn });
            if (onLeadUpdate) onLeadUpdate();
        } catch (err) {
            console.error('Error updating lead status:', err);
            // Revert on error (optional, or just alert)
            alert('Failed to update status');
        }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex overflow-x-auto gap-4 p-4 min-h-[calc(100vh-200px)]">
        {Object.values(columns).map(column => (
          <div key={column.id} className="min-w-[280px] bg-gray-50 rounded-xl p-3 flex flex-col">
            <div className={`flex items-center justify-between p-2 mb-3 rounded-lg ${column.color}`}>
              <h3 className="font-semibold">{column.title}</h3>
              <span className="text-sm font-medium bg-white/50 px-2 py-0.5 rounded-full">
                {boardData[column.id]?.length || 0}
              </span>
            </div>
            
            <Droppable droppableId={column.id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex-1 space-y-3"
                >
                  {boardData[column.id]?.map((lead, index) => (
                    <Draggable key={lead._id} draggableId={lead._id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`bg-white p-3 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-500 rotate-2' : ''}`}
                          style={provided.draggableProps.style}
                        >
                            <Link to={`/leads/${lead._id}`} className="font-medium text-gray-900 mb-1 hover:text-blue-600 hover:underline block">
                                {lead.name}
                            </Link>
                          <div className="text-sm text-gray-500 mb-2 truncate">{lead.company}</div>
                          <div className="flex flex-wrap gap-1">
                             {lead.tags?.slice(0, 2).map((tag, i) => (
                                <span key={i} className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded-full">{tag}</span>
                             ))}
                             {lead.tags?.length > 2 && <span className="text-[10px] text-gray-400">+{lead.tags.length - 2}</span>}
                          </div>
                   
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
