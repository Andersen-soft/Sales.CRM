// @flow

import commonStyles from 'crm-styles/common';

const CRMSelectStyles = () => ({
    select: {
        'border-bottom': 'none',
        'weight': 'normal',
        '&:before': {
            'border-bottom': 'none',
        },
        '&:after': {
            'border-bottom': 'none',
        },
        '&.MuiInputBase-root': {
            'border-bottom': 'none',
            '&:hover:not(.Mui-disabled):before': {
                'border-bottom': 'none',
            },
        },
    },
    ...commonStyles,
});

export default CRMSelectStyles;
