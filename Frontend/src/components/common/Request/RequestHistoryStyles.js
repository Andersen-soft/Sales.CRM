// @flow

import { ACTION_LABEL, ICON_COLOR } from 'crm-constants/jss/colors';

const RequestHistoryStyles = ({
    spacing,
    typography: {
        caption: { fontSize },
        fontWeightRegular,
        fontSize: fontSize14,
    },
}: Object) => ({
    root: {
        width: '100%',
    },
    panelHeader: {
        width: '100%',
        padding: spacing(3),
    },
    panelHeaderContent: {
        margin: '0 !important',
    },
    headerTitle: {
        fontSize: spacing(2.25),
        marginRight: spacing(2),
    },
    expanded: {
        'color': ACTION_LABEL,
        fontSize,
        '& svg': {
            color: ICON_COLOR,
            opacity: 0.5,
        },
    },
    dropDownIcon: {
        marginLeft: spacing(0.5),
        width: spacing(2.5),
        height: spacing(2.5),
        position: 'absolute',
    },
    closeIcon: {
        transform: 'rotate(180deg)',
    },
    panelContent: {
        padding: 0,
        overflowX: 'auto',
    },
    title: {
        fontSize,
        fontWeight: fontWeightRegular,
    },
    description: {
        fontSize: fontSize14,
    },
    date: {
        minWidth: spacing(22),
        fontSize: fontSize14,
    },
});

export default RequestHistoryStyles;
