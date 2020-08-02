// @flow

import {
    DEFAULT_BORDER_COLOR,
    HOVER_BORDER_COLOR,
    ERROR_COLOR,
    ICON_COLOR,
    WHITE,
    GREY,
} from 'crm-constants/jss/colors';
import { FONT_SIZE_SMALL } from 'crm-constants/jss/fonts';

const CRMInputStyles = ({ typography: { body2: { fontSize } }, spacing }: Object) => ({
    cssOutlinedInput: {
        '&:not(hover):not($disabled):not($cssFocused):not($error) $notchedOutline': {
            borderColor: DEFAULT_BORDER_COLOR,
        },
        '&:hover:not($disabled):not($cssFocused):not($error)': {
            borderColor: HOVER_BORDER_COLOR,
        },
        '&$cssFocused $notchedOutline': {
            border: `1px solid ${HOVER_BORDER_COLOR} !important`,
        },
        '&$error $notchedOutline': {
            borderColor: ERROR_COLOR,
        },
        '&$disabled $notchedOutline': {
            borderColor: DEFAULT_BORDER_COLOR,
        },
        'background': WHITE,
    },
    closeButton: {
        padding: spacing(0.5),
        marginRight: spacing(0.5),
    },
    notchedOutline: {},
    cssFocused: {},
    error: {
        paddingRight: spacing(3),
    },
    disabled: {},
    text: {
        marginTop: spacing(),
        marginLeft: 0,
        marginRight: 0,
        color: ERROR_COLOR,
    },
    inputField: {
        height: spacing(2),
        padding: spacing(1.5, 1),
        fontSize,
        '&:-webkit-autofill': {
            boxShadow: `0 0 0 ${spacing(12.5)}px white inset`,
        },
    },
    inputLabel: {
        fontSize,
        transform: `translate(${spacing(1)}px, ${spacing(1.75)}px) scale(1)`,
        color: `${GREY} !important`,
    },
    iconButton: {
        position: 'absolute',
        opacity: 0.5,
        right: 0,
        color: ICON_COLOR,
        cursor: 'pointer',
        '&:hover': {
            opacity: 1,
            backgroundColor: 'transparent',
        },
    },
    errorPopper: {
        '&$errorPopper': {
            padding: spacing(1),
            fontSize: FONT_SIZE_SMALL,
        },
    },
    errorIcon: {
        color: ERROR_COLOR,
    },
    errorIconMultiline: {
        top: 0,
    },
    errorMessage: {
        padding: spacing(0, 1, 1, 1),
        fontSize: spacing(1.5),
        color: ERROR_COLOR,
        position: 'absolute',
    },
    icon: {
        marginRight: spacing(1.5),
    },
    adornedEnd: {
        paddingRight: 0,
    },
    adornmentRoot: {
        marginLeft: 0,
    },
    loader: {
        transform: 'translateY(-100%)',
        background: 'transparent',
    },
});

export default CRMInputStyles;
