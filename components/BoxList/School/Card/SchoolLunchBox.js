"use client";

import { FaAngleRight, FaCircle, FaRegHeart } from "react-icons/fa6";
import styles from "./SchoolBox.module.css";
import { MdOutlineLunchDining } from "react-icons/md";
import { useGetQuery } from "@/hooks/useGetQuery";

export default function SchoolLunchBox() {

    const apiUrl = `/api/school/info/lunch?`;
    const queryKey = ['get-schoolLunch'];
    const { data, fetchNextPage, status, isFetchingNextPage } = useGetQuery({ apiUrl, queryKey });

    
    const menuList = (menuString) => {
        return menuString.split('<br/>').map(item => item.replace(/\(.+?\)/g, '').match(/[가-힣]+/g)).filter(item => item !== null);
    }

    return (
        <div className={styles.box}>
            <div className={styles.wrapper}>
                <div className={styles.header}>
                    <div className={styles.title}>
                        <span className={styles.titleIcon}><MdOutlineLunchDining size={20}/></span>
                        <span>오늘의 급식</span>
                    </div>
                    <div className={styles.moveBtn}><FaAngleRight size={18}/></div>
                </div>
                <div className={styles.list}>
                    {!data && Array(5).fill(<div className={styles.mealItem}></div>)}
                    {data?.pages.map((today, i) => (
                        today.map((meal, i) => (
                            menuList(meal.DDISH_NM).map((e, i) => (
                                <div key={i} className={styles.mealItem}>
                                    <span>{e}</span>
                                    <button className={styles.likeBtn}><FaRegHeart size={15}/> </button>
                                </div>
                            ))
                        ))
                    ))}
                </div>
            </div>
        </div>
    )
}

