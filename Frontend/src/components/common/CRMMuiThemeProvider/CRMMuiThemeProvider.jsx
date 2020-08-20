// @flow

import React, { useMemo } from 'react';

import { ThemeProviderProps } from 'styled-components';
import { MuiThemeProvider } from '@material-ui/core/styles';

import { useMobile } from '../MobileContextProvider/MobileContextProvider';

const CRMMuiThemeProvider = ({ theme, children, ...rest }:ThemeProviderProps) => {
    const isMobile = useMobile();

    const adaptiveTheme = useMemo(() => {
        const newTheme = { ...theme };

        newTheme.isMobile = isMobile;
        newTheme.mixins = {
            ...theme.mixins,
            mobile: (styles?: Object) => (isMobile ? ({
                ...styles,
            }) : {}),
        };

        return newTheme;
    }, [isMobile]);


    return (<MuiThemeProvider theme={adaptiveTheme} {...rest}>{children}</MuiThemeProvider>);
};

export default CRMMuiThemeProvider;
