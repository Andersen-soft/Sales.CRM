// @flow

import { WHITE } from 'crm-constants/jss/colors';

const DesktopStyles = ({ spacing }: Object) => ({
    desktop: {
        height: '100%',
        paddingTop: spacing(2),
    },
    mobileDesctop: {
        paddingTop: 0,
        backgroundColor: WHITE,
    },
    wrapper: {
        position: 'relative',
        height: '100%',
    },
    cards: {
        paddingRight: spacing(),
        position: 'relative',
        overflowY: 'auto',
    },
    mobileCards: {
        overflowY: 'auto',
    },
});

export default DesktopStyles;
