// @flow

import { createMuiTheme } from '@material-ui/core/styles';
import lime from '@material-ui/core/colors/lime';
import {
    DEFAULT_BORDER_COLOR,
    ERROR_COLOR,
    HEADER_CELL,
    ICON_COLOR,
    PRIMARY_COLOR,
    UNDERLINE,
    HOVER_BORDER_COLOR,
    FONT_COLOR,
} from 'crm-constants/jss/colors';

export const CRMDateTimeTheme = createMuiTheme({
    palette: {
        primary: lime,
    },
    overrides: {
        MuiPickersBasePicker: {
            pickerView: {
                minWidth: 230,
                minHeight: 303,
            },
        },
        MuiPickersToolbar: {
            toolbar: {
                backgroundColor: 'white',
                alignItems: 'start',
                paddingTop: '8px',
                height: 'auto',
            },
        },
        MuiPickersToolbarButton: {
            toolbarBtn: {
                '& h3': {
                    fontSize: '27px',
                    fontWeight: 500,
                    color: '#212121',
                    opacity: 0.6,
                },
                '& h4': {
                    fontSize: '23px',
                    color: '#212121',
                    minWidth: '91px',
                    textAlign: 'start',
                },
                '& h6': {
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#212121',
                    opacity: 0.6,
                },
                marginTop: '8px',
            },
        },
        MuiPickerDTToolbar: {
            separator: {
                fontSize: '28px',
                fontWeight: 500,
                color: '#212121',
                opacity: 0.6,
            },
        },
        MuiPickersCalendarHeader: {
            switchHeader: {
                'height': 60,
                'width': 230,
                '& p': {
                    fontSize: 14,
                },
            },
            daysHeader: {
                width: 210,
                margin: '0 auto',
            },
        },
        MuiPickersClock: {
            container: {
                width: 260,
            },
            clock: {
                transform: 'matrix(0.85, 0, 0, 0.85, -16, 0)',
                backgroundColor: '#F9F9FA',
            },
            pin: {
                backgroundColor: '#78829D',
            },
        },
        MuiPickersSlideTransition: {
            transitionContainer: {
                paddingRight: 10,
                paddingLeft: 10,
            },
        },
        MuiPickersCalendar: {
            week: {
                paddingTop: 6,
                paddingBottom: 6,
            },
        },
        MuiPickersDay: {
            day: {
                'width': 24,
                'height': 24,
                'margin': '0 3px',
                '& p': {
                    fontSize: 12,
                    fontWeight: 300,
                },
            },
            daySelected: {
                'backgroundColor': PRIMARY_COLOR,
                '&:hover': {
                    backgroundColor: PRIMARY_COLOR,
                },
            },
            current: {
                'color': 'inherit',
                '& p': {
                    fontWeight: 500,
                },
            },
        },
        MuiPickersClockPointer: {
            pointer: {
                backgroundColor: '#78829D',
            },
            thumb: {
                border: '14px solid #78829D',
            },
            noPoint: {
                backgroundColor: '#78829D',
            },
        },
        MuiPickersClockNumber: {
            clockNumberSelected: {
                color: 'white',
            },
        },
    },
});

export const CRMInputStyles = ({ typography: { body2: { fontSize } }, spacing }: Object) => ({
    cssOutlinedInput: {
        '&:not(hover):not($disabled):not($cssFocused):not($error) $notchedOutline': {
            borderColor: DEFAULT_BORDER_COLOR,
        },
        '&:hover:not($disabled):not($cssFocused):not($error)': {
            borderColor: HOVER_BORDER_COLOR,
        },
        '&$cssFocused $notchedOutline': {
            border: `1px solid ${HOVER_BORDER_COLOR} !important`,
        },
        '&$error $notchedOutline': {
            borderColor: ERROR_COLOR,
        },
        '&$disabled $notchedOutline': {
            borderColor: DEFAULT_BORDER_COLOR,
        },
    },
    closeButton: {
        padding: spacing(0.5),
        marginRight: spacing(0.5),
    },
    notchedOutline: {},
    cssFocused: {},
    error: {},
    disabled: {},
    text: {
        marginTop: spacing(),
        marginLeft: 0,
        marginRight: 0,
        color: ERROR_COLOR,
    },
    underline: {
        '&:before': {
            borderBottom: `1px dashed ${UNDERLINE} !important`,
        },
        '&:after': {
            borderBottom: `1px dashed ${UNDERLINE}`,
        },
        '&$disabled:before ': {
            borderBottom: 'unset !important',
        },
        '&$disabled:after ': {
            borderBottom: 'unset !important',
        },
    },
    inputField: {
        'height': spacing(2),
        'padding': spacing(1.5, 1.5, 1.5, 1),
        fontSize,
        'color': `${HEADER_CELL} !important`,
        '&:-webkit-autofill': {
            boxShadow: `0 0 0 ${spacing(12.5)}px white inset`,
        },
        '&:hover': {
            cursor: 'pointer',
        },
    },
    inlineInputField: {
        color: FONT_COLOR,
        width: spacing(9),
        padding: spacing(1.5, 0, 0.5, 0),
        textAlign: 'center',
        'height': spacing(2),
        fontSize,
        '&:hover': {
            cursor: 'pointer',
        },

    },
    iconButton: {
        'position': 'absolute',
        'opacity': 0.5,
        'right': 0,
        'color': ICON_COLOR,
        'cursor': 'pointer',
        '&:hover': {
            opacity: 1,
            backgroundColor: 'transparent',
        },
    },
    icon: {
        marginRight: spacing(1.5),
    },
    popoverRoot: {
        width: spacing(28.75),
        boxShadow: '0 0 16px rgba(0, 0, 0, 0.15)',
    },
});
