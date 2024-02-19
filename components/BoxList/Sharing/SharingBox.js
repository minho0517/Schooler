
import styles from "./SharingBox.module.css";
import { useRouter } from "next/navigation";
import { FaAngleRight, FaStar } from "react-icons/fa6";
import { PiEyeBold, PiThumbsUpBold } from 'react-icons/pi';
import { FaRegComment } from 'react-icons/fa6';
import Link from "next/link";

export default function SharingBox({ currentId, topic, data, status, scope }) {

    const router = useRouter();

    const list = data?.pages[0].filter(item => item._id !== currentId).slice(0, 5);

    return (
        <div className={`${styles.box}`}>
            <div className={styles.boxWrapper}>
                <div onClick={() => router.push(`/sharing/all/${topic}`)} className={styles.boxHeader}>
                    <div className={styles.topicTitle}><span className={styles.topic}>{scope === "전체" ? topic : "우리학교"}</span> <span>추천 셰어링</span></div>
                    <div className={styles.moveBtn}><FaAngleRight size={18}/></div>
                </div>
                <div className={styles.boxList}>
                    {status === "loading" && Array(5).fill(<div className={styles.item}></div>)}
                    {list?.map((e, i) => (
                        <Link href={`/post/${e._id}`} className={styles.item} key={i}>
                            <div className={styles.itemWrapper}>
                                <div className={styles.title}>
                                    <span>{e.title}</span>
                                </div>
                                <div className={styles.activeGroup}>
                                    <div className={styles.activeRecord}>
                                        <PiEyeBold size={15}/>
                                        <span>{e.views}</span>
                                    </div>
                                    <div className={styles.activeRecord}>
                                        <PiThumbsUpBold size={15}/>
                                        <span>{e.likes.length}</span>
                                    </div>
                                    <div className={styles.activeRecord}>
                                        <FaRegComment size={15}/>
                                        <span>{e.comments.length}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}