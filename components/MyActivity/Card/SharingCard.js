
import Link from "next/link";
import styles from "./MyActivityCard.module.css";
import { IoGrid } from "react-icons/io5"
import { identify } from "@/utils/identity";
import { FaXmark } from "react-icons/fa6";
import useModal from "@/hooks/useModal";
import { createPortal } from "react-dom";
import ConfirmModal from "@/components/Utils/Modal/ConfirmModal";

export default function SharingCard({data, removeHandler}) {

    const {modal, portalElement, modalHandler} = useModal();

    const openHandler = () => {
        modalHandler();
    }

    return (
        <div className={styles.cardItem}>
            <div className={styles.card}>
                <Link href={"/post/" + data._id} className={styles.wrapper}>
                    <div className={styles.type}><IoGrid size={23}/></div>
                    <div className={styles.main}>
                        <div className={styles.head}>
                            <div className={styles.activityLabel}>
                                <div className={styles.activity}>
                                    <span className={styles.topic}>{data.topic}</span>
                                    <span className={styles.message}>에 셰어링 게시물을 올렸습니다</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.activityInfo}>
                            <h4 className={styles.title}>{data.title}</h4>
                            <p className={styles.content}>{data.content.slice(0,250)}</p>
                        </div>
                    </div>
                    <div className={styles.timeInfo}>
                        <span className={styles.time}>{new identify(data.createdAt).hourMin()} </span>
                    </div>
                </Link>
                <div className={styles.setting}>
                    <button onClick={openHandler} className={styles.settingBtn}><FaXmark size={22}/> </button>
                </div>
            </div>
            {modal && createPortal(<ConfirmModal process={() => removeHandler(data._id, "sharing")} message={"셰어링을 삭제하시겠습니까?"} description={"삭제된 셰어링은 보관함에 1주일동안 보관되며 해당 기간내에 보관함에서 복구할 수 있습니댜. 하지만 조회수, 좋아요, 댓글 데이터는 모두 삭제됩니다."} cancel={modalHandler} />, portalElement)}
        </div>
    )
}