// @flow

import { FONT_SIZE_NORMAL, FONT_FAMILY_PRIMARY } from 'crm-constants/jss/fonts';
import { LINK_COLOR } from 'crm-constants/jss/colors';

const CompanySiteStyles = () => ({
    link: {
        'textDecoration': 'none',
        '&:focus, &:hover, &:visited, &:link, &:active': {
            textDecoration: 'none',
        },
        'fontSize': FONT_SIZE_NORMAL,
        'fontFamily': FONT_FAMILY_PRIMARY,
        'color': LINK_COLOR,
    },
});

export default CompanySiteStyles;
