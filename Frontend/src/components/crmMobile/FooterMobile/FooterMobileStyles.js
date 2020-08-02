// @flow
import {
    LIGHTGRAY,
} from 'crm-constants/jss/colors';

const FooterMobileStyles = ({ spacing }: Object) => ({
    container: {
        width: '100%',
        position: 'fixed',
        bottom: 0,
        zIndex: 1400,
        minHeight: spacing(5),
        height: spacing(5),
    },
    content: {
        boxShadow: `0 -1px ${spacing()}px ${LIGHTGRAY}`,
    },
    wrapper: {
        minHeight: spacing(5),
        height: spacing(5),
    },
});

export default FooterMobileStyles;
