// @flow

import { LINK_COLOR } from 'crm-constants/jss/colors';

const CRMSocialNetworkIconLinkStyles = () => ({
    icon: {
        opacity: 1,
        verticalAlign: 'middle',
    },
    link: {
        color: LINK_COLOR,
        '&:hover': {
            textDecoration: 'underline',
        },
    },
});

export default CRMSocialNetworkIconLinkStyles;
