// @flow

import { red } from '@material-ui/core/colors';

const FiltrationComponentStyles = ({ spacing }: Object) => ({
    icon: {
        '&:hover': {
            cursor: 'pointer',
        },
    },
    wrapper: {
        height: '100%',
    },
    noDataMessage: {
        whiteSpace: 'nowrap',
    },
    input: {
        overflow: 'initial',
        backgroundColor: 'white',
    },
    paper: {
        position: 'absolute',
        zIndex: 3,
        left: 0,
        width: '100%',
        marginTop: spacing(),
    },
    leftAlign: {
        left: 0,
        right: 'auto',
    },
    rightAlign: {
        left: 'auto',
        right: 0,
    },
    closeIcon: {
        '&:hover': {
            cursor: 'pointer',
            color: red[500],
        },
    },
    iconsWrapper: {
        paddingRight: spacing(),
        display: 'flex',
    },
});

export default FiltrationComponentStyles;
