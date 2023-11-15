
import { FaRegComment, FaXmark } from "react-icons/fa6";
import styles from "./MyActivityCard.module.css";
import { identify } from "@/utils/identity";
import Link from "next/link";
import useModal from "@/hooks/useModal";
import { createPortal } from "react-dom";
import ConfirmModal from "@/components/Utils/Modal/ConfirmModal";

export default function CommentCard({data, removeHandler}) {

    const {modal, portalElement, modalHandler} = useModal();

    const openHandler = () => {
        modalHandler();
    }

    

    return (
        <div className={styles.cardItem}>
            <div className={styles.card}>
                <Link href={"/post/" + data.post_id} className={styles.wrapper}>
                    <div className={styles.type}><FaRegComment size={23}/></div>
                    <div className={styles.main}>
                        <div className={styles.head}>
                            <div className={styles.activityLabel}>
                                <div className={styles.commentParent}>
                                    <span className={styles.parent}>{data.depth === 0 ? [data.post[0] ? data.post[0].title : "삭제된 게시물"] : '"' + data.comment[0].content + '"'}</span>
                                </div>
                                <div className={styles.activity}>
                                    {data.depth === 0 && <span className={styles.topic}>{data.post[0]?.topic}</span>}
                                    <span className={styles.message}>{data.depth === 0 ? "셰어링에 댓글" : "에 답글"}을 남겼습니다</span>
                                </div>
                            </div>
                        </div>
                        <p className={styles.comment}>{data.content}</p>
                    </div>
                    <div className={styles.timeInfo}>
                        <span className={styles.time}>{new identify(data.createdAt).hourMin()} </span>
                    </div>
                </Link>
                <div className={styles.setting}>
                    <button onClick={openHandler} className={styles.settingBtn}><FaXmark size={22}/> </button>
                </div>
            </div>
            {modal && createPortal(<ConfirmModal process={() => removeHandler(data._id, "comments")} message={"댓글 활동을 삭제하시겠습니까?"} description={"해당 댓글 또는 답글 활동이 삭제되며 다시 되돌릴 수 없습니다"} cancel={modalHandler} />, portalElement)}
        </div>
    )
}