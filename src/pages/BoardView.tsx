import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { useAuth } from '../contexts/AuthContext';
import { Board, List, Task, supabase } from '../lib/supabase';
import { Header } from '../components/Layout/Header';
import { TaskList } from '../components/Board/TaskList';
import { TaskDetailModal } from '../components/Board/TaskDetailModal';
import { ArrowLeft, Plus, Search, Filter } from 'lucide-react';

interface BoardViewProps {
  boardId: string;
}

export const BoardView: React.FC<BoardViewProps> = ({ boardId }) => {
  const [board, setBoard] = useState<Board | null>(null);
  const [lists, setLists] = useState<List[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchBoardData();
  }, [boardId]);

  const fetchBoardData = async () => {
    try {
      // Fetch board
      const { data: boardData, error: boardError } = await supabase
        .from('boards')
        .select('*')
        .eq('id', boardId)
        .single();

      if (boardError) throw boardError;
      setBoard(boardData);

      // Fetch lists
      const { data: listsData, error: listsError } = await supabase
        .from('lists')
        .select('*')
        .eq('board_id', boardId)
        .order('position');

      if (listsError) throw listsError;
      setLists(listsData || []);

      // Fetch tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .in('list_id', (listsData || []).map(list => list.id))
        .order('position');

      if (tasksError) throw tasksError;
      setTasks(tasksData || []);
    } catch (error) {
      console.error('Error fetching board data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    if (type === 'list') {
      // Handle list reordering
      const newLists = Array.from(lists);
      const [removed] = newLists.splice(source.index, 1);
      newLists.splice(destination.index, 0, removed);

      // Update positions
      const updatedLists = newLists.map((list, index) => ({ ...list, position: index }));
      setLists(updatedLists);

      // Update database
      try {
        const updates = updatedLists.map(list => ({
          id: list.id,
          position: list.position,
        }));

        for (const update of updates) {
          await supabase.from('lists').update({ position: update.position }).eq('id', update.id);
        }
      } catch (error) {
        console.error('Error updating list positions:', error);
        setLists(lists); // Revert on error
      }
    } else {
      // Handle task reordering/moving
      const sourceList = lists.find(list => list.id === source.droppableId);
      const destinationList = lists.find(list => list.id === destination.droppableId);

      if (!sourceList || !destinationList) return;

      const sourceTasks = tasks.filter(task => task.list_id === source.droppableId);
      const destinationTasks = tasks.filter(task => task.list_id === destination.droppableId);

      const [movedTask] = sourceTasks.splice(source.index, 1);

      if (source.droppableId === destination.droppableId) {
        // Same list reordering
        sourceTasks.splice(destination.index, 0, movedTask);
        const updatedTasks = sourceTasks.map((task, index) => ({ ...task, position: index }));
        setTasks(tasks.filter(task => task.list_id !== source.droppableId).concat(updatedTasks));
      } else {
        // Moving between lists
        movedTask.list_id = destination.droppableId;
        destinationTasks.splice(destination.index, 0, movedTask);

        const updatedSourceTasks = sourceTasks.map((task, index) => ({ ...task, position: index }));
        const updatedDestinationTasks = destinationTasks.map((task, index) => ({ ...task, position: index }));

        setTasks(
          tasks
            .filter(task => task.list_id !== source.droppableId && task.list_id !== destination.droppableId)
            .concat(updatedSourceTasks)
            .concat(updatedDestinationTasks)
        );

        // Update database
        try {
          await supabase
            .from('tasks')
            .update({ list_id: destination.droppableId, position: destination.index })
            .eq('id', movedTask.id);
        } catch (error) {
          console.error('Error moving task:', error);
        }
      }
    }
  };

  const handleAddList = async () => {
    if (!newListTitle.trim()) return;

    try {
      const { data, error } = await supabase
        .from('lists')
        .insert({
          title: newListTitle,
          board_id: boardId,
          position: lists.length,
        })
        .select()
        .single();

      if (error) throw error;
      setLists([...lists, data]);
      setNewListTitle('');
      setIsAddingList(false);
    } catch (error) {
      console.error('Error creating list:', error);
    }
  };

  const handleAddTask = async (listId: string, title: string) => {
    try {
      const listTasks = tasks.filter(task => task.list_id === listId);
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title,
          list_id: listId,
          position: listTasks.length,
          created_by: user!.id,
        })
        .select()
        .single();

      if (error) throw error;
      setTasks([...tasks, data]);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId);

      if (error) throw error;

      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      ));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleDeleteList = async (listId: string) => {
    try {
      // Delete all tasks in the list first
      await supabase.from('tasks').delete().eq('list_id', listId);
      
      // Delete the list
      const { error } = await supabase.from('lists').delete().eq('id', listId);
      
      if (error) throw error;
      
      setLists(lists.filter(list => list.id !== listId));
      setTasks(tasks.filter(task => task.list_id !== listId));
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600">Board not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div 
        className="relative min-h-screen"
        style={{
          background: `linear-gradient(135deg, ${board.background_color}15 0%, ${board.background_color}08 100%)`
        }}
      >
        <div className="absolute inset-0 bg-white/90"></div>
        
        <div className="relative z-10">
          <div className="px-6 py-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => window.history.back()}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{board.title}</h1>
                  {board.description && (
                    <p className="text-sm text-gray-600">{board.description}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search tasks..."
                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/90"
                  />
                </div>
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <Filter className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 overflow-x-auto">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="board" type="list" direction="horizontal">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex space-x-4 pb-4"
                  >
                    {lists.map((list, index) => {
                      const listTasks = filteredTasks.filter(task => task.list_id === list.id);
                      return (
                        <TaskList
                          key={list.id}
                          list={list}
                          tasks={listTasks}
                          index={index}
                          onTaskClick={(task) => {
                            setSelectedTask(task);
                            setShowTaskModal(true);
                          }}
                          onAddTask={handleAddTask}
                          onDeleteList={handleDeleteList}
                        />
                      );
                    })}
                    {provided.placeholder}

                    {/* Add List Button */}
                    <div className="w-72 flex-shrink-0">
                      {isAddingList ? (
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                          <input
                            type="text"
                            value={newListTitle}
                            onChange={(e) => setNewListTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddList();
                              if (e.key === 'Escape') {
                                setIsAddingList(false);
                                setNewListTitle('');
                              }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
                            placeholder="Enter list title..."
                            autoFocus
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={handleAddList}
                              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                            >
                              Add List
                            </button>
                            <button
                              onClick={() => {
                                setIsAddingList(false);
                                setNewListTitle('');
                              }}
                              className="px-3 py-1 text-gray-600 text-sm rounded hover:bg-gray-100"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setIsAddingList(true)}
                          className="w-full bg-white/50 hover:bg-white/80 border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-lg p-4 text-gray-600 hover:text-gray-900 transition-all flex items-center justify-center space-x-2"
                        >
                          <Plus className="h-5 w-5" />
                          <span>Add a list</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      </div>

      <TaskDetailModal
        task={selectedTask}
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          setSelectedTask(null);
        }}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
      />
    </div>
  );
};