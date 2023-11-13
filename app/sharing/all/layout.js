import SharingNav from '@/components/Navbar/Sharing/SharingNav';
import styles from './allLayout.module.css';

export default function SharingLayout({ children }) {

  return (
    <div className={styles.page}>
      <SharingNav type={"all"} />
      {children}
    </div>
  )
}
