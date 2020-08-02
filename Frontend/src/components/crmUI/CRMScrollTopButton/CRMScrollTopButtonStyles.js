// @flow

import { SCROLL_TOP_ICON, SCROLL_TOP_ICON_HOVER, WHITE } from 'crm-constants/jss/colors';

const CRMScrollTopButtonStyles = ({ spacing }: Object) => ({
    scrollTopButton: {
        position: 'fixed',
        right: spacing(6),
        bottom: spacing(6),
        backgroundColor: SCROLL_TOP_ICON,
        boxShadow: 'unset',
        '&:hover': {
            backgroundColor: SCROLL_TOP_ICON_HOVER,
        },
    },
    topIcon: {
        color: WHITE,
        opacity: 1,
    },
});

export default CRMScrollTopButtonStyles;
