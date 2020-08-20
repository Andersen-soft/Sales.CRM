// @flow

import { HEADER_CELL, ERROR_COLOR } from 'crm-constants/jss/colors';

const CommentsEditMobileStyles = ({
    spacing,
    typography: {
        fontSize,
        fontWeightLight,
        caption: {
            fontSize: fontSize12,
        },
        body2: {
            lineHeight: lineHeight143,
        },
    },
}: Object) => ({
    container: {
        paddingTop: spacing(1.25),
        flex: 'none',
    },
    inputWrapper: {
        position: 'relative',
    },
    inputLabel: {
        fontSize,
        opacity: 0.4,
        transform: 'translate(8px, 14px) scale(1)',
    },
    inputTextarea: {
        padding: spacing(0.5, 0),
        fontSize,
        fontWeight: fontWeightLight,
        lineHeight: lineHeight143,
    },
    rootIcon: {
        marginLeft: spacing(1.5),
        padding: spacing(0.75, 0),
        '&:hover': {
            background: 'none',
        },
        '& svg': {
            height: spacing(3.8),
            width: 'auto',
        },
    },
    message: {
        fontSize: fontSize12,
        color: HEADER_CELL,
        opacity: 0.8,
        marginTop: spacing(),
    },
    messageError: {
        fontSize: fontSize12,
        color: ERROR_COLOR,
        opacity: 0.8,
        marginTop: spacing(),
    },

});

export default CommentsEditMobileStyles;
