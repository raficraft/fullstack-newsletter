import { useState } from 'react';
import { Button, DropList, Modal } from '@components/atoms';
import styles from './AdminFilter.module.scss';
import { IconeFilter, IconeReload } from '@assets/svg/icons';
import useNewsLetterStore, { StoreActions } from '@store/useNewsletterStore';
import Spinner from '@components/atoms/Spinner/Spinner';

interface FilterState {
  sortBy: string;
  order: string;
  active: string;
}

const optionsFilter = [
  { label: 'CreatedAt', value: 'createdAt' },
  { label: 'Email', value: 'email' },
  { label: 'UpdatedAt', value: 'updatedAt' },
];

const optionsOrder = [
  { label: 'Ascendant', value: 'asc' },
  { label: 'Descendant', value: 'desc' },
];

const optionsFilterActive = [
  { label: 'All', value: 'none' },
  { label: 'Active', value: 'true' },
  { label: 'Disabled', value: 'false' },
];

const AdminFilter = () => {
  const [filter, setFilter] = useState<FilterState>({
    sortBy: 'createdAt',
    order: 'asc',
    active: 'none',
  });

  const { loading, currentAction, registered, filterData, setFilterRequest } =
    useNewsLetterStore();

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const updateState = (key: string, value: string) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      [key]: value,
    }));
  };

  const generateFilterUrl = (): string => {
    const params = [];

    params.push(`sortBy=${filter.sortBy}`);
    params.push(`order=${filter.order}`);

    if (filter.active !== 'none') {
      params.push(`active=${filter.active}`);
    }

    const requestOptions = params.length > 0 ? `?${params.join('&')}` : '';
    setFilterRequest(requestOptions);

    return requestOptions;
  };

  const resetFilter = () => {
    setFilter({ sortBy: 'createAt', order: 'asc', active: 'none' });
    setFilterRequest(generateFilterUrl());
    registered();
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
        {loading && StoreActions.FILTER === currentAction ? (
          <Spinner style={{ borderColor: 'white' }} />
        ) : (
          <IconeFilter />
        )}
      </button>
      <span className='hr_vertical'></span>
      <button
        type='button'
        onClick={resetFilter}
        className='btn_icon btn_green'
        title='Reset'
      >
        {loading && StoreActions.RELOAD === currentAction ? (
          <Spinner style={{ borderColor: 'white' }} />
        ) : (
          <IconeReload />
        )}
      </button>

      {dialogOpen && (
        <Modal
          close={() => {
            setDialogOpen(false);
          }}
        >
          <div
            className={`box ${styles.dialog}`}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className={styles.items}>
              <div className={styles.droplist}>
                <label className='text_s bold' htmlFor='sortBy'>
                  Sort by :
                </label>
                <DropList
                  options={optionsFilter}
                  id='sortBy'
                  callback={(value: string) => updateState('sortBy', value)}
                />
              </div>
              <hr></hr>
              <div className={styles.droplist}>
                <label className='text_s bold' htmlFor='order'>
                  Order by :
                </label>
                <DropList
                  options={optionsOrder}
                  id='order'
                  callback={(value: string) => updateState('order', value)}
                />
              </div>
              <hr></hr>
              <div className={styles.droplist}>
                <label className='text_s bold' htmlFor='active'>
                  Active :
                </label>
                <DropList
                  options={optionsFilterActive}
                  id='active'
                  callback={(value: string) => updateState('active', value)}
                />
              </div>
            </div>
            <footer>
              <Button
                className='btn_primary full_width'
                onClick={() => {
                  filterData(generateFilterUrl());
                  setFilter({ sortBy: 'none', order: 'none', active: 'none' });
                  setDialogOpen(false);
                }}
              >
                Filter
              </Button>
            </footer>
          </div>
        </Modal>
      )}
    </>
  );
};

export default AdminFilter;
