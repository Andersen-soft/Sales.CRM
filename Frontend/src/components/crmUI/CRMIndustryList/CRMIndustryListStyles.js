// @flow

import { WHITE } from 'crm-constants/jss/colors';

const CRMIndustryListStyles = ({ spacing }: Object) => ({
    showAllIndustry: {
        borderRadius: 0,
        '&:hover': {
            background: WHITE,
        },
    },
    dots: {
        marginLeft: spacing(),
        paddingTop: spacing(1.5),
    },
    industryPopover: {
        padding: spacing(1, 1, 1.5, 1),
        width: spacing(50),
    },
});

export default CRMIndustryListStyles;
