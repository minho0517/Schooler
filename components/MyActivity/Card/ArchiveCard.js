import styles from "./ArchiveCard.module.css";
import activity from "./MyActivityCard.module.css";
import { identify } from "@/utils/identity";
import { PiEyeBold, PiThumbsUpBold } from "react-icons/pi";
import { FaBoxArchive, FaRegComment, FaTrashArrowUp, FaXmark } from "react-icons/fa6";
import Link from "next/link";
import ConfirmModal from "@/components/Utils/Modal/ConfirmModal";
import useModal from "@/hooks/useModal";
import { createPortal } from "react-dom";
import { useState } from "react";

export default function ArchiveCard({data, removeHandler, recoveryHandler}) {

    const {modal, portalElement, modalHandler} = useModal();
    const [type, setType] = useState(null);

    const openRecoveryHandler = () => {
        setType("recovery")
        modalHandler();
    }
    const openRemoveHandler = () => {
        setType("remove")
        modalHandler();
    }

    return (
        <div className={activity.cardItem}>
            <div className={activity.card}>
                <Link href={'/post/' + data._id} className={activity.wrapper}>
                    <div className={activity.type}><FaBoxArchive size={23}/></div>
                    <div className={activity.main}>
                        <div className={styles.head}>
                            <span className={styles.topic}>{data.topic}</span>
                            <span className={styles.pastTime}>{new identify(data.createdAt).pastTime()}</span>
                        </div>
                        <div className={styles.content}>
                            <h4 className={styles.title}>{data.title}</h4>
                            <p className={styles.previewContent}>{data.content.slice(0,200)}</p>
                        </div>
                        <div className={styles.info}>
                            <div className={styles.writer}>{data.user_id.id} &#183; {data.user_id.school.schoolName}</div>
                            <div className={styles.activeGroup}>
                                <div className={styles.activeRecord}>
                                    <PiEyeBold size={15}/>
                                    <span>{data.views}</span>
                                </div>
                                <div className={styles.activeRecord}>
                                    <PiThumbsUpBold size={15}/>
                                    <span>{data.likes.length}</span>
                                </div>
                                <div className={styles.activeRecord}>
                                    <FaRegComment size={15}/>
                                    <span>{data.comments.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={activity.timeInfo}>
                        <span className={styles.expireDate}>{new identify(data.expirationDate).untilTime()} 남음</span>
                    </div>
                </Link>
                <div className={activity.setting}>
                    <button onClick={openRecoveryHandler} className={activity.settingBtn}><FaTrashArrowUp size={22}/></button>
                    <button onClick={openRemoveHandler} className={activity.settingBtn}><FaXmark size={22}/></button>
                </div>
            </div>
            {type === "remove" && modal && createPortal(<ConfirmModal process={() => removeHandler(data._id, "archive")} message={"보관된 셰어링을 삭제하시겠습니까?"} description={"보관된 셰어링은 영구히 삭제되며 다시 복구할 수 없습니다"} cancel={modalHandler} />, portalElement)}
            {type === "recovery" && modal && createPortal(<ConfirmModal process={() => recoveryHandler(data._id)} message={"보관된 셰어링을 복구하겠습니까?"} description={"보관된 셰어링은 다시 복구되며 댓글, 좋아요, 오픈셰어링 등이 모두 다시 활성화됩니다"} cancel={modalHandler} />, portalElement)}
        </div>
    )
}