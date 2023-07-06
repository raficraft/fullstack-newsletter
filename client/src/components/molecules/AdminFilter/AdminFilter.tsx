import { useState } from 'react';
import { Button, DropList, Modal } from '@components/atoms';
import styles from './AdminFilter.module.scss';
import { IconeFilter, IconeReload } from '@assets/svg/icons';
import useNewsLetterStore, { StoreActions } from '@store/useNewsletterStore';
import Spinner from '@components/atoms/Spinner/Spinner';

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
  const {
    loading,
    currentAction,
    updateFilter,
    generateFilterUrl,
    filterData,
    resetFilter,
  } = useNewsLetterStore();

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

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
                  callback={(value: string) => updateFilter('sortBy', value)}
                />
              </div>
              <hr></hr>
              <div className={styles.droplist}>
                <label className='text_s bold' htmlFor='orderBy'>
                  Order by :
                </label>
                <DropList
                  options={optionsOrder}
                  id='orderBy'
                  callback={(value: string) => updateFilter('orderBy', value)}
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
                  callback={(value: string) => updateFilter('active', value)}
                />
              </div>
            </div>
            <footer>
              <Button
                title='Filter'
                className='btn_primary full_width'
                onClick={() => {
                  filterData(generateFilterUrl());
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
