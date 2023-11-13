import styles from "./SharingCard.module.css";
import { identify } from "@/utils/identity";
import { PiEyeBold, PiThumbsUpBold } from "react-icons/pi";
import { FaRegComment, FaRegPenToSquare, FaRegShareFromSquare, FaRegTrashCan } from "react-icons/fa6";
import { GoBookmarkSlash } from "react-icons/go"
import Link from "next/link";
import ConfirmModal from "@/components/Utils/Modal/ConfirmModal";
import useModal from "@/hooks/useModal";
import { createPortal } from "react-dom";

export default function ProfileCard({data, deleteHandler, bookmarkHandler, menu}) {

    const {modal, portalElement, modalHandler} = useModal();

    const deleteBtnHandler = () => {
        modalHandler();
    }

    const bookmarkBtnHandler = () => {
        bookmarkHandler();
    }

    return (
        <div className={`${styles.card} ${styles.profile}`}>
            <Link href={'/post/' + data._id} className={styles.wrapper}>
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
            </Link>
            {menu === "bookmark" &&
            <div className={styles.cardBtnGroup}>
                <button className={styles.cardBtn}><FaRegShareFromSquare size={15}/><span>공유하기</span></button>
                <button onClick={bookmarkBtnHandler} className={styles.cardBtn}><GoBookmarkSlash size={18}/> <span>해제하기</span></button>
            </div>}
            {menu === "sharing" &&
            <div className={styles.cardBtnGroup}>
                <button className={styles.cardBtn}><FaRegShareFromSquare size={15}/><span>공유하기</span></button>
                <Link href={"/edit/" + data._id } className={styles.cardBtn}><FaRegPenToSquare size={15}/><span>수정하기</span></Link>
                <button onClick={deleteBtnHandler} className={styles.cardBtn}><FaRegTrashCan size={15}/><span>삭제하기</span></button>
            </div>}
            {modal && createPortal(<ConfirmModal process={deleteHandler} message={"셰어링을 삭제하시겠습니까?"} description={"삭제된 셰어링은 보관함에 1주일동안 보관되며 해당 기간내에 보관함에서 복구할 수 있습니다. 하지만 조회수, 좋아요, 댓글 데이터는 모두 삭제됩니다."} cancel={modalHandler} />, portalElement)}
        </div>
    )
}