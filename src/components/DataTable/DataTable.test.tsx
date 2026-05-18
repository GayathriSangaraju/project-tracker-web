import { render, screen } from '@testing-library/react';
import { DataTable } from './DataTable';
import { expect, test, describe } from 'vitest';
import { createColumnHelper } from '@tanstack/react-table';

type TestRow = { id: string; name: string };
const columnHelper = createColumnHelper<TestRow>();
const columns = [
  columnHelper.accessor('name', {
    header: () => 'Name',
    cell: (info) => info.getValue(),
  }),
];

const testData: TestRow[] = [
  { id: '1', name: 'Item 1' },
  { id: '2', name: 'Item 2' },
];

describe('DataTable', () => {
  test('renders data rows', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        isLoading={false}
        isError={false}
        errorMessage="Error"
        emptyMessage="No items"
        ariaLabel="Test table"
      />,
    );
    expect(screen.getByText('Item 1')).toBeDefined();
    expect(screen.getByText('Item 2')).toBeDefined();
  });

  test('renders loading state', () => {
    render(
      <DataTable
        columns={columns}
        data={[]}
        isLoading={true}
        isError={false}
        errorMessage="Error"
        emptyMessage="No items"
        ariaLabel="Test table"
      />,
    );
    expect(screen.getByRole('progressbar')).toBeDefined();
  });

  test('renders error message', () => {
    render(
      <DataTable
        columns={columns}
        data={[]}
        isLoading={false}
        isError={true}
        errorMessage="Something went wrong"
        emptyMessage="No items"
        ariaLabel="Test table"
      />,
    );
    expect(screen.getByText('Something went wrong')).toBeDefined();
  });

  test('renders empty message when no data', () => {
    render(
      <DataTable
        columns={columns}
        data={[]}
        isLoading={false}
        isError={false}
        errorMessage="Error"
        emptyMessage="No items found"
        ariaLabel="Test table"
      />,
    );
    expect(screen.getByText('No items found')).toBeDefined();
  });

  test('renders table with aria-label for accessibility', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        isLoading={false}
        isError={false}
        errorMessage="Error"
        emptyMessage="No items"
        ariaLabel="Accessible table"
      />,
    );
    expect(screen.getByLabelText('Accessible table')).toBeDefined();
  });
});
