import styles from '../styles/Navbar.module.scss';
import dropdownStyles from '../styles/Dropdown.module.scss';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Navbar() {
  const [isShowingDropdown, setIsShowingDropdown] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <nav className={styles.nav}>
      <h1
        className={styles.nav__heading}
        onClick={() => (router.route === '/' ? null : router.push('/'))}
      >
        Hi, {status !== 'loading' && session ? session.user.name : ''}
      </h1>

      {/* eslint-disable-next-line */}
      <img
        src={status !== 'loading' && session ? session.user.image : ''}
        alt={'User profile Picture'}
        className={styles['nav__profile-pic']}
        onClick={() => setIsShowingDropdown(!isShowingDropdown)}
      ></img>
      <AnimatePresence exitBeforeEnter>
        {isShowingDropdown && (
          <motion.div
            transition={{ duration: 0.3 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            className={dropdownStyles.dropdown}
          >
            <ul className={dropdownStyles.dropdown__list}>
              <li
                className={dropdownStyles.dropdown__list__item}
                onClick={() => {
                  router.push('/calculator');
                  setIsShowingDropdown(false);
                }}
              >
                Calculate Mortgage
              </li>
              <li
                className={dropdownStyles.dropdown__list__item}
                onClick={signOut}
              >
                Logout
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
