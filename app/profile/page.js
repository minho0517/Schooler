import { getServerSession } from "next-auth";
import styles from "./profile.module.css";
import { FaCircleUser, FaGear, FaPenToSquare } from "react-icons/fa6";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Link from "next/link";
import SharingList from "@/components/Profile/SharingList/SharingList";
import NoticeCard from "@/components/Profile/NoticeCard/NoticeCard";
import { GoBackHeader } from "@/components/Header/Top/TopHeader";
import ProfileBtn from "@/components/Profile/Btn/ProfileBtn";

async function fetchData() {
    const _id = (await getServerSession(authOptions)).user.id;
    const response = await fetch(`${process.env.ABSOLUTE_URL}/api/my/${_id}/info/profile`, {cache:"no-store"});
    const data = response.json();
    return data;
}

export default async function Page() {

    const data = await fetchData();
    
    return (
        <div className={styles.page}>
            <GoBackHeader />
            <div className={styles.wrapper}>
                <div className={styles.myInfo}>
                    <div className={styles.myInfoWrapper}>
                        <div className={styles.info}>
                            <div className={styles.infoImg}><FaCircleUser size={150} /></div>
                            <div className={styles.infoCommon}>
                                <h2 className={styles.infoId}>{data.id}</h2>
                                <span className={styles.infoName}>{data.name}</span>
                                <Link href={"/school/" + data.school.schoolName} className={styles.infoSchool}>{data.school.schoolName}</Link>
                                <div className={styles.profileBtnGroup}>
                                    <Link href="/account/edit" className={styles.profileBtn}>프로필 편집</Link>
                                    <Link href="/my_activity/all" className={styles.profileBtn}>내 활동</Link>
                                    <Link href="/my_activity/archive" className={styles.profileBtn}>보관함</Link>
                                </div>
                            </div>
                        </div>
                        <div className={styles.infoBtnGroup}>
                            <Link href="/share" className={styles.shareBtn}><FaPenToSquare size={15}/><span>글쓰기</span></Link>
                            <ProfileBtn/>
                        </div>
                    </div>
                </div>
                <div className={`${styles.profileBtnGroup} ${styles.mobile}`}>
                    <Link href="/account/edit" className={styles.profileBtn}>프로필 편집</Link>
                    <Link href="/my_activity/all" className={styles.profileBtn}>내 활동</Link>
                    <Link href="/my_activity/archive" className={styles.profileBtn}>보관함</Link>
                </div>
                <div className={styles.myActivity}>
                    <div className={styles.main}>
                        <SharingList />
                    </div>
                    <div className={styles.sub}>
                        <NoticeCard />
                    </div>
                </div>
            </div>
        </div>
    )
}