import { render, screen, fireEvent } from '@testing-library/react';
import { TasksList } from './TasksList';
import { expect, test, describe, vi, beforeEach } from 'vitest';
import { useGetTasksByProjectId } from '../../hooks/tasks/useGetTasksByProjectId';
import { useDeleteTask } from '../../hooks/tasks/useDeleteTask';
import { Task } from '../../types/task';
import { MemoryRouter, Route, Routes } from 'react-router';

const mockMutateAsync = vi.fn();
vi.mock('../../hooks/tasks/useDeleteTask', () => ({
  useDeleteTask: vi.fn().mockReturnValue({ isPending: false, mutateAsync: vi.fn() }),
}));
vi.mock('../../hooks/tasks/useGetTasksByProjectId');
const useGetTasksByProjectIdMock = vi.mocked(useGetTasksByProjectId);
const useDeleteTaskMock = vi.mocked(useDeleteTask);

beforeEach(() => {
  vi.clearAllMocks();
  mockMutateAsync.mockResolvedValue(undefined);
  useDeleteTaskMock.mockReturnValue({
    isPending: false,
    mutateAsync: mockMutateAsync,
  } as unknown as ReturnType<typeof useDeleteTask>);
});

const tasksMock: Task[] = [
  { id: '1', title: 'Task 1', completed: false, created_at: '2024-01-01T10:00:00Z' },
  { id: '2', title: 'Task 2', completed: true, created_at: '2024-02-15T14:30:00Z' },
];

const renderWithRouter = (ui: React.ReactElement) => {
  return render(
    <MemoryRouter initialEntries={['/projects/proj-1']}>
      <Routes>
        <Route path="/projects/:id" element={ui} />
      </Routes>
    </MemoryRouter>,
  );
};

describe('TasksList', () => {
  test('renders task titles and completed status', () => {
    useGetTasksByProjectIdMock.mockReturnValue({
      data: tasksMock,
      isError: false,
      isLoading: false,
    } as ReturnType<typeof useGetTasksByProjectId>);
    renderWithRouter(<TasksList />);
    expect(screen.getByText('Task 1')).toBeDefined();
    expect(screen.getByText('Task 2')).toBeDefined();
    expect(screen.getByText('No')).toBeDefined();
    expect(screen.getByText('Yes')).toBeDefined();
  });

  test('renders error message on fetch failure', () => {
    useGetTasksByProjectIdMock.mockReturnValue({
      data: undefined,
      isError: true,
      isLoading: false,
    } as ReturnType<typeof useGetTasksByProjectId>);
    renderWithRouter(<TasksList />);
    expect(screen.getByText('An error occurred while fetching tasks.')).toBeDefined();
  });

  test('renders loading spinner when loading', () => {
    useGetTasksByProjectIdMock.mockReturnValue({
      data: undefined,
      isError: false,
      isLoading: true,
    } as ReturnType<typeof useGetTasksByProjectId>);
    renderWithRouter(<TasksList />);
    expect(screen.getByRole('progressbar')).toBeDefined();
  });

  test('renders empty state when no tasks exist', () => {
    useGetTasksByProjectIdMock.mockReturnValue({
      data: [] as Task[],
      isError: false,
      isLoading: false,
    } as ReturnType<typeof useGetTasksByProjectId>);
    renderWithRouter(<TasksList />);
    expect(screen.getByText(/No tasks yet/)).toBeDefined();
  });

  test('disables edit and delete buttons for completed tasks', () => {
    useGetTasksByProjectIdMock.mockReturnValue({
      data: tasksMock,
      isError: false,
      isLoading: false,
    } as ReturnType<typeof useGetTasksByProjectId>);
    renderWithRouter(<TasksList />);
    const editTask2 = screen.getByLabelText('Edit task Task 2');
    const deleteTask2 = screen.getByLabelText('Delete task Task 2');
    expect(editTask2).toHaveProperty('disabled', true);
    expect(deleteTask2).toHaveProperty('disabled', true);
  });

  test('enables edit and delete buttons for incomplete tasks', () => {
    useGetTasksByProjectIdMock.mockReturnValue({
      data: tasksMock,
      isError: false,
      isLoading: false,
    } as ReturnType<typeof useGetTasksByProjectId>);
    renderWithRouter(<TasksList />);
    const editTask1 = screen.getByLabelText('Edit task Task 1');
    const deleteTask1 = screen.getByLabelText('Delete task Task 1');
    expect(editTask1).toHaveProperty('disabled', false);
    expect(deleteTask1).toHaveProperty('disabled', false);
  });

  test('shows confirm dialog when delete button is clicked', () => {
    useGetTasksByProjectIdMock.mockReturnValue({
      data: tasksMock,
      isError: false,
      isLoading: false,
    } as ReturnType<typeof useGetTasksByProjectId>);
    renderWithRouter(<TasksList />);
    const deleteButton = screen.getByLabelText('Delete task Task 1');
    fireEvent.click(deleteButton);
    expect(
      screen.getByText('Are you sure you want to delete this task? This action cannot be undone.'),
    ).toBeDefined();
  });
});
