import styles from "./OpenSharingCard.module.css";
import { FaRegComments } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import OpenSharingBox from "./OpenSharingBox";

export default async function OpenSharingCard({data}) {

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.title}>
                    <FaRegComments size={22} />
                    <h4>오픈셰어링</h4>
                </div>
                <div className={styles.memberNum}>
                    <FaUser size={13} />
                    <span>{data.countMember}</span>
                </div>
            </div>
            <div className={styles.wrapper}>
                {data.isActive ? 
                <OpenSharingBox isJoined={data.isJoined} roomId={data.roomId} /> :
                <div className={styles.blank}><span>오픈 셰어링이 비활성화되었습니다</span></div>}
                {/* {<div className={styles.blank}><span>문제점이 발견되어 해결 중에 있습니다.</span></div> } */}
            </div>
        </div>
    )
} 