import styles from '../styles/Navbar.module.scss';

export default function Navbar({ username, profilePic }) {
  return (
    <nav className={styles.nav}>
      <h1 className={styles.nav__heading}>Hi, {username}</h1>

      {/* eslint-disable-next-line */}
      <img
        src={profilePic}
        alt={'User profile Picture'}
        className={styles['nav__profile-pic']}
      ></img>
    </nav>
  );
}
