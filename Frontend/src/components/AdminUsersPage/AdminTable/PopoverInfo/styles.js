// @flow

import { grey } from '@material-ui/core/colors/index';

export default ({ spacing }: Object) => ({
    infoIcon: {
        'color': grey[400],
        'marginLeft': spacing(),
        '&:hover': {
            color: grey[700],
            cursor: 'pointer',
        },
    },
    popoverContentWrapper: {
        margin: spacing(2),
        maxWidth: 260,
    },
    valueItem: {
        marginRight: spacing(0.5),
    },
    empty: {
        color: grey[500],
    },
    subtitle: {
        marginRight: spacing(),
    },
});
