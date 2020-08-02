// @flow

import { HEADER_CELL, STATUS_BORDER_COLOR } from 'crm-constants/jss/colors';

const CustomButtonsStyles = ({ spacing }: Object) => ({
    addIcon: {
        marginRight: spacing(),
    },
    addNextActivityIcon: {
        verticalAlign: 'middle',
        cursor: 'pointer',
    },

    menuItem: {
        paddingTop: spacing(2),
        paddingRight: spacing(2),
        paddingLeft: spacing(2),
    },
    icon: {
        marginRight: spacing(),
    },
    typography: {
        color: HEADER_CELL,
    },
    separator: {
        paddingBottom: spacing(2),
        borderBottom: `1px solid ${STATUS_BORDER_COLOR}`,
    },
});

export default CustomButtonsStyles;
