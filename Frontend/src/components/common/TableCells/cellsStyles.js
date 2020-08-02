// @flow

import {
    ACTION_LABEL,
    FONT_COLOR,
    UNDERLINE,
    ICON_COLOR,
    LINK_COLOR,
} from 'crm-constants/jss/colors';
import { COMMENT_MAX_HEIGHT } from 'crm-constants/globalSearch/globalSearchConstants';

const cellsStyles = ({
    spacing,
    typography: {
        fontSize,
        caption: { fontSize: smallFontSize },
    },
}: Object) => ({
    fullName: {
        borderBottom: `1px dashed ${UNDERLINE}`,
        color: FONT_COLOR,
        cursor: 'pointer',
        display: 'inline-block',
        marginRight: spacing(2),
        fontSize,
        width: 'max-content',
    },
    fullCommentCell: {
        fontSize: smallFontSize,
        lineHeight: '14px',
        wordBreak: 'break-word',
        whiteSpace: 'pre-line',
    },
    smallCell: {
        height: COMMENT_MAX_HEIGHT,
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
    link: {
        color: LINK_COLOR,
        '&:hover': {
            textDecoration: 'underline',
            cursor: 'pointer',
        },
    },
});

export default cellsStyles;
