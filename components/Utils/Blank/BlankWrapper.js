import styles from "./BlankWrapper.module.css";

export default function BlankWrapper({message, size, weight}) {

    const blankStyle = {
        fontSize : size + "px",
        fontWeight : weight,
    }

    return (
        <div className={styles.wrapper}>
            <span style={blankStyle} className={styles.message}>
                {message}
            </span>
        </div>
    )
}