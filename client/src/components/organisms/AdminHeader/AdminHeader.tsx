import { AdminFilter, AdminSearch } from '@components/molecules';
import styles from './AdminHeader.module.scss';

const AdminHeader = () => {
  return (
    <header className={styles.header}>
      <AdminSearch className={styles.header_search} data-testid='admin-search'>
        <span className={styles.header_icon}>
          <AdminFilter />
        </span>
      </AdminSearch>
    </header>
  );
};

export default AdminHeader;
