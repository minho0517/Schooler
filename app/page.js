import styles from './page.module.css'
import Link from 'next/link'
import { FaAngleLeft, FaAngleRight, FaPaperclip, FaRotate, FaSchoolFlag } from 'react-icons/fa6';
import LivechatList from '@/components/LivechatList/LivechatList';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import { subscribeUser } from '@/utils/serviceWorker';


export default async function Home() {

  const user = await getServerSession(authOptions);

  return (
    <div className={styles.page}>
      <div className={styles.page_wrapper}>
        {user && <section className={styles.container}>
          <div className={styles.section_header}>
            <Link href='/follow' className={styles.section_title}>
              <h3>우리 학교 소식</h3>
            </Link>
            <div className={styles.action_group}>
              <div className={styles.actionBtn} id={styles.update}><FaRotate size={20}/></div>
            </div>
          </div>
        </section>}
        <section className={styles.container}>
          <div className={styles.section_header}>
            <Link href='/sharing/livechat' className={styles.section_title}>
              <h3>라이브챗</h3>
            </Link>
            <div className={styles.action_group}>
              <div className={styles.actionBtn} id={styles.update}><FaRotate size={20}/></div>
              <div className={styles.actionBtn}><FaAngleLeft size={23}/></div>
              <div className={styles.actionBtn}><FaAngleRight size={23}/></div>
            </div>
          </div>
          {/* <LivechatList buttonGroup={btnGroup} /> */}
        </section>
        <section className={styles.container}>
          <div className={styles.section_header}>
            <Link href='/sharing' className={styles.section_title}>
              <h3>셰어링</h3>
            </Link>
            <div className={styles.action_group}>
              <div className={styles.actionBtn} id={styles.update}><FaRotate size={20}/></div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
