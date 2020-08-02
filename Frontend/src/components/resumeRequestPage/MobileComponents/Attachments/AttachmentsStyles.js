// @flow

import {
    FONT_COLOR,
    UNDERLINE,
    ACTION_LABEL,
    LINK_COLOR,
} from 'crm-constants/jss/colors';

const AttachmentsStyles = ({
    spacing,
    typography: {
        fontWeightLight,
        caption: { lineHeight, fontSize: smallFontSize },
        fontSize,
    },
}: Object) => ({
    filesContainer: {
        padding: spacing(2, 1, 0, 1),
    },
    title: {
        fontSize: smallFontSize,
        marginRight: spacing(),
        color: ACTION_LABEL,
        lineHeight,
        fontWeight: 'normal',
    },
    user: {
        marginTop: spacing(2),
    },
    userInformation: {
        borderBottom: `1px dashed ${UNDERLINE}`,
        color: FONT_COLOR,
        cursor: 'pointer',
        width: 'max-content',
        marginRight: spacing(2),
        fontSize,
        marginTop: spacing(0.5),
    },
    dotMenu: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
    file: {
        padding: spacing(2),
        boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
        borderRadius: spacing(),
        marginBottom: spacing(),
        position: 'relative',
    },
    fileName: {
        fontSize,
        'fontWeight': fontWeightLight,
        'display': 'inline-block',
        'textOverflow': 'ellipsis',
        'overflow': 'hidden',
        'whiteSpace': 'nowrap',
        'width': '95%',
        '& a': {
            color: LINK_COLOR,
        },
    },
    fileDate: {
        fontSize,
        color: FONT_COLOR,
        fontWeight: fontWeightLight,
        marginTop: spacing(0.5),
    },
    emptyBlock: {
        fontSize,
    },
});

export default AttachmentsStyles;
