"use client"

import { allowScroll, preventScroll } from "@/utils/scrollControl";
import { useEffect } from "react";

const usePreventScroll = () => {
    useEffect(() => {
        const prevScrollY = preventScroll();
        return () => {
            allowScroll(prevScrollY);
        };
    }, []);
};

export default usePreventScroll;