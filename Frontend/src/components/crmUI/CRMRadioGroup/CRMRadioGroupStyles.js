// @flow

import commonStyles from 'crm-styles/common';
import { WHITE, STATUS_BORDER_COLOR, GREY, HEADER_CELL } from 'crm-constants/jss/colors';

const CRMRadioGroupStyles = ({ spacing }: Object) => ({
    headerText: {
        marginBottom: spacing(1),
        fontSize: spacing(1.75),
    },
    container: {
        boxShadow: `0px 1px ${spacing(1)}px rgba(0, 0, 0, 0.04)`,
        borderRadius: spacing(1 / 2),
    },
    containerLabel: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1,
        margin: 0,
        padding: spacing(2),
        borderRadius: spacing(1 / 2),
        backgroundColor: WHITE,
        color: GREY,
    },
    containerLabelActive: {
        boxShadow: `1px 0px ${spacing(1 / 2)}px rgba(105, 115, 143, 0.08)`,
        backgroundColor: HEADER_CELL,
        color: WHITE,
    },
    radio: {
        display: 'none',
    },
    icon: {
        display: 'flex',
        marginRight: spacing(1.25),
    },
    label: {
        display: 'flex',
        fontSize: spacing(1.75),
    },
    splitter: {
        width: spacing(1 / 4),
        height: '65%',
        borderRadius: spacing(1 / 2),
        backgroundColor: STATUS_BORDER_COLOR,
    },
    ...commonStyles,
});

export default CRMRadioGroupStyles;
