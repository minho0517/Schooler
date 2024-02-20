import { identify } from "@/utils/identity";
import styles from "./ChatItem.module.css"
import { Fragment } from "react";

export default function ChatItem({data, type}) {

    const newContent = (content) => { 
        const newContent = String(content).split("\n").map((line, i) => {
            return(
                <Fragment key={i}>
                    {new identify(line).url()}
                    <br/>
                </Fragment>
            );
        });
        return newContent;
    }   

    return (
        <div className={`${styles.item} ${data._id.mine && styles.mine} ${type === "card" && styles.card}`}>
            <div className={styles.wrapper}>
                {!data._id.mine && <div className={styles.head}>
                    <div className={styles.userId}><span>{data?.user[0]?.id.slice(0,1)} </span></div>
                    <span className={styles.school}>{data?.user[0]?.school.schoolName}</span>
                </div>}
                {data.chatItems.map((e, i) => (
                    <div key={i} className={styles.chatItem}>
                        <div className={styles.content}>
                            <p>{newContent(e.content)}</p>
                        </div>
                        {data.chatItems.length - 1 === i &&
                            <div className={styles.time}>
                                <span>{new identify(data?.chatItems[0]?.createdAt).hourMin()}</span>
                            </div>
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}