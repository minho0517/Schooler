import styles from "./tag.module.css";
import TagNav from "@/components/Navbar/Tag/TagNav";
import TagSharingList from "@/components/TagSharing/TagSharingList";

async function fetchData(tag) {
    const response = await fetch(`${process.env.ABSOLUTE_URL}/api/sharing/tag/${tag}/count`, {cache : "no-store"});
    const data = response.json();
    return data;
}

export default async function Page({params}) {

    const tag = decodeURI(params.tag);

    const tagCount = await fetchData(tag);

    return (
        <div className={styles.page}>
            <div className={styles.wrapper}>
                <TagNav tag={tag} count={tagCount}/>
                <TagSharingList tag={tag} />
            </div>
        </div>
    )
}