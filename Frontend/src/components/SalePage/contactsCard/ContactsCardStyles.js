// @flow

import {
    WHITE,
    BLOCK_BORDER,
} from 'crm-constants/jss/colors';

const ContactsCardStyles = ({
    spacing,
    typography: {
        fontWeightRegular,
    },
}: Object) => ({
    root: {
        borderRadius: spacing(),
        border: BLOCK_BORDER,
    },
    headerWrapper: {
        padding: spacing(2.5, 3, 0.5, 3),
    },
    contactsCardLabel: {
        lineHeight: spacing(0.25),
    },
    tableContainer: {
        height: spacing(23.5),
        borderRadius: spacing(),
    },
    mediumHeight: {
        height: spacing(31.5),
    },
    bigHeight: {
        height: spacing(42),
    },
    cell: {
        paddingRight: 0,
        paddingLeft: spacing(),
        height: spacing(11),
    },
    head: {
        height: spacing(4.5),
    },
    headerCell: {
        backgroundColor: WHITE,
        fontWeight: fontWeightRegular,
        paddingRight: 0,
        paddingLeft: spacing(),
        position: 'sticky',
        top: 0,
        zIndex: 10,
    },
    fioAndPosition: {
        'padding': spacing(0),
        '&$headerCell': {
            paddingLeft: spacing(3),
        },
    },
    workEmailAndPrivateEmail: {
        width: '18%',
    },
    skypeAndPhone: {
        width: '18%',
    },
    countryAndBirthday: {
        width: '20%',
    },
    actions: {
        width: spacing(6),
        maxWidth: spacing(6),
        padding: `${spacing(2, 1, 0, 0.5)} !important`,
        verticalAlign: 'top',
    },
    row: {
        'height': spacing(11),
        '&:hover': {
            backgroundColor: 'inherite',
        },
    },
});

export default ContactsCardStyles;
