// @flow

import {
    BLOCK_BORDER,
    FONT_COLOR,
    ICON_COLOR,
    UNDERLINE,
    ACTION_LABEL,
} from 'crm-constants/jss/colors';

const ResumeStyles = ({
    spacing,
    typography: {
        fontWeightLight,
        caption: { lineHeight, fontSize: smallFontSize },
        fontSize,
    },
}: Object) => ({
    container: {
        padding: spacing(2, 1, 0, 1),
    },
    resumeItem: {
        boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
        marginBottom: spacing(),
        borderRadius: spacing(),
        padding: spacing(2),
        position: 'relative',
    },
    fio: {
        fontWeight: 'normal',
        color: FONT_COLOR,
        lineHeight: '180%',
    },
    title: {
        fontSize: smallFontSize,
        marginRight: spacing(),
        color: ACTION_LABEL,
        lineHeight,
        fontWeight: 'normal',
    },
    status: {
        marginTop: spacing(),
        fontSize,
        fontWeight: fontWeightLight,
    },
    responsible: {
        marginTop: spacing(),
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
    attachIcon: {
        '& svg': {
            transform: 'rotate(-30deg)',
        },
    },
    pagination: {
        textAlign: 'center',
        boxShadow: 'unset',
        marginBottom: spacing(2),
        border: BLOCK_BORDER,
    },
    resumeAttachmentsContainer: {
        'position': 'absolute',
        'top': `${spacing(17)}px !important`,
        'width': '100%',
        'height': '100%',
        'borderRadius': 'unset',
        'paddingBottom': spacing(22),
        'boxShadow': 'inset 0px 8px 8px rgba(0, 0, 0, 0.02)',
        '&:focus': {
            outline: 'none',
        },
    },
    scrollContainer: {
        overflowY: 'auto',
        height: '100%',
        padding: spacing(0, 1),
    },
    exitButton: {
        color: ICON_COLOR,
        opacity: 0.5,
        transform: 'scale(0.75)',
    },
    attachmentsTitle: {
        fontSize,
    },
    name: {
        padding: spacing(1, 0, 2, 1),
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
        fontWeight: fontWeightLight,
        display: 'inline-block',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        maxWidth: spacing(36),
    },
    fileDate: {
        fontSize,
        color: FONT_COLOR,
        fontWeight: fontWeightLight,
        marginTop: spacing(),
    },
    emptyBlock: {
        fontSize,
    },
    attachmentTitleRow: {
        marginTop: spacing(),
    },
    row: {
        marginTop: spacing(4),
    },
    buttonWrapper: {
        marginRight: spacing(),
    },
});

export default ResumeStyles;
