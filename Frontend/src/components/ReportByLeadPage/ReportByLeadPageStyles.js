// @flow

import {
    BLOCK_BORDER,
    ERROR_COLOR,
    FONT_COLOR,
    HEADER_CELL,
    LINK_COLOR,
} from 'crm-constants/jss/colors';

const ReportByLeadPageStyles = ({
    spacing,
    typography: {
        fontSize,
        fontWeightRegular: fontWeight,
        fontWeightMedium,
        htmlFontSize,
        caption: {
            fontSize: fontSizeSub,
        },
    },
}: Object) => ({
    container: {
        height: '100%',
        overflow: 'hidden',
        margin: spacing(2, 1.25, 0.5, 2),
        border: BLOCK_BORDER,
    },
    header: {
        padding: spacing(3, 3, 2, 3),
    },
    headerTitle: {
        whiteSpace: 'pre',
    },
    headerItem: {
        marginLeft: spacing(5),
    },
    headerIcon: {
        marginLeft: spacing(3),
    },
    iconButton: {
        padding: 0,
        '&:hover': {
            backgroundColor: 'transparent',
        },
    },
    rounded: {
        borderRadius: spacing(),
    },
    tableRoot: {
        overflow: 'auto',
        height: 'calc(100vh - 170px)',
    },
    cell: {
        fontSize,
        padding: spacing(2, 1.25, 2, 2),
    },
    head: {
        height: spacing(5),
    },
    headerCell: {
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
    modalRoot: {
        borderRadius: spacing(),
        width: spacing(55),
        paddingBottom: spacing(2),
    },
    modalTitle: {
        fontSize: htmlFontSize,
        color: FONT_COLOR,
        padding: spacing(3, 3, 2, 4),
        marginBottom: spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: spacing(0.5),
        top: spacing(0.5),
    },
    tableCell: {
        fontSize,
        fontWeight,
        width: '50%',
        paddingLeft: spacing(4),
        color: FONT_COLOR,
    },
    tableTitle: {
        fontWeight,
        fontSize: fontSizeSub,
        marginLeft: spacing(2),
        marginBottom: spacing(1),
    },
    total: {
        fontWeight: fontWeightMedium,
        fontSize,
        color: FONT_COLOR,
        padding: spacing(3, 3, 2, 4),
    },
    totalName: {
        width: '57%',
    },
    errorRoot: {
        fontSize,
        padding: spacing(1.5, 3, 0.5, 3),
        color: ERROR_COLOR,
    },
    dropDownIcon: {
        marginLeft: spacing(0.5),
        width: spacing(3),
        height: spacing(3),
        color: LINK_COLOR,
        opacity: 0.5,
    },
    closeIcon: {
        transform: 'rotate(180deg)',
        color: LINK_COLOR,
    },
    arrowBlock: {
        paddingTop: spacing(0.5),
        fontSize: fontSizeSub,
        cursor: 'pointer',
        color: LINK_COLOR,
    },
    errorMessageIds: {
        padding: spacing(1.5, 0),
    },
    changeStatus: {
        '& $title': {
            whiteSpace: 'unset',
            width: 'max-content',
            lineHeight: 'normal',
        },
        'maxWidth': spacing(21),
    },
    industry: {
        width: spacing(25),
        maxWidth: spacing(30),
        minWidth: spacing(25),
    },
});

export default ReportByLeadPageStyles;
