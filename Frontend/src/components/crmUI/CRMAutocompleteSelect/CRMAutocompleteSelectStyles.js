// @flow
import { isNil, pathOr } from 'ramda';
import {
    FONT_COLOR,
    DEFAULT_BORDER_COLOR,
    HOVER_BORDER_COLOR,
    ICON_COLOR,
    HOVER_BACKGROUND_COLOR,
    ERROR_COLOR,
    GREY,
    WHITE,
} from 'crm-constants/jss/colors';
import { FONT_SIZE_SMALL } from 'crm-constants/jss/fonts';

export const CRMAutocompleteSelectStyles = ({ spacing }: Object) => ({
    container: {
        position: 'relative',
    },
    arrow: {
        'color': ICON_COLOR,
        'opacity': 0.5,
        '&:hover': {
            cursor: 'pointer',
            opacity: 1,
        },
    },
    error: {
        '& div': {
            'borderColor': ERROR_COLOR,
            '&:hover': {
                borderColor: ERROR_COLOR,
            },
        },
    },
    iconButton: {
        'position': 'absolute',
        'opacity': 0.5,
        'padding': 0,
        'top': 0,
        'bottom': 0,
        'margin': 'auto',
        'right': spacing(3),
        'color': ICON_COLOR,
        'cursor': 'pointer',
        '&:hover': {
            opacity: 1,
            backgroundColor: 'transparent',
        },
    },
    errorPopper: {
        '&$errorPopper': {
            padding: spacing(1),
            fontSize: FONT_SIZE_SMALL,
        },

    },
    errorIcon: {
        color: ERROR_COLOR,
    },
    label: {
        color: GREY,
        top: spacing(1.5),
        left: spacing(1),
        position: 'absolute',
        transition: 'transform 0.3s',
        background: WHITE,
        transform: 'translate(0px, 0px) scale(1)',
        transformOrigin: '0 0',
    },
    topLabel: {
        zIndex: 10,
        transform: 'translate(0px, -18px) scale(0.75)',
        paddingLeft: spacing(0.5),
        paddingRight: spacing(0.5),
        transformOrigin: 'left top',
    },
    customControl: {
        backgroundColor: WHITE,
        borderRadius: spacing(),
    },
    errorMessage: {
        padding: spacing(0, 1, 1, 1),
        fontSize: spacing(1.5),
        color: ERROR_COLOR,
        position: 'absolute',
    },
});

export const InnerAutocompleteSelectStyles = {
    container: (base: Object) => ({
        ...base,
        width: '100%',
    }),
    control: (base: Object) => ({
        ...base,
        'minHeight': 40,
        'color': FONT_COLOR,
        'borderColor': DEFAULT_BORDER_COLOR,
        'boxShadow': 'unset',
        'flexWrap': 'nowrap',
        '&:hover': {
            borderColor: HOVER_BORDER_COLOR,
            boxShadow: 'unset',
        },
        'background': 'transparent',
    }),
    placeholder: (base: Object) => ({
        ...base,
        margin: 0,
        color: GREY,
    }),
    singleValue: (base: Object) => ({
        ...base,
        margin: 0,
    }),
    clearIndicator: (base: Object) => ({
        ...base,
        'color': ICON_COLOR,
        'opacity': 0.5,
        'paddingLeft': 4,
        '&:hover': {
            cursor: 'pointer',
            color: ICON_COLOR,
            opacity: 1,
        },
    }),
    indicatorSeparator: (base: Object) => ({
        ...base,
        display: 'none',
    }),
    option: (base: Object, { isSelected, data }: Object) => {
        const isGroupOption = pathOr(null, ['group'], data);

        return {
            ...base,
            'fontSize': isNil(isGroupOption) ? 14 : 12,
            'lineHeight': '16px',
            'color': isNil(isGroupOption) ? FONT_COLOR : ICON_COLOR,
            'paddingTop': 12,
            'paddingBottom': 12,
            'paddingLeft': isNil(isGroupOption) ? 20 : 30,
            'paddingRight': 20,
            'backgroundColor': isSelected ? HOVER_BACKGROUND_COLOR : '',
            'cursor': 'pointer',
            '&:active': {
                backgroundColor: HOVER_BACKGROUND_COLOR,
            },
            '&:hover': {
                backgroundColor: HOVER_BACKGROUND_COLOR,
            },
        };
    },
    menuList: (base: Object) => ({
        ...base,
        paddingTop: 8,
        paddingBottom: 8,
    }),
    menuPortal: (base: Object) => ({
        ...base,
        zIndex: 1401,

    }),
    menu: (base: Object) => ({
        ...base,
        zIndex: 1401,
    }),
    multiValue: (base: Object) => ({
        ...base,
        backgroundColor: HOVER_BACKGROUND_COLOR,
    }),
    multiValueLabel: (base: Object) => ({
        ...base,
        color: FONT_COLOR,
    }),
    multiValueRemove: (base: Object) => ({
        ...base,
        color: FONT_COLOR,
        ':hover': {
            cursor: 'pointer',
        },
    }),
    groupHeading: (base: Object) => ({
        ...base,
        color: `${FONT_COLOR} !important`,
        fontSize: 14,
        fontWeight: 'normal',
        textTransform: 'unset',
    }),
};
