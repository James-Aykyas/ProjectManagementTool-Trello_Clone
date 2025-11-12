import React from 'react';
import { Board } from '../../lib/supabase';
import { Calendar, Users } from 'lucide-react';
import { format } from 'date-fns';

interface BoardCardProps {
  board: Board;
  onClick: () => void;
}

export const BoardCard: React.FC<BoardCardProps> = ({ board, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group relative bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02]"
    >
      <div 
        className="absolute inset-0 rounded-xl opacity-10 group-hover:opacity-20 transition-opacity"
        style={{ backgroundColor: board.background_color }}
      />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {board.title}
          </h3>
          <div 
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: board.background_color }}
          />
        </div>

        {board.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {board.description}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>Created {format(new Date(board.created_at), 'MMM d')}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-3 w-3" />
            <span>1 member</span>
          </div>
        </div>
      </div>
    </div>
  );
};