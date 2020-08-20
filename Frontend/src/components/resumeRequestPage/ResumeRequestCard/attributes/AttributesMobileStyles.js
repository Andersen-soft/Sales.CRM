// @flow

import {
    FONT_COLOR,
    HEADER_CELL,
    UNDERLINE,
    LINK_COLOR,
    HOVER_BACKGROUND_COLOR,
} from 'crm-constants/jss/colors';

const AttributesMobileStyles = ({
    spacing,
    typography: {
        fontSize,
        fontWeightLight,
        caption: { fontSize: smallFont },
    },
}: Object) => ({
    inputLabel: {
        fontSize,
        color: HEADER_CELL,
        padding: spacing(1, 0),
    },
    inputEditable: {
        fontSize,
        padding: spacing(1.25, 0),
    },
    inputEllipsis: {
        display: 'inline-block',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        maxWidth: spacing(27),
    },
    inputInfo: {
        borderBottom: `1px dashed ${UNDERLINE}`,
        color: FONT_COLOR,
        cursor: 'pointer',
        display: 'inline-block',
        fontSize,
        height: spacing(2.5),
    },
    filedContainer: {
        width: '100%',
    },
    fieldLink: {
        color: LINK_COLOR,
        padding: spacing(1.25),
        '&:hover': {
            cursor: 'pointer',
        },
    },
    fieldDate: {
        fontSize,
        marginRight: spacing(1.25),
    },
    statusRadioGroup: {
        '& label span:first-child': {
            '&:hover': {
                background: 'unset !important',
            },
        },
    },
    statusRadioItem: {
        padding: spacing(),
    },
    statusRadioRoot: {
        width: '100%',
        margin: 0,
        borderRadius: spacing(0.5),
        border: '1px solid transparent',
        '&:hover': {
            border: `1px solid ${HOVER_BACKGROUND_COLOR}`,
        },
    },
    statusRadioLabel: {
        fontSize: smallFont,
    },
    statusSelectedValue: {
        background: HOVER_BACKGROUND_COLOR,
    },
});

export default AttributesMobileStyles;
