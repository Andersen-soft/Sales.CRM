// @flow

const ResumeModalStyles = ({ spacing }: Object) => ({
    dialogContainer: {
        borderRadius: spacing(),
    },
    mobileDialogContainer: {
        position: 'absolute',
        top: spacing(7),
        height: 'calc(100vh - 96px)',
        borderRadius: 0,
    },
    dialog: {
        width: spacing(55),
        padding: spacing(3),
    },
    mobileDialog: {
        width: '100%',
        padding: spacing(),
    },
    exitButton: {
        position: 'absolute',
        right: spacing(0.5),
        top: spacing(0.5),
    },
    title: {
        padding: spacing(0, 0, 1, 0),
    },
    row: {
        marginTop: spacing(3),
    },
    buttonsContainer: {
        paddingTop: spacing(3),
    },
    button: {
        margin: spacing(1, 0.5),
    },
});

export default ResumeModalStyles;
