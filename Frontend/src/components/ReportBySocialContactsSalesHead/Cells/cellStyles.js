// @flow

import { FONT_COLOR, UNDERLINE, ACTION_LABEL } from 'crm-constants/jss/colors';

export default ({
    spacing,
    typography: {
        fontSize,
        caption: { fontSize: smallFontSize },
    },
}: Object) => ({
    underlineName: {
        borderBottom: `1px dashed ${UNDERLINE}`,
        color: FONT_COLOR,
        cursor: 'pointer',
        display: 'inline-block',
        marginRight: spacing(2),
        fontSize,
        height: spacing(2.5),
        wordBreak: 'break-word',
        whiteSpace: 'pre-line',
    },
    link: {
        '&:hover': {
            textDecoration: 'underline',
        },
    },
    statusIcon: {
        marginRight: spacing(),
        opacity: 1,
    },
    actionUndo: {
        marginTop: spacing(1.5),
        marginBottom: spacing(-0.5),
    },
    undoButton: {
        'padding': 0,
        '&:hover': {
            backgroundColor: 'transparent',
            cursor: 'pointer',
        },
    },
    icon: {
        opacity: 1,
    },
    label: {
        marginTop: spacing(-1),
        fontSize: smallFontSize,
        color: ACTION_LABEL,
    },
});
