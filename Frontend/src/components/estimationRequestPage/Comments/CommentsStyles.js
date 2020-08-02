// @flow

import {
    COMMENT_BACKGROUND,
    GREY,
    HEADER_CELL,
    ERROR_COLOR,
} from 'crm-constants/jss/colors';

const CommentsStyles = ({
    spacing,
    typography: {
        fontSize,
        fontWeightLight,
        caption: {
            lineHeight,
            fontSize: fontSize12,
        },
        body2: {
            lineHeight: lineHeight143,
        },
    },
}: Object) => ({
    paperRoot: {
        padding: 0,
        height: '100%',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    container: {
        minHeight: '100%',
        maxHeight: spacing(57.625),
    },
    commentsBlock: {
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: spacing(0, 2),
        flex: 1,
    },
    comment: {
        marginTop: spacing(2),
        padding: spacing(),
        backgroundColor: COMMENT_BACKGROUND,
        borderRadius: spacing(),
    },
    fullName: {
        fontSize,
        lineHeight,
        borderBottom: `1px dashed ${GREY}`,
        cursor: 'pointer',
        display: 'inline-block',
    },
    edited: {
        fontSize: fontSize12,
        lineHeight: spacing(0.25),
        paddingRight: spacing(2),
    },
    dateOfCreate: {
        fontSize: fontSize12,
        lineHeight: spacing(0.25),
        marginRight: spacing(3),
    },
    descriptionBlock: {
        paddingTop: spacing(1.75),
        whiteSpace: 'pre-wrap',
    },
    descriptionText: {
        fontSize,
        fontWeight: fontWeightLight,
        lineHeight: lineHeight143,
    },
    inputWrapper: {
        position: 'relative',
    },
    editBlock: {
        padding: spacing(2),
        flex: 'none',
        height: spacing(14.5),
    },
    iconRoot: {
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
    hidden: {
        visibility: 'hidden',
    },
    spinnerWrapper: {
        height: '100%',
    },
    bottomRow: {
        marginTop: spacing(),
        alignItems: 'flex-start',
    },
    inputLabel: {
        fontSize,
        opacity: 0.4,
        transform: 'translate(10px, 12px) scale(1)',
    },
    inputTextArea: {
        paddingRight: spacing(6),
    },
    commentMessage: {
        fontSize: fontSize12,
        color: HEADER_CELL,
        opacity: 0.8,
    },
    commentError: {
        color: ERROR_COLOR,
        textAlign: 'left',
    },
    list: {
        outline: 'none',
    },
    commentField: {
        '& div': {
            padding: spacing(),
        },
    },
});

export default CommentsStyles;
