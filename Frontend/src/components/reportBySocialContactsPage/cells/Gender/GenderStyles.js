// @flow

import { ACTION_LABEL, WHITE, DEFAULT_BORDER_COLOR } from 'crm-constants/jss/colors';

const GenderStyles = ({ spacing }: Object) => ({
    gender: {
        'marginRight': spacing(0.75),
        'width': spacing(1.5),
        'height': spacing(2),
        '&:hover': {
            opacity: 0.5,
        },
    },
    genderIcon: {
        marginRight: spacing(2),
    },
    genderMenuButton: {
        'width': spacing(5),
        'padding': spacing(1.5, 1, 1.5, 1),
        'borderRadius': spacing(0.5),
        'backgroundColor': WHITE,
        'marginRight': spacing(),
        'border': `1px solid ${DEFAULT_BORDER_COLOR}`,
        '&:hover': {
            backgroundColor: WHITE,
        },
        'position': 'relative',
    },
    dropDownIcon: {
        position: 'absolute',
        right: -2,
        color: ACTION_LABEL,
    },
});

export default GenderStyles;
