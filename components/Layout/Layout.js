"use client";

import styles from "./Layout.module.css";
import Header from '@/components/Header/Header';
import { usePathname } from "next/navigation";
import MoblieHeader from "../Header/Mobile/Header";

export default function Layout({children}) {

    const pathname = usePathname();
    
    return (
        <>  
            {pathname.includes('/auth') ?
            <>{children}</> :
            <>
            <Header />
            <MoblieHeader />
            <div className={styles.page}>
                <div className={styles.wrapper}>
                    {children}
                </div>
            </div>
            </>}
        </>

    )
}