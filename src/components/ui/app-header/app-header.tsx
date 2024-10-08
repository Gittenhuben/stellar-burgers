import { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import { BurgerIcon, ListIcon, Logo, ProfileIcon} from '@zlden/react-developer-burger-ui-components';
import { Link, NavLink } from 'react-router-dom';


export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName, alternativePrimeLocation }) => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <NavLink
          to={`/`}
          className={({ isActive }) => `${styles.link} ${isActive || alternativePrimeLocation ? styles.link_active : ''}`}
        >
          <BurgerIcon type={'primary'} className={styles.icon} />
          <p className='text text_type_main-default ml-2 mr-10'>Конструктор</p>
        </NavLink>
        <NavLink
          to={`/feed`}
          className={({ isActive }) => `${styles.link} ${isActive ? styles.link_active : ''}`}
        >
          <ListIcon type={'primary'} className={styles.icon} />
          <p className='text text_type_main-default ml-2'>Лента заказов</p>
        </NavLink>
      </div>
      <Link
        to={`/`}
        className={styles.logo}
      >
        <Logo className='' />
      </Link>
      <NavLink
        to={'/profile'}
        className={({ isActive }) =>
          `${styles.link_position_last}
           ${styles.link}
           ${isActive ? styles.link_active : ''}`
        }
      >
        <ProfileIcon type={'primary'} className={styles.icon} />
        <p className='text text_type_main-default ml-2'>
          {userName || 'Личный кабинет'}
        </p>
      </NavLink>
    </nav>
  </header>
);
