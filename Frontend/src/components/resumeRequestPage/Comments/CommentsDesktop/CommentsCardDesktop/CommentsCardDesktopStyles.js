// @flow

import { COMMENT_BACKGROUND, GREY } from 'crm-constants/jss/colors';

const CommentsCardDesktopStyles = ({
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
        marginTop: spacing(),
        padding: spacing(),
        backgroundColor: COMMENT_BACKGROUND,
        borderRadius: spacing(),
    },
    userName: {
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
    dateTime: {
        fontSize: fontSize12,
        lineHeight: spacing(0.25),
        marginRight: spacing(3),
    },
    descriptionContainer: {
        paddingTop: spacing(1.75),
        whiteSpace: 'pre-wrap',
    },
    description: {
        fontSize,
        fontWeight: fontWeightLight,
        lineHeight: lineHeight143,
    },
});

export default CommentsCardDesktopStyles;
