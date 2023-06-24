import { IconDictionary } from '@assets/svg/icons';
import styles from './Header.module.scss';
import SwitchTheme from '@molecules/SwitchTheme/SwitchTheme';
import SwitchFont from '@molecules/SwitchFont/SwitchFont';

const Header = () => {
  return (
    <header className={styles.header}>
      <IconDictionary data-testid='header-icon' />
      <div className={`${styles.switch}`}>
        <SwitchFont />
        <span className='hr_vertical'></span>
        <SwitchTheme />
      </div>
    </header>
  );
};

export default Header;
