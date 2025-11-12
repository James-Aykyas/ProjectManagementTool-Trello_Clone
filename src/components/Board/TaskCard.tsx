import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Task } from '../../lib/supabase';
import { Calendar, User, MessageCircle, Paperclip } from 'lucide-react';
import { format, isAfter } from 'date-fns';

interface TaskCardProps {
  task: Task;
  index: number;
  onClick: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, index, onClick }) => {
  const isOverdue = task.due_date && isAfter(new Date(), new Date(task.due_date));

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 cursor-pointer hover:shadow-md transition-all duration-200 ${
            snapshot.isDragging ? 'rotate-3 shadow-lg' : ''
          }`}
        >
          {task.labels && task.labels.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {task.labels.map((label) => (
                <span
                  key={label}
                  className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                >
                  {label}
                </span>
              ))}
            </div>
          )}

          <h4 className="font-medium text-gray-900 mb-2 leading-snug">
            {task.title}
          </h4>

          {task.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {task.due_date && (
                <div className={`flex items-center space-x-1 text-xs ${
                  isOverdue ? 'text-red-600' : 'text-gray-500'
                }`}>
                  <Calendar className="h-3 w-3" />
                  <span>{format(new Date(task.due_date), 'MMM d')}</span>
                </div>
              )}

              {task.assignee_id && (
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <User className="h-3 w-3" />
                </div>
              )}
            </div>

            <div className="flex items-center space-x-1 text-xs text-gray-400">
              <MessageCircle className="h-3 w-3" />
              <span>0</span>
              <Paperclip className="h-3 w-3 ml-1" />
              <span>0</span>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};