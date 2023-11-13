import SharingNav from '@/components/Navbar/Sharing/SharingNav';
import styles from './ourSchoolLayout.module.css';
import SchoolCard from '@/components/OurSchool/SchoolCard';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

async function fetchData() {
    const userId = (await getServerSession(authOptions)).user.id;
    const response = await fetch(`${process.env.ABSOLUTE_URL}/api/school/info/sharing?user=${userId}`);
    const data = response.json();
    return data;
}

export default async function OurSchoolSharingLayout({ children }) {

    const data = await fetchData();

    return (
        <div className={styles.page}>
            <SchoolCard data={data} />
            <SharingNav type={"our_school"} />
            {children}
        </div>
    )
}
