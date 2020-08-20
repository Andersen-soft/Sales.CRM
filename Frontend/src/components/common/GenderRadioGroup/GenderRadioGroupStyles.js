// @flow

import { GREY } from 'crm-constants/jss/colors';

const GenderRadioGroupStyles = ({
    spacing,
    typography: {
        fontSize: FONT_SIZE_NORMAL,
        subtitle2: { fontsize: SUBTITLE_FONT_SIZE },
    },
}: Object) => ({
    rowLabel: {
        'align-self': 'flex-start',
        marginTop: spacing(1.5),
        '&:active': {
            color: GREY,
        },
    },
    label: {
        color: GREY,
        fontSize: SUBTITLE_FONT_SIZE,
    },
    control: {
        marginRight: spacing(),
    },
    controlLabel: {
        fontSize: FONT_SIZE_NORMAL,
    },
    radioGroup: {
        marginLeft: spacing(1),
        flex: 1,
    },
    radioGroupRoot: {
        justifyContent: 'space-around',
    },
    root: {
        color: GREY,
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0)',
        },
        '&$checked': {
            color: GREY,
        },
    },
});


export default GenderRadioGroupStyles;
