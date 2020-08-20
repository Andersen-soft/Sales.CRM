// @flow

import { GREY } from 'crm-constants/jss/colors';

const CRMFormControlCheckboxLabelStyles = () => ({
    root: {
        '& > span:first-child': {
            color: GREY,
            '&:hover': {
                background: 'unset',
            },
        },
    },
});

export default CRMFormControlCheckboxLabelStyles;
