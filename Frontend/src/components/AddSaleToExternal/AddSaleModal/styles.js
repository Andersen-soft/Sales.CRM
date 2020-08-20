// @flow

import { FONT_SIZE_H3 } from 'crm-constants/jss/fonts';

const styles = ({ spacing }: Object) => ({
    containerDialog: {
        width: '100%',
        maxWidth: spacing(80),
        overflowY: 'auto',
        borderRadius: spacing(),
    },
    containerPaper: {
        padding: spacing(3),
    },
    title: {
        marginTop: 0,
        marginBottom: spacing(4),
        padding: 0,
        fontSize: FONT_SIZE_H3,
    },
    iconClose: {
        width: spacing(3),
        height: spacing(3),
    },
    exitButton: {
        position: 'absolute',
        right: 4,
        top: 4,
    },
});

export default styles;
