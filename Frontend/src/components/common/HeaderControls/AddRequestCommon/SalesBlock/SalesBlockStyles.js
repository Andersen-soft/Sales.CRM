// @flow

import { FONT_COLOR, HEADER_CELL, ERROR_COLOR } from 'crm-constants/jss/colors';

const SalesBlockStyles = ({
    spacing,
    typography: {
        fontSize,
        fontWeightLight,
        caption: { fontSize: FONT_SIZE_SMALL },
    },
    mixins: { mobile },
}: Object) => ({
    checkboxLabel: {
        width: '19%',
        marginRight: spacing(),
        ...mobile({
            width: '31%',
        }),
    },
    label: {
        fontSize,
        color: FONT_COLOR,
    },
    sales: {
        minHeight: spacing(5.5),
        marginTop: spacing(),
    },
    saleLabel: {
        position: 'relative',
        cursor: 'pointer',
        fontSize: FONT_SIZE_SMALL,
        color: HEADER_CELL,
    },
    dropDownIcon: {
        marginLeft: spacing(0.5),
        width: spacing(2.5),
        height: spacing(2.5),
        position: 'absolute',
    },
    radioError: {
        display: 'block',
        color: ERROR_COLOR,
        marginTop: 0,
    },
    message: {
        fontSize,
    },
    closeIcon: {
        transform: 'rotate(180deg)',
    },
    salesGroup: {
        marginBottom: spacing(),
    },
});

export default SalesBlockStyles;
