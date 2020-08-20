// @flow

import commonStyles from 'crm-styles/common';
import {
    STATUS_FILTER_BACKGROUND,
    HEADER_CELL,
    ICON_COLOR,
    WHITE,
} from 'crm-constants/jss/colors';


const CRMTagStyles = ({
    spacing,
    typography: {
        caption: { fontSize },
        fontWeightRegular,
    },
}: Object) => ({
    tag: {
        fontSize,
        'font-weight': fontWeightRegular,
        'border-radius': spacing(0.5),
        'margin-left': spacing(0.5),
        'margin-top': spacing(0.5),
        'padding-top': spacing(0.5),
        'padding-right': spacing(0),
        'padding-bottom': spacing(0.5),
        'padding-left': spacing(0),
        'color': HEADER_CELL,
        'background': STATUS_FILTER_BACKGROUND,
        'box-shadow': '0px 1px 1px rgba(0, 25, 91, 0.15)',
        'height': 'auto',
    },
    listTag: {
        'background': WHITE,
        'box-shadow': '0 0 0 0',
        '&:hover': {
            'background': STATUS_FILTER_BACKGROUND,
        },
    },
    avatar: {
        opacity: 0.5,
        'padding': spacing(0),
        'margin-right': spacing(0),
        'max-height': spacing(3),
        'max-width': spacing(3),
        'background-color': 'inherit',
        'border-radius': 'inherit',
        'color': HEADER_CELL,
    },
    pointer: {
        'cursor': 'pointer',
    },
    label: {
        'margin-left': spacing(),
        'padding-left': spacing(0),
    },
    deleteIcon: {
        'max-height': spacing(3),
        'max-width': spacing(2),
        'opacity': 0.5,
        'margin-left': spacing(0),
        'padding-left': spacing(0),
        'color': ICON_COLOR,
    },
    ...commonStyles,
});


export default CRMTagStyles;
