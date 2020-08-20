// @flow

import { HEADER_CELL, WHITE } from 'crm-constants/jss/colors';
import makeStyles from '@material-ui/core/styles/makeStyles';
import commonStyles from 'crm-styles/common';

export default ({ spacing }: Object) => ({
    root: {
        width: spacing(27),
        height: spacing(13),
    },
    button: {
        width: spacing(11.875),
        height: spacing(3),
        padding: 0,
        borderRadius: spacing(0.5),
        outline: 'none',
        textTransform: 'none',
        ...commonStyles.textSmall,
    },
});

export const useStatusStyle = makeStyles({
    statusButton: ({ color, selected }) => ({
        '&$statusButton': {
            'backgroundColor': selected ? color : 'transparent',
            'color': selected ? WHITE : HEADER_CELL,
            '&:hover': {
                backgroundColor: color,
                color: WHITE,
            },
        },
    }),
});
