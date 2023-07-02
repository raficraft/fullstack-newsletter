import { Button, DropList, Modal } from '@components/atoms';
import { useState } from 'react';
import styles from './AdminFilter.module.scss';
import { IconeFilter, IconeReload } from '@assets/svg/icons';

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

const AdminFilter = ({ submit, reset }: AdminFilterProps) => {
  const [filter, setFilter] = useState<FilterState>({
    sortBy: 'none',
    order: 'none',
    active: 'none',
  });

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

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
  };

  return (
    <>
      <button
        type='button'
        className='btn_icon btn_blue'
        onClick={() => {
          setDialogOpen(!dialogOpen);
        }}
        title='Filter data'
      >
        <IconeFilter />
      </button>
      <span className='hr_vertical'></span>
      <button
        type='button'
        onClick={resetFilter}
        className='btn_icon btn_green'
        title='Reset filter and reload data'
      >
        <IconeReload />
      </button>

      {dialogOpen && (
        <Modal
          onClick={() => {
            setDialogOpen(false);
          }}
        >
          <div className={`box ${styles.dialog}`}>
            <div className={styles.items}>
              <div className={styles.droplist}>
                <label className='text_s bold'>Sort By :</label>
                <DropList
                  options={optionsFilter}
                  name='sortBy'
                  callback={(value: string) => updateState('sortBy', value)}
                />
              </div>
              <hr></hr>
              <div className={styles.droplist}>
                <label className='text_s bold'>Order by :</label>
                <DropList
                  options={optionsOrder}
                  name='order'
                  callback={(value: string) => updateState('order', value)}
                />
              </div>
              <hr></hr>
              <div className={styles.droplist}>
                <label className='text_s bold'>Active :</label>
                <DropList
                  options={optionsFilterActive}
                  name='active'
                  callback={(value: string) => updateState('active', value)}
                />
              </div>
            </div>
            <footer>
              <Button
                className='btn_primary full_width'
                onClick={() => {
                  submit(generateFilterUrl());
                  setFilter({ sortBy: 'none', order: 'none', active: 'none' });
                  setDialogOpen(false);
                }}
              >
                Filtrer
              </Button>
            </footer>
          </div>
        </Modal>
      )}
    </>
  );
};

export default AdminFilter;
