// @flow

import { LINK_COLOR } from 'crm-constants/jss/colors';

const LinksBlockStyles = ({ spacing, typography: { fontWeightLight } }: Object) => ({
    linkLeft: {
        marginLeft: spacing(),
    },
    linkRight: {
        marginRight: spacing(),
    },
    links: {
        lineHeight: '150%',
        overflow: 'hidden',
        fontWeight: fontWeightLight,
    },
    highlighted: {
        fontWeight: 500,
    },
    noLink: {
        color: LINK_COLOR,
    },
});

export default LinksBlockStyles;
