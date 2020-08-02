// @flow

import {
    FONT_FAMILY_PRIMARY,
    FONT_SIZE_H1,
    FONT_SIZE_H2,
    FONT_SIZE_H3,
    FONT_SIZE_H4,
    FONT_SIZE_H5,
    FONT_SIZE_H6,
    FONT_SIZE_NORMAL,
    FONT_SIZE_SMALL,
} from 'crm-constants/jss/fonts';

const common = {
    centerVerticalHorizontal: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
    },
    hide: {
        display: 'none',
    },
    h1: {
        fontSize: FONT_SIZE_H1,
        fontFamily: FONT_FAMILY_PRIMARY,
    },
    h2: {
        fontSize: FONT_SIZE_H2,
        fontFamily: FONT_FAMILY_PRIMARY,
    },
    h3: {
        fontSize: FONT_SIZE_H3,
        fontFamily: FONT_FAMILY_PRIMARY,
    },
    h4: {
        fontSize: FONT_SIZE_H4,
        fontFamily: FONT_FAMILY_PRIMARY,
    },
    h5: {
        fontSize: FONT_SIZE_H5,
        fontFamily: FONT_FAMILY_PRIMARY,
    },
    h6: {
        fontSize: FONT_SIZE_H6,
        fontFamily: FONT_FAMILY_PRIMARY,
    },
    textSmall: {
        fontSize: FONT_SIZE_SMALL,
        fontFamily: FONT_FAMILY_PRIMARY,
    },
    textNormal: {
        fontSize: FONT_SIZE_NORMAL,
        fontFamily: FONT_FAMILY_PRIMARY,
    },
    noPadding: {
        padding: 0,
    },
    capitalize: {
        textTransform: 'capitalize',
    },
};

export default common;
