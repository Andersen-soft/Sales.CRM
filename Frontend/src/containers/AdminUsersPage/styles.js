// @flow

import { grey } from '@material-ui/core/colors/';

const styles = ({ spacing }: Object) => ({
    root: {
        background: grey[100],
    },
    wrapper: {
        height: 'calc(100vh - 132px)',
        marginTop: spacing(3),
    },
    container: {
        paddingLeft: spacing(3),
        paddingRight: spacing(3),
        paddingBottom: 0,
        background: grey[100],
    },
    content: {
        height: '100%',
        position: 'relative',
        overflowX: 'auto',
    },
    button: {
        marginTop: spacing(),
    },
});

export default styles;
