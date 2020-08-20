// @flow

import { red } from '@material-ui/core/colors';

export default ({ spacing }: Object) => ({
    root: {
        flexGrow: 1,
        display: 'block',
    },
    input: {
        display: 'flex',
    },
    valueContainer: {
        'minWidth': 100,
        'display': 'flex',
        'alignItems': 'center',
        'flex-wrap': 'wrap',
        'flex': '1 1 0%',
        'position': 'relative',
    },
    noOptionsMessage: {
        padding: `${spacing()}px ${spacing(2)}px`,
    },
    placeholder: {
        position: 'absolute',
        left: 2,
        fontSize: 16,
    },
    paper: {
        position: 'absolute',
        zIndex: 3,
        marginTop: spacing(),
    },
    divider: {
        height: spacing(2),
    },
    errorMessage: {
        position: 'absolute',
        color: red[500],
    },
    arrow: {
        color: 'rgba(0, 0, 0, 0.54)',
    },
});
