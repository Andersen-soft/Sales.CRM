// @flow

import {
    FONT_COLOR,
    HEADER_CELL,
    UNDERLINE,
    LINK_COLOR,
    HOVER_BACKGROUND_COLOR,
} from 'crm-constants/jss/colors';

const AttributesStyles = ({
    spacing,
    typography: {
        fontSize,
        fontWeightLight,
        caption: { fontSize: smallFont },
        subtitle1: { lineHeight },
    },
}: Object) => ({
    label: {
        fontSize,
        color: HEADER_CELL,
    },
    value: {
        flexGrow: 1,
        maxWidth: spacing(27),
    },
    editable: {
        marginRight: spacing(),
        fontSize,
    },
    cellEllipsis: {
        display: 'inline-block',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        maxWidth: spacing(20),
    },
    withoutEdit: {
        paddingRight: spacing(4),
    },
    deadlineDate: {
        fontSize,
    },
    employeeFullName: {
        borderBottom: `1px dashed ${UNDERLINE}`,
        color: FONT_COLOR,
        cursor: 'pointer',
        display: 'inline-block',
        marginRight: spacing(),
        fontSize,
        height: spacing(2.5),
    },
    employeeDisable: {
        marginRight: `${spacing(4)}px !important`,
    },
    headerId: {
        color: HEADER_CELL,
        fontSize,
        lineHeight,
        fontWeight: fontWeightLight,
    },
    headerIcon: {
        'marginLeft': spacing(),
        'padding': 0,
        '&:hover': {
            backgroundColor: 'unset',
        },
    },
    saleId: {
        color: LINK_COLOR,
        '&:hover': {
            cursor: 'pointer',
        },
    },
    statusRadioGroup: {
        '& label span:first-child': {
            paddingLeft: 0,
            '&:hover': {
                background: 'unset !important',
            },
        },
    },
    statusRadioContainer: {
        marginTop: spacing(),
    },
    statusRadioItem: {
        paddingBottom: spacing(),
        paddingRight: spacing(0.5),
    },
    statusRadioRoot: {
        width: '100%',
        margin: 0,
        border: '1px solid transparent',
        borderRadius: spacing(0.5),
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

export default AttributesStyles;
