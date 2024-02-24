"use client"

import styles from "./ProfileBtn.module.css"
import useModal from "@/hooks/useModal";
import { createPortal } from "react-dom";
import MenuModal from "@/components/Utils/Modal/MenuModal";
import { FaGear } from "react-icons/fa6";
import { signOut } from "next-auth/react";

export default function ProfileBtn() {

    const { modal, modalHandler, portalElement } = useModal();

    const logoutHandler = async () => {
        const data = await signOut({redirect: false, callbackUrl: "/"})   
        location.replace('/auth/login')
    }

    const modalMenu = [
        { title : "설정", component : "link", link : `/accounts`}, 
        { title : "로그아웃", component : "button", handler : logoutHandler}, 
    ];

    return (
        <>  
            <button onClick={modalHandler} className={styles.settingBtn}><FaGear size={25}/></button>
            {modal && createPortal(<MenuModal menuList={modalMenu} cancel={modalHandler} />, portalElement)}
        </>
    )
}