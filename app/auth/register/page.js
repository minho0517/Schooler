"use client"

import styles from "./register.module.css";
import Image from 'next/image';
import IntroImg from "@/public/image/schooler-logo-icon.png";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import AuthNumberBox from "@/components/Auth/AuthBox/AuthNumberBox";
import useDebounce from "@/hooks/useDebounce";
import { FaXmark } from "react-icons/fa6";
import { signIn } from "next-auth/react";

export default function Page() {

    const [section, setSection] = useState(0);
    
    const [email, setEmail] = useState({ value : '', vaildate : null });
    const [id, setId] = useState({ value : '', vaildate : null });
    const [pw, setPw] = useState({ value : '', vaildate : null });
    const [checkPw, setCheckPw] = useState({ value : '', vaildate : null });

    const [pwHidden, setPwHidden] = useState(true);
    const [submitBtn, setSubmitBtn] = useState(true);
    const [isSending, setIsSending] = useState(false);

    const [sendTime, setSendTime] = useState(new Date())

    const onIdHandler = (event) => {
        const regExp = /^[ㄱ-ㅎ가-힣a-zA-Z0-9]{4,}$/;
        setId({ value : event.target.value, vaildate : regExp.test(event.target.value) })
        submitBtnHandler();
    }
    const onPwHandler = (event) => {
        const regExp = /^.{6,}$/;
        setPw({ value : event.target.value, vaildate : regExp.test(event.target.value) });
        submitBtnHandler();
    }
    const onCheckPwHandler = (event) => {
        const isSame = event.target.value === pw.value ? true : false;
        setCheckPw({ value : event.target.value, vaildate : isSame });
        submitBtnHandler();
    }
    const onEmailHandler = (event) => {
        const regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
        setEmail({ value : event.target.value, vaildate : regExp.test(event.target.value) });
        submitBtnHandler();
    }
    const toggleHiddenHandler = () => {
        setPwHidden(!pwHidden)
    }
    const submitBtnHandler = () => {
        if(id.value && id.vaildate && pw.value && pw.vaildate && checkPw.value && checkPw.vaildate && email.value && email.vaildate) {
            setSubmitBtn(false)
        } else {
            setSubmitBtn(true)
        }
    }

    useEffect(() => {   
        submitBtnHandler();
    }, [id.vaildate, pw.vaildate, checkPw.vaildate, email.vaildate] )

    const sectionWrapper = useRef();
    const sectionItem = useRef();
    
    const nextBtn = () => {
        setIsSending(true)
        const data = {
            id : id.value,
            email : email.value,
        }
        axios.post('/api/auth/register', data)
        .then((res) => {
            if(res.data.success === false) {
                alert(res.data.msg)
                setIsSending(false)
            } else {
                setSendTime(new Date(res.data.createdAt))
                setIsSending(false)
                setSection(1)
            }
        });
    }

    const handleSize = () => {
        sectionWrapper.current.style.transform = `translateX(-${sectionItem.current.offsetWidth * section + 20 * section}px)`;
    }

    useEffect(() => {
        handleSize()
    }, [section]);

    useEffect(() => {
        handleSize()
        window.addEventListener("resize", handleSize);
        return () => {
            window.removeEventListener("resize", handleSize);
        };
    }, [section]);

    const [name, setName] = useState({value : '', vaildate : null});
    const onNameHandler = (event) => {
        const regExp = /^[가-힣]{2,4}$/;
        setName({ value : event.target.value, vaildate : regExp.test(event.target.value) });
    }

    const [school, setSchool] = useState({ schoolName : '', schoolCode : '', schoolOffice : ''});

    const [schoolKeyword, setSchoolKeyword] = useState('');
    const [schoolList, setSchoolList] = useState([]);
    const debouncedQuery = useDebounce(schoolKeyword, 250);

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
    const cancelSelectSchool = (event) => {
        setSchool({ schoolName : '', schoolCode : '', schoolOffice : '' });
        registerBtnHandler();
        event.target.parentNode.children[0].focus();
    }
    const [ registerBtn, setRegisterBtn ] = useState(true);
    const registerBtnHandler = () => {
        if(school.schoolName && name && name.vaildate) {
            setRegisterBtn(false);
        } else {
            setRegisterBtn(true)
        }
    }
    useEffect(() => {
        registerBtnHandler();
    }, [school, name.vaildate]);

    const [userData, setUserData] = useState(null);

    const [isRegistering, setIsRegistering] = useState(false);
    const register = () => {
        setIsRegistering(true);
        const data = {
            id : id.value,
            password : pw.value,
            email : email.value,
            name : name.value,
            school : school,
        }
        axios.post('/api/auth/signup', data)
        .then(async (res) => {
            setUserData(res.data);
            setSection(3);
            setIsRegistering(false);
            const response = await signIn("credentials", {
                id: data.id,
                password: data.password,
                redirect: false,
            });
        })
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <Image className={styles.logo} alt='logo' src={IntroImg}></Image>
            </div>
            <div className={styles.wrapper}>    
                <div ref={sectionWrapper} className={styles.section_wrapper}>                
                    <div ref={sectionItem} className={styles.section}>   
                        <div className={styles.inputGroup}>            
                            <div className={styles.inputWrapper}>
                                <input onChange={onIdHandler} disabled={section !== 0 && true} value={id.value} type="text" placeholder="아이디를 입력해주세요 (4자이상)" autoComplete="off" className={`${styles.inputBox} ${id.vaildate === false && styles.notValidate}`}></input>
                            </div>
                            <div className={styles.inputWrapper}>
                                <input onChange={onPwHandler} disabled={section !== 0 && true} value={pw.value} type={pwHidden ? "password" : "text"} placeholder="비밀번호를 입력해주세요 (6자 이상)" autoComplete="off" className={`${styles.inputBox} ${pw.vaildate === false && styles.notValidate}`}></input>
                            </div>
                            <div className={styles.inputWrapper}>
                                <input onChange={onCheckPwHandler} disabled={section !== 0 && true} value={checkPw.value} type={pwHidden ? "password" : "text"} placeholder="비밀번호를 확인해주세요" autoComplete="off" className={`${styles.inputBox} ${checkPw.vaildate === false && styles.notValidate}`}></input>
                            </div>
                            <div className={styles.inputWrapper}>
                                <input onChange={onEmailHandler} disabled={section !== 0 && true} value={email.value} type="email" placeholder="이메일을 입력해주세요" autoComplete="off" className={`${styles.inputBox} ${email.vaildate === false && styles.notValidate}`}></input>
                            </div>
                        </div>     
                        <button onClick={nextBtn} disabled={submitBtn || isSending} className={`${styles.submitBtn} ${submitBtn && styles.disabled}`}>{isSending ? <div className={styles.loader}></div> : "다음" }</button>
                    </div>        
                    <div className={styles.section}>
                        <AuthNumberBox email={email.value} sendTime={sendTime} nextSection={() => setSection(2)}/>
                    </div>
                    <div className={styles.section}>
                        <div className={styles.inputGroup}>            
                            <div className={styles.inputWrapper}>
                                <input onChange={onNameHandler} disabled={section !== 2 && true} value={name.value} type="text" placeholder="이름를 입력해주세요(본명)" autoComplete="off" className={`${styles.inputBox} ${name.vaildate === false && styles.notValidate}`}></input>
                            </div>
                            <div className={styles.inputWrapper}>
                                <div className={styles.schoolInput}>
                                    <input onChange={onSchoolSearchingHandler} disabled={school.schoolName && true} value={school.schoolName ? `${school.schoolName} (${school.schoolOffice})` : schoolKeyword} type="text" placeholder="학교를 선택해주세요" autoComplete="off" className={styles.inputBox}></input>
                                    {school.schoolName && <button onClick={cancelSelectSchool} className={styles.cancelSchoolBtn}><FaXmark size={16} /></button>}
                                </div>
                                <div className={styles.schoolList}>
                                    {schoolList?.map((e, i) => (
                                        <div onClick={() => selectSchool(e)} key={i} className={styles.schoolItem}> 
                                            <span className={styles.schoolName}>{e.SCHUL_NM || e.name} </span>
                                            <span className={styles.schoolRegion}>{e.ATPT_OFCDC_SC_NM || "대안학교"}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>     
                        <button onClick={register} disabled={registerBtn || isRegistering} className={`${styles.submitBtn} ${registerBtn && styles.disabled}`}>{isRegistering ? <div className={styles.loader}></div> : "회원가입" }</button>
                    </div>
                    <div className={`${styles.section} ${styles.lastSection}`}>
                        <h2 className={styles.welcomeTitle}><span>스쿨러</span>에 오신걸 환영합니다</h2>
                        <span className={styles.welcomeDes}>전국의 청소년들과 당신의 일상이나 고민을 나누어보세요</span>
                        <Link href="/" className={styles.submitBtn}>홈으로</Link>
                    </div>
                </div>
            </div>  
            <div className={styles.moveLink}>
                <span>이미 계정이 있으시다면?</span>
                <Link href="/auth/login">로그인하기</Link>
            </div>
        </div>
    )
}