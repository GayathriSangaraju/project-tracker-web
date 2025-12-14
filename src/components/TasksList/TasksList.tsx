import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
} from '@tanstack/react-table';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { formatDate } from '../../utils/formatDate';
import { useGetTasksByProjectId } from '../../hooks/tasks/useGetTasksByProjectId';
import { useParams } from 'react-router';
import { Task } from '../../types/task';
import { useDeleteTask } from '../../hooks/tasks/useDeleteTask';
import { ModalContext, ModalType } from '../../contexts/ModalContextProvider';
import { useContext, useState } from 'react';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { ConfirmDialog } from '../ConfirmDialog/ConfirmDialog';

export const TasksList = () => {
  const params = useParams();
  const { toggleModal } = useContext(ModalContext);
  const projectId = params.id ?? '';
  const { data: projectTasks, isLoading, isError } = useGetTasksByProjectId(projectId);
  const columnHelper = createColumnHelper<Task>();

  const deleteTaskMutation = useDeleteTask(projectId);
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string>('');

  const handleDeleteTask = async () => {
    if (!deleteTargetId) return;
    await deleteTaskMutation.mutateAsync(deleteTargetId);
    setShowDeleteConfirmDialog(false);
    setDeleteTargetId('');
  };

  const handleEditTask = (taskId: string) => {
    toggleModal({
      type: ModalType.AddEditTaskModal,
      payload: {
        isEditMode: true,
        taskId: taskId,
      },
    });
  };

  const columns = [
    columnHelper.accessor('title', {
      cell: (info) => <div>{info.getValue()}</div>,
      footer: (info) => info.column.id,
      header: () => 'Title',
      maxSize: 300,
      minSize: 180,
      size: 220,
    }),
    columnHelper.accessor('completed', {
      cell: (info) => {
        return info.getValue() === true ? (
          <Chip label="Yes" color="success" size="small" />
        ) : (
          <Chip label="No" color="info" size="small" />
        );
      },
      footer: (info) => info.column.id,
      header: () => 'Completed',
      minSize: 80,
    }),
    columnHelper.accessor('created_at', {
      cell: (info) => formatDate(info.getValue()),
      footer: (info) => info.column.id,
      header: () => 'Created At',
      minSize: 400,
      size: 400,
    }),
    columnHelper.display({
      id: 'actions',
      cell: (info) => {
        return (
          <Stack direction="row" spacing={1}>
            <IconButton aria-label="Edit" onClick={() => handleEditTask(info?.row?.original?.id)}>
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="Delete"
              disabled={deleteTaskMutation.isPending}
              onClick={() => {
                setDeleteTargetId(info?.row?.original?.id);
                setShowDeleteConfirmDialog(true);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        );
      },
      footer: (info) => info.column.id,
      header: () => 'Actions',
      minSize: 100,
    }),
  ];

  const table = useReactTable({
    columnResizeMode: 'onChange',
    columns,
    data: projectTasks || [],
    defaultColumn: {
      maxSize: 800,
      minSize: 80,
    },
    enableSorting: true,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  return (
    <div>
      {isError && <ErrorMessage message={'An error occurred while fetching tasks.'} />}
      {!isError && (
        <TableContainer component={Paper}>
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
              <CircularProgress />
            </div>
          ) : table.getRowModel().rows.length === 0 ? (
            <Typography sx={{ p: 3, textAlign: 'center' }} color="text.secondary">
              No tasks yet. Click "Add task" to create one.
            </Typography>
          ) : (
            <>
              <Table>
                <TableHead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableCell key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableHead>
                <TableBody>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} hover>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={table.getFilteredRowModel().rows.length}
                page={table.getState().pagination.pageIndex}
                onPageChange={(_, page) => table.setPageIndex(page)}
                rowsPerPage={table.getState().pagination.pageSize}
                onRowsPerPageChange={(e) => table.setPageSize(Number(e.target.value))}
                rowsPerPageOptions={[5, 10, 25]}
              />
            </>
          )}
        </TableContainer>
      )}
      <ConfirmDialog
        open={showDeleteConfirmDialog}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={handleDeleteTask}
        onCancel={() => setShowDeleteConfirmDialog(false)}
      />
    </div>
  );
};
