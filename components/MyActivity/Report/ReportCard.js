
import { FaChartSimple, FaCircleInfo, FaMagnifyingGlass } from "react-icons/fa6";
import styles from "./ReportCard.module.css";
import BlankWrapper from "@/components/Utils/Blank/BlankWrapper";

export default function ReportCard() {


    return (
        <div className={styles.card}>
            <div className={styles.wrapper}>
                <div className={styles.search}>
                    <div className={styles.searchBox}>
                        <button className={styles.searchBtn}><FaMagnifyingGlass size={18}/></button>
                        <input placeholder="검색 내용을 입력해주세요" className={styles.searchInput}></input>
                        <div className={styles.inputUnderline}></div>
                    </div>
                </div>
                <div className={styles.report}>
                    <div className={styles.header}>
                        <div className={styles.title}>
                            <FaChartSimple size={16}/>
                            <h4>커뮤니티 리포트</h4>
                        </div>
                        <button className={styles.detailInfo}><FaCircleInfo size={13}/></button>
                    </div>
                    <div className={styles.reportBox}>
                        <BlankWrapper size={15} message={"현재 통계 지표는 개발 중에 있습니다"}/>
                    </div>
                </div>
            </div>
        </div>
    )

}