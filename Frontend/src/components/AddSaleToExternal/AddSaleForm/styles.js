// @flow

import { FONT_COLOR, ACTION_LABEL } from 'crm-constants/jss/colors';

const styles = ({
    spacing,
    typography: {
        caption: { fontSize },
    },
}: Object) => ({
    formButtons: {
        justifyContent: 'center',
    },
    inputContainer: {
        marginBottom: spacing(3),
    },
    inputContainerGroup: {
        'marginBottom': spacing(0.5),
        '& fieldset.MuiOutlinedInput-notchedOutline': {
            borderWidth: 0,
        },
        '& input.Mui-disabled': {
            color: `${FONT_COLOR} !important`,
            width: spacing(10),
        },
    },
    checkboxLabel: {
        marginRight: spacing(1),
        fontSize,
        color: ACTION_LABEL,
    },
    checkboxControl: {
        marginLeft: 0,
        marginRight: 0,
    },
    button: {
        margin: spacing(1, 3),
    },
    textLabel: {
        marginRight: spacing(1),
        fontSize,
        color: ACTION_LABEL,
    },
    gridLeftForm: {
        paddingRight: spacing(3),
    },
    gridRightForm: {
        paddingLeft: spacing(1.5),
    },
    dateInput: {
        color: FONT_COLOR,
    },
    lastInputContainer: {
        marginBottom: spacing(),
    },
});

export default styles;
