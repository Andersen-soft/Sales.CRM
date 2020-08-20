// @flow

import {
    BLOCK_BORDER,
    FONT_COLOR,
    UNDERLINE,
    ACTION_LABEL,
} from 'crm-constants/jss/colors';

const HistoryStyles = ({
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
    historyItem: {
        boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
        marginBottom: spacing(),
        borderRadius: spacing(),
        padding: spacing(2),
        position: 'relative',
    },
    date: {
        fontSize: smallFontSize,
        color: ACTION_LABEL,
    },
    userInformation: {
        borderBottom: `1px dashed ${UNDERLINE}`,
        color: FONT_COLOR,
        cursor: 'pointer',
        display: 'inline-block',
        marginRight: spacing(2),
        fontSize,
        marginTop: spacing(0.5),
    },
    title: {
        fontSize: smallFontSize,
        marginRight: spacing(),
        color: ACTION_LABEL,
        lineHeight,
        fontWeight: 'normal',
    },
    event: {
        marginTop: spacing(1.5),
    },
    description: {
        fontSize,
        lineHeight,
        color: FONT_COLOR,
        fontWeight: fontWeightLight,
    },
    pagination: {
        textAlign: 'center',
        boxShadow: 'unset',
        marginBottom: spacing(2),
        border: BLOCK_BORDER,
    },

});

export default HistoryStyles;
