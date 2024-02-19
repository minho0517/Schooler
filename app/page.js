import styles from './page.module.css'
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import { TopHeader } from '@/components/Header/Top/TopHeader';
import Landing from '@/components/Home/Landing/Landing';
import SharingBoxList from '@/components/BoxList/Sharing/SharingBoxList';
import SchoolBoxList from '@/components/BoxList/School/SchoolBoxList';
import OpenSharingList from '@/components/BoxList/OpenSharing/OpenSharingList';


export default async function Home() {

  const user = await getServerSession(authOptions);

  return (
    <div className={styles.page}>
      <TopHeader isLogin={!!user}/>
      <div className={styles.page_wrapper}>
        {user ? <section className={styles.container}>
          <SchoolBoxList />
        </section> : <Landing />}
        {/* <section className={styles.container}>
          <OpenSharingList/>
        </section> */}
        <section className={styles.container}>
          <SharingBoxList />
        </section>
      </div>
    </div>
  )
}
