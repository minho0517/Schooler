import styles from './userLayout.module.css';
import Image from 'next/image';
import IntroImg from "@/public/image/schooler-logo-icon.png";

export default function SharingLayout({ children }) {

  return (
    <div className={styles.page}>
        <div className={styles.box}>
            <div className={styles.landing}>
                    <div className={styles.title_wrapper}>
                    <Image className={styles.logo} alt='logo' src={IntroImg}></Image>
                    <h5 className={styles.title}>스쿨러 SCHOOLER</h5>
                    <span className={styles.subTitle}>청소년을 위한 뉴커뮤니티 플랫폼</span>
                </div>
            </div>
            <div className={styles.section}>
                {children}
            </div>
        </div>
        <footer className={styles.footer}></footer>
    </div>
  )
}
