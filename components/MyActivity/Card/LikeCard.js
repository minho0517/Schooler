
import { PiThumbsUpBold } from "react-icons/pi";
import styles from "./MyActivityCard.module.css";
import { identify } from "@/utils/identity";
import Link from "next/link";
import { FaXmark } from "react-icons/fa6";
import useModal from "@/hooks/useModal";
import ConfirmModal from "@/components/Utils/Modal/ConfirmModal";
import { createPortal } from "react-dom";

export default function LikeCard({data, removeHandler}) {

    const {modal, portalElement, modalHandler} = useModal();

    const openHandler = () => {
        modalHandler();
    }

    return (
        <div className={styles.cardItem}>
            <div className={styles.card}>
                <Link href={"/post/" + [data.post.length > 0 ? data.post[0]._id : data.comment[0].post_id]} className={styles.wrapper}>
                    <div className={styles.type}><PiThumbsUpBold size={25}/></div>
                    <div className={styles.main}>
                        <div className={styles.head}>
                            <div className={styles.activityLabel}>
                                <div className={styles.likeContent}>
                                    <span>{data.post.length > 0 ?  data.post[0].title : '"' + data.comment[0].content + '"' }</span>
                                </div>
                                <div className={styles.activity}>
                                    {data.post.length > 0 && <span className={styles.topic}>{data.post[0].topic}</span>}
                                    <span className={styles.message}>{data.post.length > 0 ? "셰어링" : "댓글" }에 좋아요로 공감했습니다</span>
                                </div>
                            </div>
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
            {modal && createPortal(<ConfirmModal process={() => removeHandler(data._id, "likes")} message={"좋아요 활동을 삭제하시겠습니까?"} description={"해당 게시물 또는 댓글에 대한 좋아요 활동이 삭제되며 다시 되돌릴 수 없습니다"} cancel={modalHandler} />, portalElement)}
        </div>
    )
}