import { FaRegComments } from "react-icons/fa6"
import styles from "./landing.module.css"
import Link from "next/link"

export default function Page() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.box}>
                <div className={styles.icon}>
                    <FaRegComments size={50}/>
                </div>
                <span className={styles.title}>컨택트</span>
                <span className={styles.description}>실시간으로 다른 학생들과 대화를 나누어보세요</span>
                <Link className={styles.moveBtn} href={"/sharing/all"}>오픈셰어링찾기</Link>
            </div>
        </div>
    )
}