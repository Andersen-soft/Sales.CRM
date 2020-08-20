// @flow

import {
    BLOCK_BORDER,
    HEADER_CELL,
    WHITE,
    HOVER_BACKGROUND_COLOR,
    DEFAULT_BORDER_COLOR,
} from 'crm-constants/jss/colors';

const ResumeStyles = ({
    spacing,
    typography: {
        fontWeightRegular: fontWeight,
        fontSize,
        subtitle2: {
            fontSize: smallFontSize,
        },
    },
}: Object) => ({
    container: {
        height: '100%',
        overflow: 'hidden',
        margin: spacing(2, 1.25, 0.5, 2),
        border: BLOCK_BORDER,
        position: 'relative',
    },
    rounded: {
        borderRadius: spacing(),
        paddingBottom: spacing(5),
    },
    topBarContainer: {
        padding: spacing(1, 3, 3, 3),
    },
    iconButton: {
        'padding': 0,
        '&:hover': {
            backgroundColor: 'transparent',
        },
    },
    wrapper: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
    },
    wrapTable: {
        overflow: 'auto',
    },
    cell: {
        fontSize,
        padding: spacing(2, 1.25, 2, 2),
    },
    head: {
        height: spacing(5),
    },
    headerCell: {
        'backgroundColor': WHITE,
        'position': 'sticky',
        'top': 0,
        'zIndex': 10,
        '& >div': {
            flexWrap: 'nowrap',
            height: spacing(3),
        },
    },
    title: {
        fontWeight,
        lineHeight: spacing(0.25),
        color: HEADER_CELL,
        whiteSpace: 'pre',
    },
    filterWrapper: {
        marginTop: spacing(2),
        marginRight: spacing(8.5),
    },
    buttonWrapper: {
        width: spacing(45),
        height: spacing(5),
        borderRadius: spacing(),
        backgroundColor: HOVER_BACKGROUND_COLOR,
        paddingLeft: 2,
        paddingRight: 2,
        boxSizing: 'content-box',
    },
    button: {
        'height': spacing(4.5),
        'width': spacing(15),
        'fontSize': smallFontSize,
        'padding': 0,
        'textTransform': 'unset',
        'fontWeight': 'normal',
        'borderRadius': spacing(),
        '&:hover': {
            backgroundColor: WHITE,
            border: `1px solid ${DEFAULT_BORDER_COLOR}`,
        },
    },
    activeButton: {
        backgroundColor: WHITE,
        border: `1px solid ${DEFAULT_BORDER_COLOR}`,
    },
    middleButton: {
        '&:after, &:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 'calc(50% - 8)',
            right: '-1px',
            height: spacing(2),
            borderLeft: `1px solid ${DEFAULT_BORDER_COLOR}`,
        },
        '&:before': {
            left: '-1px',
        },
    },
    fireIcon: {
        opacity: 1,
        cursor: 'pointer',
        marginRight: spacing(),
    },
    downloadButton: {
        marginTop: spacing(2),
    },
    filterTitle: {
        marginBottom: spacing(),
        fontSize,
    },
    dateRange: {
        width: spacing(28.5),
    },
});

export default ResumeStyles;
