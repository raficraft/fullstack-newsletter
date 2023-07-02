// components/molecules/Pagination.tsx
import React from 'react';
import { Button, Text } from '@components/atoms';
import styles from './Pagination.module.scss';

interface PaginationProps {
  prevPage: () => void;
  nextPage: () => void;
  currentPage: number;
  totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({
  prevPage,
  nextPage,
  currentPage,
  totalPages,
}) => {
  return (
    <div className={styles.paginate}>
      <Button
        onClick={prevPage}
        disabled={currentPage === 0}
        className='btn_primary'
      >
        Prev
      </Button>
      <Text tag='p' className='bold'>
        {currentPage + 1} / {totalPages}
      </Text>
      <Button
        onClick={nextPage}
        disabled={currentPage === totalPages - 1}
        className='btn_primary'
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
