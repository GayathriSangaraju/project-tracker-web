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
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
} from '@tanstack/react-table';

interface DataTableProps<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<T, any>[];
  data: T[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  emptyMessage: string;
  pageSize?: number;
  ariaLabel: string;
}

export function DataTable<T>({
  columns,
  data,
  isLoading,
  isError,
  errorMessage,
  emptyMessage,
  pageSize = 5,
  ariaLabel,
}: DataTableProps<T>) {
  const table = useReactTable({
    columnResizeMode: 'onChange',
    columns,
    data,
    defaultColumn: {
      maxSize: 800,
      minSize: 80,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  if (isError) {
    return (
      <Typography color="error" sx={{ p: 2 }}>
        {errorMessage}
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} aria-label={ariaLabel}>
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <CircularProgress aria-label="Loading" />
        </div>
      ) : table.getRowModel().rows.length === 0 ? (
        <Typography sx={{ p: 3, textAlign: 'center' }} color="text.secondary">
          {emptyMessage}
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
  );
}
