import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { List, Task } from '../../lib/supabase';
import { TaskCard } from './TaskCard';
import { Plus, MoreHorizontal } from 'lucide-react';

interface TaskListProps {
  list: List;
  tasks: Task[];
  index: number;
  onTaskClick: (task: Task) => void;
  onAddTask: (listId: string, title: string) => void;
  onDeleteList: (listId: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  list,
  tasks,
  index,
  onTaskClick,
  onAddTask,
  onDeleteList,
}) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask(list.id, newTaskTitle);
      setNewTaskTitle('');
      setIsAddingTask(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    } else if (e.key === 'Escape') {
      setIsAddingTask(false);
      setNewTaskTitle('');
    }
  };

  return (
    <Draggable draggableId={list.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="bg-gray-50 rounded-lg p-4 w-72 flex-shrink-0"
        >
          <div
            {...provided.dragHandleProps}
            className="flex items-center justify-between mb-4"
          >
            <h3 className="font-semibold text-gray-900">{list.title}</h3>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                  <button
                    onClick={() => {
                      onDeleteList(list.id);
                      setShowMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Delete list
                  </button>
                </div>
              )}
            </div>
          </div>

          <Droppable droppableId={list.id} type="task">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`min-h-2 ${snapshot.isDraggingOver ? 'bg-blue-50 rounded-lg' : ''}`}
              >
                {tasks.map((task, index) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    index={index}
                    onClick={() => onTaskClick(task)}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {isAddingTask ? (
            <div className="mt-3">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={handleKeyPress}
                onBlur={() => {
                  if (!newTaskTitle.trim()) {
                    setIsAddingTask(false);
                  }
                }}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter task title..."
                autoFocus
              />
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={handleAddTask}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setIsAddingTask(false);
                    setNewTaskTitle('');
                  }}
                  className="px-3 py-1 text-gray-600 text-sm rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingTask(true)}
              className="flex items-center space-x-2 w-full text-left p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors mt-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add a task</span>
            </button>
          )}
        </div>
      )}
    </Draggable>
  );
};