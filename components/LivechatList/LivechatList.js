"use client"; 

import { Swiper, SwiperSlide } from 'swiper/react';
import styles from './LivechatList.module.css';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, HashNavigation } from "swiper/modules"
import LivechatCard from '../Card/Livechat/LivechatCard';

export default function LivechatList({buttonGroup}) {

    return (
        <div className={styles.list}>
            <Swiper className={styles.wrapper} speed={500} modules={[Navigation, HashNavigation]} spaceBetween={20} slidesPerGroup={3} slidesPerView={3} mousewheel={true}
            breakpoints={{
                0: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                    spaceBetween: 20,
                },
                640: {
                  slidesPerView: 1,
                  slidesPerGroup: 1,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 2,
                  slidesPerGroup: 2,
                  spaceBetween: 20,
                },
                1000: {
                  slidesPerView: 3,
                  slidesPerGroup: 3,
                  spaceBetween: 20,
                },
            }}
            navigation={{
                prevEl : buttonGroup.prev.current,
                nextEl : buttonGroup.next.current,
            }}
            hashNavigation={{
                watchState: true,
            }}
            onSwiper={(swiper) => {
                setTimeout(() => {
                    swiper.params.navigation.prevEl = buttonGroup.prev.current;
                    swiper.params.navigation.nextEl = buttonGroup.next.current;
                    swiper.navigation.destroy();
                    swiper.navigation.init();
                    swiper.navigation.update()
                });
            }}>
                <SwiperSlide className={styles.card}><LivechatCard /></SwiperSlide>
                <SwiperSlide className={styles.card}><LivechatCard /></SwiperSlide>
                <SwiperSlide className={styles.card}><LivechatCard /></SwiperSlide>
                <SwiperSlide className={styles.card}><LivechatCard /></SwiperSlide>
                <SwiperSlide className={styles.card}><LivechatCard /></SwiperSlide>
                <SwiperSlide className={styles.card}><LivechatCard /></SwiperSlide>
                <SwiperSlide className={styles.card}><LivechatCard /></SwiperSlide>
            </Swiper>
        </div>
    )
}