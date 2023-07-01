import { Button, DropList, Text } from '@components/atoms';
import { useState } from 'react';
import styles from './AdminFilter.module.scss';
import { IconCross, IconeFilter, IconeReload } from '@assets/svg/icons';
import { createPortal } from 'react-dom';

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

  // const [resetKey, setResetKey] = useState<number>(0);
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
    // setResetKey((prevKey) => prevKey + 1);
  };

  return (
    <>
      <button
        type='button'
        className='btn_icon btn_blue'
        onClick={() => {
          setDialogOpen(!dialogOpen);
          submit(generateFilterUrl());
        }}
      >
        <IconeFilter />
      </button>
      <span className='hr_vertical'></span>
      <button
        type='button'
        onClick={resetFilter}
        className='btn_icon btn_green'
      >
        <IconeReload />
      </button>

      {dialogOpen &&
        createPortal(
          <div
            className={styles.dialog}
            onClick={(event) => {
              setDialogOpen(false);
            }}
          >
            <div
              className={styles.dialog_content}
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <header>
                <IconCross />
              </header>

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
                  <label className='text_s bold'>Order :</label>
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
                  className='btn_primary'
                  onClick={() => {
                    submit(generateFilterUrl());
                  }}
                >
                  Filtrer
                </Button>
              </footer>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default AdminFilter;
