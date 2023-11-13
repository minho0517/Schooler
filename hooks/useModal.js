"use client";

import { useEffect, useState } from "react";

export default function useModal(component) {
    const [modal, setModal] = useState(false);
    const [portalElement, setPortalElement] = useState(null);

    useEffect(() => {
        setPortalElement(document.getElementById("portal"));
    }, [modal]);

    const modalHandler = () => {
        setModal(!modal);
    };

    return {modal, portalElement, modalHandler};
}
