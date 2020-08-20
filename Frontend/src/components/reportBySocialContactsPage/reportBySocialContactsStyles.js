// @flow

import { WHITE, BLOCK_BORDER, HEADER_CELL } from 'crm-constants/jss/colors';

const reportBySocialContactsStyles = ({
    spacing,
    typography: {
        fontWeightRegular: fontWeight,
        fontSize,
    },
}: Object) => ({
    container: {
        margin: spacing(2, 1, 0, 1),
        backgroundColor: WHITE,
        borderRadius: spacing(),
        height: '100%',
        overflow: 'hidden',
        border: BLOCK_BORDER,
    },
    headerContainer: {
        padding: spacing(3),
        position: 'sticky',
        left: 0,
        top: 0,
    },
    headerTitle: {
        fontSize: spacing(2.5),
    },
    headerSearch: {
        marginLeft: 'auto',
        marginRight: spacing(5),
    },
    tableContainer: {
        overflow: 'auto',
        height: 'calc(100% - 100px)',
    },
    tableCell: {
        fontSize,
        padding: spacing(2, 1.25, 2, 2),
    },
    tableHead: {
        height: spacing(5),
    },
    tableHeaderCell: {
        '& > div': {
            flexWrap: 'nowrap',
            height: spacing(3),
        },
        'position': 'sticky',
        'top': 0,
        'backgroundColor': WHITE,
        'zIndex': 10,
    },
    tableTitle: {
        fontWeight,
        lineHeight: spacing(0.25),
        color: HEADER_CELL,
        whiteSpace: 'pre',
    },
    messages: {
        minWidth: spacing(25),
        wordBreak: 'break-all',
        whiteSpace: 'pre-line',
    },
    country: {
        minWidth: spacing(19),
    },
    company: {
        minWidth: spacing(22),
    },
    site: {
        minWidth: spacing(15),
    },
    firstName: {
        minWidth: spacing(14.5),
    },
    lastName: {
        minWidth: spacing(14.5),
    },
    position: {
        minWidth: spacing(19.5),
    },
    skype: {
        minWidth: spacing(16),
    },
    email: {
        minWidth: spacing(25),
    },
    emailPrivate: {
        minWidth: spacing(25),
    },
    dialogText: {
        paddingLeft: spacing(9.5),
        paddingRight: spacing(9.5),
    },
});

export default reportBySocialContactsStyles;
