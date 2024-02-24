"use server"

import styles from "../accounts.module.css";
import SettingTextInput from "@/components/Accounts/SettingTextInput";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SettingSchool from "@/components/Accounts/SettingSchool";
import { GoBackHeader } from "@/components/Header/Top/TopHeader";

async function fetchData() {
    const _id = (await getServerSession(authOptions)).user.id
    const response = await fetch(`${process.env.ABSOLUTE_URL}/api/my/${_id}/info/profile`, {cache:"no-store"});
    const data = await response.json();
    const schoolInfo = await fetch(`${process.env.ABSOLUTE_URL}/api/search/schoolInfo?schoolCode=${data.school.schoolCode}`, {cache:"no-store"});
    const schoolData = await schoolInfo.json();
    return {
        ...data,
        school : {
            ...schoolData[0]
        }
    };
}

export default async function Page() {

    const data = await fetchData();

    return (
        <div className={styles.page}>
            <GoBackHeader title={"프로필 편집"} button={<span></span>} mobile={true}/>
            <div className={styles.wrapper}>
                <div className={styles.pageHeader}>
                    <h2 className={styles.pageTitle}>프로필 편집</h2>
                </div>
                <div className={styles.settingList}>
                    <SettingSchool name={data.school.SCHUL_NM} address={data.school.ORG_RDNMA}/>
                    <SettingTextInput title={"아이디"} initValue={data.id} regExp={"^[ㄱ-ㅎ가-힣a-zA-Z0-9]{4,}$"} />
                    <SettingTextInput title={"이메일"} initValue={data.email} disabled={true} />
                    <SettingTextInput title={"이름"} initValue={data.name} disabled={true}/>
                </div>
            </div>
        </div>
    )
}