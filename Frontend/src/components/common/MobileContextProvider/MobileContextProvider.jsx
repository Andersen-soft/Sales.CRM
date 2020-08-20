// @flow

import React, { useEffect, useState, useContext } from 'react';
import { pathOr } from 'ramda';
import { MOBILE_BREAK_POINT, MOBILE_DEVICE_TYPE } from 'crm-constants/common/mobile/mobileConstants';
import detect from 'detect.js';

import type { Node } from 'react';

type Props = { children: Node }
type MobileContextType = {
    isMobile: boolean,
    deviceOs: string,
    setIsMobile: (any) => void,
};

const IsMobileContext = React.createContext < MobileContextType > ({
    isMobile: false,
    deviceOs: '',
    setIsMobile: () => {},
});

const isMobileCheck = (width: number, deviceType: string) => {
    if (deviceType === MOBILE_DEVICE_TYPE) {
        return true;
    }

    return width <= MOBILE_BREAK_POINT;
};

export const MobileContextProvider = ({ children, ...props }: Props) => {
    const userAgent = detect.parse(navigator.userAgent);
    const deviceType = userAgent.device.type;
    const deviceOs = userAgent.os.family;

    const clientWidth = pathOr(MOBILE_BREAK_POINT, ['documentElement', 'clientWidth'], document);
    const [isMobile, setIsMobile] = useState(isMobileCheck(clientWidth, deviceType));

    const onOrientationChange = () => {
        const currentWidth = pathOr(MOBILE_BREAK_POINT, ['documentElement', 'clientWidth'], document);

        setIsMobile(isMobileCheck(currentWidth, deviceType));
    };

    useEffect(() => {
        window.addEventListener('orientationchange', onOrientationChange);
        return () => window.removeEventListener('orientationchange', onOrientationChange);
    }, []);

    return <IsMobileContext.Provider value={{ isMobile, deviceOs, setIsMobile }} {...props}>
        {children}
    </IsMobileContext.Provider>;
};

export const useMobile = () => {
    const { isMobile } = useContext(IsMobileContext);

    return isMobile;
};

export const useSetIsMobile = () => {
    const { setIsMobile } = useContext(IsMobileContext);

    return setIsMobile;
};

export const useMobilePlatform = () => {
    const { deviceOs } = useContext(IsMobileContext);

    return deviceOs;
};
