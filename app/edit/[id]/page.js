import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Writing from "@/components/Writing/Writing"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation";


const fetchData = async (id) => {
    const user = (await getServerSession(authOptions)).user.id;
    const response = await fetch(`${process.env.ABSOLUTE_URL}/api/share?post=${id}&user=${user}`, {method:"GET", cache : "no-cache" })
    const data = response.json();
    return data;
}

export default async function Page({params : {id}}) {

    const prevData = await fetchData(id);

    if(prevData.status === 400) {
        alert(prevData.msg);
        redirect('/');
    } 

    return (
        <Writing data={prevData} />
    )
}