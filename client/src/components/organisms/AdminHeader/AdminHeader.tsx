// components/organisms/AdminHeader.tsx
import React from 'react';
import { AdminSearch, AdminFilter } from '@components/molecules';
import styles from './AdminHeader.module.scss';

interface AdminHeaderProps {
  handleSearch: (searchQuery: string) => void;
  handleFilter: (filterQuery: string) => void;
  loadData: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  handleSearch,
  handleFilter,
  loadData,
}) => {
  return (
    <header className={styles.header}>
      <AdminSearch callback={handleSearch} className={styles.header_search}>
        <span className={styles.header_icon}>
          <AdminFilter submit={handleFilter} reset={loadData} />
        </span>
      </AdminSearch>
    </header>
  );
};

export default AdminHeader;
