// @flow

import { STATUS_BORDER_COLOR, BLOCK_BORDER } from 'crm-constants/jss/colors';

const drawerWidth = 240;

const DesktopFiltersStyles = ({ spacing, transitions: { create, easing, duration } }: Object) => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        marginLeft: spacing(3),
    },
    drawerOpen: {
        width: drawerWidth,
        transition: create('width', {
            easing: easing.sharp,
            duration: duration.enteringScreen,
        }),
    },
    drawerClose: {
        'transition': create('width', {
            easing: easing.sharp,
            duration: duration.leavingScreen,
        }),
        'overflowX': 'hidden',
        'width': spacing(4),
        'backgroundColor': 'inherit',
        '&:first-child': {
            border: 'none',
        },
    },
    drawerPaper: {
        position: 'absolute',
        height: `calc(100% - ${spacing(2)}px)`,
        border: BLOCK_BORDER,
        left: spacing(),
        borderRadius: spacing(),
        overflowX: 'hidden',
    },
    filterWrapper: {
        padding: spacing(2),
    },
    search: {
        marginBottom: spacing(),
    },
    openIcon: {
        position: 'absolute',
        bottom: spacing(2),
        right: spacing(2),
        cursor: 'pointer',
    },
    closeIcon: {
        height: '100%',
        cursor: 'pointer',
        paddingBottom: spacing(2),
        '&:hover': {
            backgroundColor: STATUS_BORDER_COLOR,
        },
    },
    dateRangeInput: {
        width: spacing(21),
    },
});

export default DesktopFiltersStyles;
