import styles from "./BlankWrapper.module.css";

export default function BlankWrapper({message, size, weight, height}) {

    const blankStyle = {
        fontSize : size + "px",
        fontWeight : weight,
    }
    const wrapperStyle = {
        height : height + "px",
    }
 
    return (
        <div style={wrapperStyle} className={styles.wrapper}>
            <span style={blankStyle} className={styles.message}>
                {message}
            </span>
        </div>
    )
}