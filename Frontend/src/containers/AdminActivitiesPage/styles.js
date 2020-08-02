// @flow

import { grey } from '@material-ui/core/colors/';

const styles = ({ spacing }: Object) => ({
    container: {
        padding: spacing(3),
        paddingBottom: 0,
        background: grey[100],
        alignItems: 'center',
    },
    backLink: {
        'width': spacing(4),
        'height': spacing(4),
        'color': grey[700],
        'transition': '.2s',
        '&:hover': {
            opacity: 0.5,
        },
    },
    title: {
        marginLeft: spacing(),
        marginBottom: 0,
    },
    searchHint: {
        marginRight: spacing(),

    },
    responsibleName: {
        marginLeft: spacing(),
        marginBottom: 0,
        textDecoration: 'underline',
    },
});

export default styles;
