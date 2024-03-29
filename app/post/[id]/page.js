import PostMain from "@/components/Post/Main/PostMain";
import styles from "./post.module.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import PostComment from "@/components/Post/Comment/PostComment";
import OpenSharingCard from "@/components/OpenSharing/Card/OpenSharingCard";
import { BlankTopHeader, GoBackHeader } from "@/components/Header/Top/TopHeader";
import { notFound } from "next/navigation";
import MoblieOpenSharingCard from "@/components/OpenSharing/Card/OpenSharingCard.mobile";
import PostRecommand from "@/components/Post/Recommand/PostRecommand";

export async function fetchData(id) {
    const user = (await getServerSession(authOptions))?.user.id;
    const response = await fetch(`${process.env.ABSOLUTE_URL}/api/post/${id}?user=${user ? user : "none"}` , { cache : 'no-store', method : "GET"})
    const data = await response.json();
    if(data.status === 404) {
        notFound();
    } else if(response.status === 401) {
        new Error('권한이 없습니다')
    } else {
        return data;
    }
}  

export async function generateMetadata({ params : {id} } ) {
   
    const data = await fetchData(id);
   
    return {
        title: "스쿨러 | " + data.data.topic + " - " + data.data.title,
        openGraph: {
        title: "스쿨러 | " + data.data.topic + " - " + data.data.title,
        description: '청소년을 위한 커뮤니티 플랫폼',
        siteName: "스쿨러 | " + data.data.topic + " - " + data.data.title,
        type: 'website',
        locale: 'ko-KR',
        },
    }
}
   

export default async function Page({params : {id}}) {

    const data = await fetchData(id);
      
    return (
        <div className={styles.page}>
            <BlankTopHeader />
            <div className={styles.wrapper}>
                <div className={styles.main}>
                    <PostMain data={data.data} countTotal={data.totalComments} isLiked={data.isLiked} isBookmark={data.isBookmark} />
                    {data.data.livechat && <div className={`${styles.livechatCard} ${styles.mobile}`}>
                        <MoblieOpenSharingCard roomId={data.data._id} countMember={data.countMember} />
                    </div>}
                    <PostComment countTotal={data.totalComments} countRecomments={data.totalRecomments}  postId={id}/>
                    <PostRecommand currentId={data.data._id} topic={data.data.topic} scope={data.data.scope}/>
                </div>
                <div className={styles.livechatCard}>
                    <OpenSharingCard data={{ isActive : data.data.livechat, roomId : data.data._id, countMember : data.countMember}} />
                </div>
            </div>
        </div>
    )
}