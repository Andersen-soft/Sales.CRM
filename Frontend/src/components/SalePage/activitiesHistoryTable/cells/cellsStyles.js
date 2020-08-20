// @flow

import {
    FONT_COLOR,
    ACTION_LABEL,
    UNDERLINE,
    ICON_COLOR,
    ERROR_COLOR,
} from 'crm-constants/jss/colors';
import { COMMENT_MAX_HEIGHT } from './CommentCell';

const cellsStyles = ({
    spacing,
    typography: {
        fontSize,
        caption: { fontSize: smallFontSize, lineHeight },
        subtitle1: { lineHeight: subLineHeight },
    },
}: Object) => ({
    cell: {
        fontSize,
        wordBreak: 'break-word',
        whiteSpace: 'pre-line',
    },
    smallCell: {
        height: COMMENT_MAX_HEIGHT,
        overflow: 'hidden',
        fontSize: smallFontSize,
        lineHeight: '12px',
        paddingTop: spacing(),
        marginBottom: spacing(),
        wordBreak: 'break-word',
        whiteSpace: 'pre-line',
    },
    fullCommentCell: {
        fontSize: smallFontSize,
        lineHeight: '12px',
        wordBreak: 'break-word',
        whiteSpace: 'pre-line',
        paddingTop: spacing(),
        paddingBottom: spacing(),
    },
    showLabel: {
        fontSize: smallFontSize,
        paddingTop: spacing(),
        paddingBottom: spacing(),
        color: ACTION_LABEL,
        lineHeight: spacing(0.25),
        cursor: 'pointer',
    },
    dropDownIcon: {
        marginLeft: spacing(0.5),
        width: spacing(3),
        height: spacing(3),
        position: 'absolute',
        color: ICON_COLOR,
        opacity: 0.5,
    },
    closeIcon: {
        transform: 'rotate(180deg)',
    },
    fullWidth: {
        width: 'max-content',
    },
    fullName: {
        borderBottom: `1px dashed ${UNDERLINE}`,
        color: FONT_COLOR,
        cursor: 'pointer',
        display: 'inline-block',
        marginRight: spacing(2),
        fontSize,
    },
    openListIcon: {
        padding: 0,
    },
    listPaper: {
        padding: spacing(),
    },
    removed: {
        color: ICON_COLOR,
        opacity: 0.4,
    },
    icon: {
        '&:hover': {
            opacity: 0.5,
        },
    },
    activityType: {
        'fontSize': smallFontSize,
        lineHeight,
        'padding': spacing(0.5, 0),
        '& svg': {
            paddingRight: spacing(0.5),
            height: spacing(2.5),
        },
    },
    dateOfActivity: {
        fontSize,
        lineHeight: subLineHeight,
    },
    textAreaInput: {
        fontSize,
    },
    dateInput: {
        padding: spacing(1.5, 0, 0.5, 0),
        width: spacing(14),
        color: `${FONT_COLOR} !important`,
        textAlign: 'center',
    },
    menuButton: {
        padding: 0,
    },
    errorMessage: {
        fontSize: 10,
        color: ERROR_COLOR,
    },
});

export default cellsStyles;
