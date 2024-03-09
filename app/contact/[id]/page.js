import ChatBox from "@/components/Contact/ChatBox/ChatBox";
import styles from "./contact.module.css"
import ChatHeader from "@/components/Contact/Header/ChatHeader";

export async function fetchData(id) {
    const response = await fetch(`${process.env.ABSOLUTE_URL}/api/contact/${id}` , { cache : 'no-store', method : "GET"});
    const data = await response.json();
    if(response.status === 404) {
        notFound();
    } else if(response.status === 401) {
        new Error('권한이 없습니다')
    }
    return data;
}

export async function generateMetadata({ params : {id} } ) {
   
    const data = await fetchData(id);
   
    return {
        title: "스쿨러 | 오픈셰어링" + " - " + data.opensharing.title,
        openGraph: {
        title: "스쿨러 | 오픈셰어링" + " - " + data.opensharing.title,
        description: '청소년을 위한 커뮤니티 플랫폼',
        siteName: "스쿨러 | 오픈셰어링" + " - " + data.opensharing.title,
        type: 'website',
        locale: 'ko-KR',
        },
    }
}
   

export default async function Page({ params : {id} }) {

    const data = await fetchData(id);

    return (
        <div className={styles.page}>
            <div className={styles.wrapper}>
                <ChatHeader data={data} id={id} />
                <ChatBox id={id} />
            </div>
        </div>
    )
}