'use client';

import { useEffect, useRef, useState } from "react";
import styles from "./Accounts.module.css";
import { FaSchool, FaXmark } from "react-icons/fa6";
import useDebounce from "@/hooks/useDebounce";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function SettingSchool({ name, address }) {

    const [open, setOpen] = useState(false);
    const router = useRouter();

    const openHandler = () => {
        setOpen(!open)
    }

    const [school, setSchool] = useState({ schoolName : '', schoolCode : '', schoolOffice : ''});

    const [schoolKeyword, setSchoolKeyword] = useState('');
    const [schoolList, setSchoolList] = useState([]);
    const debouncedQuery = useDebounce(schoolKeyword, 250);
    const searchInput = useRef();

    useEffect(() => {
        async function fetchRecommend() {
            const response = await axios.get(`/api/search/school?query=${debouncedQuery}`);
            setSchoolList(response.data);
        }   
        if (debouncedQuery && schoolKeyword.length > 0) fetchRecommend();
    }, [debouncedQuery]);

    const onSchoolSearchingHandler = (event) => {
        const keyword = event.target.value.replace(/\s/g, '')
        if(keyword === 0) {
            setSchoolList([]);
        }
        setSchoolKeyword(keyword);
        registerBtnHandler();
    }

    const selectSchool = (data) => {
        setSchoolKeyword('')
        setSchool({schoolName : data.SCHUL_NM || data.name, schoolCode : data.SD_SCHUL_CODE, schoolOffice : data.ATPT_OFCDC_SC_NM || "대안학교"});
        setSchoolList([]);
    }
    const cancelSelectSchool = () => {
        setSchool({ schoolName : '', schoolCode : '', schoolOffice : '' });
        registerBtnHandler();
        searchInput.current.focus();
    }
    const [ registerBtn, setRegisterBtn ] = useState(true);
    const registerBtnHandler = () => {
        if(school.schoolName) {
            setRegisterBtn(false);
        } else {
            setRegisterBtn(true)
        }
    }
    const cancelHandler = () => {
        setSchool({ schoolName : '', schoolCode : '', schoolOffice : '' });
        registerBtnHandler();
        setOpen(false);
    }
    useEffect(() => {
        registerBtnHandler();
    }, [school]);

    const changeHandler = () => {
        if(!school.schoolName) return;
        const data = {
            school : school,
        }
        axios.post('/api/accounts/school', data)
        .then((res) => {
            if(res.status === 500) {
                alert("오류 발생. 나중에 다시 시도해주세요")
            } else {
                cancelHandler();
                router.refresh();
            }
        })
    }

    return (
        <div className={`${styles.section} ${styles.school}`}>
            <div className={styles.schoolWrapper}>
                <div className={styles.schoolLogo}><FaSchool size={50}/></div>
                <div className={styles.schoolInfo}>
                    <span className={styles.schoolName}>{name}</span>
                    <span className={styles.schoolAddress}>{address}</span>
                </div>
                <div onClick={open ? cancelHandler : openHandler} className={styles.actionBtn}>
                    <span>{open ? "취소" : "학교 변경"}</span>
                </div>
            </div>
            <div className={`${styles.schoolInput} ${open && styles.open}`}>
                <div className={styles.schoolInputWrapper}>
                    <div className={styles.keywordInput}>
                        <input ref={searchInput} onChange={onSchoolSearchingHandler} disabled={school.schoolName && true} value={school.schoolName ? `${school.schoolName} (${school.schoolOffice})` : schoolKeyword} type="text" placeholder="학교를 입력해주세요" autoComplete="off" className={styles.inputBox}></input>
                        {school.schoolName && <button onClick={cancelSelectSchool} className={styles.cancelSchoolBtn}><FaXmark size={16} /></button>}
                    </div>                    
                    <div className={styles.schoolList}>
                        {schoolList?.map((e, i) => (
                            <div onClick={() => selectSchool(e)} key={i} className={styles.schoolItem}> 
                                <span className={styles.schoolTitle}>{e.SCHUL_NM || e.name} </span>
                                <span className={styles.schoolRegion}>{e.ATPT_OFCDC_SC_NM || "대안학교"}</span>
                            </div>
                        ))}
                    </div>
                    <div className={styles.footer}>
                        <span className={styles.infoMessage}>변경 후 6개월동안 다시 변경이 불가합니다 </span>
                        <button onClick={changeHandler} disabled={registerBtn} className={styles.actionBtn}>
                            <span>확인</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}