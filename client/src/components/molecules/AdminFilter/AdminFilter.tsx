import { DropList } from '@components/atoms';
import { useEffect, useState } from 'react';

interface AdminFilterProps {
  submit: (url: string) => void;
  reset: () => void;
}

interface FilterState {
  sortBy: string;
  order: string;
  active: string;
}

const optionsFilter = [
  { label: 'None', value: 'none' },
  { label: 'Email', value: 'email' },
  { label: 'CreatedAt', value: 'createdAt' },
  { label: 'UpdatedAt', value: 'updatedAt' },
];

const optionsOrder = [
  { label: 'None', value: 'none' },
  { label: 'Ascendant', value: 'asc' },
  { label: 'Descendant', value: 'desc' },
];

const optionsFilterActive = [
  { label: 'all', value: 'none' },
  { label: 'Active', value: 'true' },
  { label: 'Disabled', value: 'false' },
];

const AdminFilter: React.FC<AdminFilterProps> = ({ submit, reset }) => {
  const [filter, setFilter] = useState<FilterState>({
    sortBy: 'none',
    order: 'none',
    active: 'none',
  });

  const [resetKey, setResetKey] = useState<number>(0);
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);

  const updateState = (key: string, value: string) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      [key]: value,
    }));
  };

  const generateFilterUrl = (): string => {
    const params = [];

    if (filter.sortBy !== 'none') {
      params.push(`sortBy=${filter.sortBy}`);
    }

    if (filter.order !== 'none') {
      params.push(`order=${filter.order}`);
    }

    if (filter.active !== 'none') {
      params.push(`active=${filter.active}`);
    }

    return params.length > 0 ? `?${params.join('&')}` : '';
  };

  const resetFilter = () => {
    setFilter({ sortBy: 'none', order: 'none', active: 'none' });
    reset();
    setResetKey((prevKey) => prevKey + 1);
  };

  return (
    <details
      key={resetKey}
      open={detailsOpen}
      onToggle={(e) => setDetailsOpen(e.currentTarget.open)}
    >
      <summary>Filtre</summary>
      <div>
        <label>Sort By</label>
        <DropList
          options={optionsFilter}
          name='sortBy'
          callback={(value: string) => updateState('sortBy', value)}
        />
      </div>

      <div>
        <label>Order</label>
        <DropList
          options={optionsOrder}
          name='order'
          callback={(value: string) => updateState('order', value)}
        />
      </div>

      <div>
        <label>Active</label>
        <DropList
          options={optionsFilterActive}
          name='active'
          callback={(value: string) => updateState('active', value)}
        />
      </div>

      <footer>
        <button
          type='button'
          onClick={() => {
            submit(generateFilterUrl());
          }}
        >
          Filtrer
        </button>
        <button type='button' onClick={resetFilter}>
          reset
        </button>
      </footer>
    </details>
  );
};

export default AdminFilter;
