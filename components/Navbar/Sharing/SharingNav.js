"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./SharingNav.module.css";
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SharingNav({type}) {

    const pathname = usePathname();

    const [currentSlide, setCurrentSlide] = useState(0);
    const [totalSlide, setTotalSlide] = useState()
    const [perSlide, setPerSlide] = useState()
    const slideRef = useRef(null);
    const wrapperRef = useRef(null);
    const nextBtn = useRef(null);
    const prevBtn = useRef(null)

    const handleResize = () => {
        const slideNum = Math.ceil((slideRef.current.offsetWidth) / (wrapperRef.current.offsetWidth) - 1);
        setTotalSlide(slideNum);
        setPerSlide(wrapperRef.current.offsetWidth)
    }    

    const currentBtn = () => {
        if (matchMedia("screen and (max-width: 450px)").matches) {
            nextBtn.current.style.display = 'none';
            prevBtn.current.style.display = 'none';
        } else {
            if(wrapperRef.current.offsetWidth < slideRef.current.offsetWidth) {
                if(currentSlide === 0) {
                    nextBtn.current.style.display = 'flex';
                    prevBtn.current.style.display = 'none';
                } else if(currentSlide === totalSlide) {
                    nextBtn.current.style.display = 'none';
                    prevBtn.current.style.display = 'flex';
                } else if(currentSlide !== 0 && totalSlide) {
                    nextBtn.current.style.display = 'flex';
                    prevBtn.current.style.display = 'flex';
                }
            } else {
                nextBtn.current.style.display = 'none';
                prevBtn.current.style.display = 'none';
            }
        }
    }
    
    const NextSlide = () => {
        setCurrentSlide(currentSlide + 1);
    };
    const PrevSlide = () => {
        setCurrentSlide(currentSlide - 1);
    };

    useEffect(() => {
        handleResize();
    }, [])

    useEffect(() => {
        handleResize();
        currentBtn()
        if(currentSlide !== 0 && currentSlide !== totalSlide) {
            slideRef.current.style.transform = `translateX( -${perSlide * currentSlide - 150}px)`;
        } else if(currentSlide === 0) {
            slideRef.current.style.transform = `translateX(0)`;
        } else if(currentSlide === totalSlide) {
            slideRef.current.style.transform = `translateX( -${slideRef.current.offsetWidth - perSlide}px)`;
        }
        window.addEventListener("resize", handleResize);
        window.addEventListener("resize", () => {
            setCurrentSlide(0);       
        });
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [ totalSlide, currentSlide, perSlide]);

    const links = require('/public/data/topic.json');


    return (
        <div className={`${styles.slider} ${styles.topics}`} ref={wrapperRef}>
            <div className={`${styles.slide_wrapper} ${styles.topics_wrapper}`} ref={slideRef}>
                {links.map((link) => (
                    <Link key={link.title} href={`/sharing/${type}/${link.title}`} className={`${styles.topic} ${decodeURI(pathname) === `/sharing/${type}/${link.title}` ? styles.active : ""}`}>{link.title}</Link>
                ))}
            </div>
            <div className={styles.slideBtn} id={styles.prev} ref={prevBtn}><button onClick={PrevSlide}><FaAngleLeft size={20} /></button></div>
            <div className={styles.slideBtn} id={styles.next} ref={nextBtn}><button onClick={NextSlide}><FaAngleRight size={20} /></button></div>
        </div>
    )
}