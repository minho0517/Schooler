import styles from "./Loader.module.css";

export default function Loader({size, border}) {

    const loaderStyle = {
        width : size + "px",
        height : size + "px",
        borderWidth : border + "px",
    }

    return (
        <span style={loaderStyle} className={styles.loader}></span>
    )
}