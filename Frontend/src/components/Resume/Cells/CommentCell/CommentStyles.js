// @flow

import { ICON_COLOR, ACTION_LABEL } from 'crm-constants/jss/colors';
import { MESSAGE_MAX_HEIGHT } from 'crm-constants/reportBySocialContactsPage/socialContactsConstants';

const CommentStyles = ({
    spacing,
    typography: {
        fontSize,
        caption: { fontSize: smallFontSize },
    },
}: Object) => ({
    fullCommentCell: {
        fontSize: smallFontSize,
        lineHeight: '14px',
        wordBreak: 'break-word',
        whiteSpace: 'pre-line',
    },
    smallCell: {
        height: MESSAGE_MAX_HEIGHT,
        overflow: 'hidden',
        fontSize: smallFontSize,
        lineHeight: '14px',
        wordBreak: 'break-word',
        whiteSpace: 'pre-line',
    },
    showLabel: {
        fontSize: smallFontSize,
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
    cell: {
        fontSize,
        wordBreak: 'break-word',
        whiteSpace: 'pre-line',
    },
    textAreaInput: {
        fontSize: smallFontSize,
        minHeight: spacing(3),
    },
    editableCell: {
        fontSize,
        '& button': {
            opacity: 0,
            padding: 0,
            paddingLeft: spacing(),
        },
        '&:hover': {
            '& button': {
                'opacity': 0.5,
                '&:hover': {
                    cursor: 'pointer',
                    background: 'none',
                    opacity: 1,
                },
            },
        },
    },
});

export default CommentStyles;
