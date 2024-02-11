"use server";

import axios from "axios";
import styles from "./SchoolBoxList.module.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SchoolNoticeBox from "./Card/SchoolNoticeBox";
import SchoolLunchBox from "./Card/SchoolLunchBox";
import SchoolTimetableBox from "./Card/SchoolTimetableBox";

const fetchData = async () => {
    const userId = (await getServerSession(authOptions)).user.id;
    const response = await fetch(`${process.env.ABSOLUTE_URL}/api/my/${userId}/info/school`,  {method : 'GET'});
    return response.json();
}

export default async function SchoolBoxList() {

    const data = await fetchData();

    return (
        <div className={styles.list}>
            <div className={styles.wrapper}>
                <SchoolNoticeBox school={data} />
                <SchoolLunchBox />
                <SchoolTimetableBox />
            </div>
        </div>
    )
}