// @flow
import commonStyles from 'crm-styles/common';

const CRMModalStyles = ({ spacing }: Object) => ({
    root: {
        padding: spacing(4),
    },
    large: {
        width: spacing(117),
    },
    medium: {
        width: spacing(84),
    },
    small: {
        width: spacing(55),
    },
    title: {
        paddingTop: 0,
        paddingLeft: 0,
        paddingBottom: spacing(3),
    },
    actions: {
        paddingBottom: 0,
        paddingLeft: 0,
        paddingTop: spacing(5),
    },
    saveBtn: {
        marginLeft: spacing(3),
    },
    confirmationButton: { width: spacing(22.5) },
    closeButton: {
        position: 'absolute',
        right: spacing(0.5),
        top: spacing(0.5),
    },
    ...commonStyles,
});

export default CRMModalStyles;

