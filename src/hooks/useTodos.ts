import { useState, useEffect } from 'react';
import { Todo, Goal } from '../types';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos');
    if (saved) {
      const parsed = JSON.parse(saved);
      // order 필드가 없는 기존 데이터에 order 추가
      return parsed.map((todo: Todo, index: number) => ({
        ...todo,
        order: todo.order ?? index
      }));
    }
    return [];
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('goals');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: '개인', color: '#EF4444', icon: 'ri-user-line' },
      { id: '2', title: '그룹1', color: '#F59E0B', icon: 'ri-team-line' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  const addTodo = (goalId: string, title: string, parentId?: string) => {
    const maxOrder = todos
      .filter(t => t.parentId === parentId)
      .reduce((max, t) => Math.max(max, t.order), -1);
    
    const newTodo: Todo = {
      id: Date.now().toString(),
      goalId,
      title,
      completed: false,
      createdAt: new Date(),
      parentId,
      order: maxOrder + 1
    };
    setTodos([...todos, newTodo]);
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    // 하위 할일도 함께 삭제
    const deleteWithSubtasks = (todoId: string): string[] => {
      const subtaskIds = todos.filter(t => t.parentId === todoId).map(t => t.id);
      const allIds = [todoId];
      subtaskIds.forEach(subId => {
        allIds.push(...deleteWithSubtasks(subId));
      });
      return allIds;
    };
    
    const idsToDelete = deleteWithSubtasks(id);
    setTodos(todos.filter(todo => !idsToDelete.includes(todo.id)));
  };

  const updateTodo = (id: string, title: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, title } : todo
    ));
  };

  const reorderTodos = (reorderedTodos: Todo[]) => {
    setTodos(reorderedTodos);
  };

  const addGoal = (title: string, color: string, icon: string) => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      title,
      color,
      icon
    };
    setGoals([...goals, newGoal]);
  };

  const updateGoal = (id: string, title: string, color: string, icon: string) => {
    setGoals(goals.map(goal =>
      goal.id === id ? { ...goal, title, color, icon } : goal
    ));
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
    setTodos(todos.filter(todo => todo.goalId !== id));
  };

  return {
    todos,
    goals,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    reorderTodos,
    addGoal,
    updateGoal,
    deleteGoal
  };
}
