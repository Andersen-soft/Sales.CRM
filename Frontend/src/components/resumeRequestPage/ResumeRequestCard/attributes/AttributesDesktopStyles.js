// @flow

import {
    FONT_COLOR,
    HEADER_CELL,
    UNDERLINE,
    LINK_COLOR,
    HOVER_BACKGROUND_COLOR,
} from 'crm-constants/jss/colors';
import { MEDIA_DESKTOP_MEDIUM } from 'crm-constants/jss/mediaQueries';

const AttributesDesktopStyles = ({
    spacing,
    typography: {
        fontSize,
        fontWeightLight,
        caption: { fontSize: smallFont },
        subtitle1: { lineHeight },
    },
}: Object) => ({
    idResume: {
        color: HEADER_CELL,
        fontSize,
        lineHeight,
        fontWeight: fontWeightLight,
    },
    cellEllipsis: {
        display: 'inline-block',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        maxWidth: spacing(20),
    },
    cellBigEllipsis: {
        display: 'inline-block',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        maxWidth: spacing(27),
    },
    label: {
        fontSize,
        color: HEADER_CELL,
    },
    value: {
        flexGrow: 1,
        maxWidth: spacing(27),
    },
    bigValue: {
        flexGrow: 1,
        maxWidth: spacing(31),
    },
    editable: {
        marginRight: spacing(),
        fontSize,
    },
    disable: {
        marginRight: `${spacing(4)}px !important`,
    },
    emptyBlock: {
        marginRight: `${spacing(4)}px !important`,
        fontSize,
    },
    fullName: {
        borderBottom: `1px dashed ${UNDERLINE}`,
        color: FONT_COLOR,
        cursor: 'pointer',
        display: 'inline-block',
        marginRight: spacing(),
        fontSize,
        height: spacing(2.5),
    },
    saleId: {
        color: LINK_COLOR,
        '&:hover': {
            cursor: 'pointer',
        },
    },
    withoutEdit: {
        paddingRight: spacing(4),
    },
    date: {
        fontSize,
    },
    priorityRow: {
        marginBottom: 0,
    },
    statusGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        '& label span:first-child': {
            paddingLeft: spacing(0.5),
            paddingRight: 2,
            '&:hover': {
                background: 'unset !important',
            },
        },
        [MEDIA_DESKTOP_MEDIUM]: {
            justifyContent: 'space-around',
        },
    },
    radioRoot: {
        margin: spacing(1, 0, 0, 1),
        borderRadius: spacing(0.5),
        width: spacing(15),
        border: '1px solid transparent',
        '&:hover': {
            border: `1px solid ${HOVER_BACKGROUND_COLOR}`,
        },
    },
    radioLabel: {
        fontSize: smallFont,
    },
    radioContainer: {
        marginLeft: spacing(-1),
        minHeight: spacing(13),
    },
    selectedValue: {
        background: HOVER_BACKGROUND_COLOR,
    },
    deleteButton: {
        'marginLeft': spacing(),
        'padding': 0,
        '&:hover': {
            backgroundColor: 'unset',
        },
    },
});

export default AttributesDesktopStyles;
