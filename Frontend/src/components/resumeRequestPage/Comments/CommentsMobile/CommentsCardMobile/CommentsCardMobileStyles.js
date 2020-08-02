// @flow

import { COMMENT_BACKGROUND, GREY, HEADER_CELL } from 'crm-constants/jss/colors';

const CommentsCardMobileStyles = ({
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
    container: {
        position: 'relative',
        marginBottom: spacing(),
        padding: spacing(1),
        borderRadius: spacing(),
        backgroundColor: COMMENT_BACKGROUND,
    },
    dateTime: {
        fontSize: fontSize12,
        lineHeight: spacing(0.25),
        color: HEADER_CELL,
    },
    edited: {
        fontSize: fontSize12,
        lineHeight: spacing(0.25),
    },
    dotMenu: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
    userName: {
        display: 'inline-block',
        marginTop: spacing(0.75),
        marginBottom: spacing(),
        borderBottom: `1px dashed ${GREY}`,
        fontSize,
        lineHeight,
        cursor: 'pointer',
    },
    description: {
        fontSize,
        fontWeight: fontWeightLight,
        lineHeight: lineHeight143,
        whiteSpace: 'pre-wrap',
    },
});

export default CommentsCardMobileStyles;
