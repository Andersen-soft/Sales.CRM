// @flow

import { HEADER_CELL, ERROR_COLOR } from 'crm-constants/jss/colors';

const CommentsEditDesktopStyles = ({
    spacing,
    typography: {
        fontSize,
        caption: {
            fontSize: fontSize12,
        },
    },
}: Object) => ({
    hidden: {
        visibility: 'hidden',
    },
    container: {
        padding: spacing(2),
        flex: 'none',
        height: spacing(14.5),
    },
    inputWrapper: {
        position: 'relative',
    },
    inputLabel: {
        fontSize,
        opacity: 0.4,
        transform: 'translate(10px, 12px) scale(1)',
    },
    inputTextarea: {
        paddingRight: spacing(6),
    },
    rootIcon: {
        position: 'absolute',
        top: spacing(1.75),
        right: spacing(1.5),
        padding: 0,
        marginRight: spacing(),
        '&:hover': {
            background: 'none',
        },
        '& svg': {
            height: spacing(3.8),
            width: 'auto',
        },
    },
    bottomRow: {
        marginTop: spacing(),
    },
    message: {
        fontSize: fontSize12,
        color: HEADER_CELL,
        opacity: 0.8,
    },
    messageError: {
        color: ERROR_COLOR,
        textAlign: 'left',
    },
    commentField: {
        '& div': {
            padding: spacing(),
        },
    },
});

export default CommentsEditDesktopStyles;
