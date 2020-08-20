// @flow

import { grey } from '@material-ui/core/colors';

const CheckboxFilterStyles = ({ spacing }: Object) => ({
    icon: {
        '&:hover': {
            cursor: 'pointer',
        },
    },
    wrapper: {
        height: '100%',
    },
    formControl: {
        padding: spacing(),
    },
    emptyBlock: {
        padding: spacing(2),
    },
    popoverStyle: {
        marginTop: spacing(2),
    },
    applyButton: {
        marginTop: spacing(2),
    },
    sendIcon: {
        'color': grey[400],
        '&:hover': {
            color: grey[600],
            cursor: 'pointer',
        },
    },
});

export default CheckboxFilterStyles;
