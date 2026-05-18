import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectsList } from './ProjectsList';
import { expect, test, describe, vi, beforeEach } from 'vitest';
import { useGetAllProjects } from '../../hooks/projects/useGetAllProjects';
import { Project } from '../../types/project';
import { MemoryRouter } from 'react-router';

const mockMutateAsync = vi.fn();
vi.mock('../../hooks/projects/useDeleteProject', () => ({
  useDeleteProject: () => ({ isPending: false, mutateAsync: mockMutateAsync }),
}));
vi.mock('../../hooks/projects/useGetAllProjects');
const useGetAllProjectsMock = vi.mocked(useGetAllProjects);

beforeEach(() => {
  vi.clearAllMocks();
  mockMutateAsync.mockResolvedValue(undefined);
});

const projectsMock: Project[] = [
  {
    id: '1',
    name: 'Project 1',
    tasks: [{ id: '1', created_at: '2024-01-01T10:00:00Z', completed: false, title: 'task1' }],
    created_at: '2024-01-01T10:00:00Z',
  },
  { id: '3', name: 'Project 3', tasks: [], created_at: '2024-03-20T09:15:00Z' },
];

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('ProjectsList', () => {
  test('renders project names and task counts', () => {
    useGetAllProjectsMock.mockReturnValue({
      data: projectsMock,
      isError: false,
      isLoading: false,
    } as ReturnType<typeof useGetAllProjects>);
    renderWithRouter(<ProjectsList />);
    expect(screen.getByText('Project 1')).toBeDefined();
    expect(screen.getByText('Project 3')).toBeDefined();
    expect(screen.getByText('1')).toBeDefined(); // task count for Project 1
    expect(screen.getByText('0')).toBeDefined(); // task count for Project 3
  });

  test('renders error message on fetch failure', () => {
    useGetAllProjectsMock.mockReturnValue({
      data: undefined,
      isError: true,
      isLoading: false,
    } as ReturnType<typeof useGetAllProjects>);
    renderWithRouter(<ProjectsList />);
    expect(screen.getByText('An error occurred while fetching projects.')).toBeDefined();
  });

  test('renders loading spinner when loading', () => {
    useGetAllProjectsMock.mockReturnValue({
      data: undefined,
      isError: false,
      isLoading: true,
    } as ReturnType<typeof useGetAllProjects>);
    renderWithRouter(<ProjectsList />);
    expect(screen.getByRole('progressbar')).toBeDefined();
  });

  test('renders empty state when no projects exist', () => {
    useGetAllProjectsMock.mockReturnValue({
      data: [] as Project[],
      isError: false,
      isLoading: false,
    } as ReturnType<typeof useGetAllProjects>);
    renderWithRouter(<ProjectsList />);
    expect(screen.getByText(/No projects yet/)).toBeDefined();
  });

  test('renders edit and delete buttons for each project', () => {
    useGetAllProjectsMock.mockReturnValue({
      data: projectsMock,
      isError: false,
      isLoading: false,
    } as ReturnType<typeof useGetAllProjects>);
    renderWithRouter(<ProjectsList />);
    const editButtons = screen.getAllByLabelText(/Edit project/);
    const deleteButtons = screen.getAllByLabelText(/Delete project/);
    expect(editButtons).toHaveLength(2);
    expect(deleteButtons).toHaveLength(2);
  });

  test('shows confirm dialog when delete button is clicked', () => {
    useGetAllProjectsMock.mockReturnValue({
      data: projectsMock,
      isError: false,
      isLoading: false,
    } as ReturnType<typeof useGetAllProjects>);
    renderWithRouter(<ProjectsList />);
    const deleteButtons = screen.getAllByLabelText(/Delete project/);
    fireEvent.click(deleteButtons[0]);
    expect(screen.getByText('Are you sure you want to delete this project? This action cannot be undone.')).toBeDefined();
  });

  test('project names are rendered as links with correct hrefs', () => {
    useGetAllProjectsMock.mockReturnValue({
      data: projectsMock,
      isError: false,
      isLoading: false,
    } as ReturnType<typeof useGetAllProjects>);
    renderWithRouter(<ProjectsList />);
    const link = screen.getByText('Project 1').closest('a');
    expect(link).toBeDefined();
    expect(link?.getAttribute('href')).toBe('/projects/1');
  });
});
