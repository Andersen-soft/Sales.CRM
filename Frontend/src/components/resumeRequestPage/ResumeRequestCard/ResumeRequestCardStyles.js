// @flow

const ResumeRequestCardStyles = ({ spacing }: Object) => ({
    root: {
        padding: spacing(2, 3, 1, 3),
        position: 'relative',
        borderRadius: spacing(),
        height: '100%',
    },
    list: {
        padding: 0,
    },
    listItem: {
        marginBottom: spacing(3.25),
        padding: 0,
    },
    headerItem: {
        marginBottom: spacing(2.25),
    },
    deadline: {
        marginBottom: spacing(2.5),
    },
    radioGroup: {
        height: 'auto',
        marginBottom: spacing(3),
    },
    rootMobile: {
        padding: spacing(2, 1, 0, 1),
    },
    listItemMobile: {
        marginBottom: spacing(2.5),
        padding: 0,
    },
});

export default ResumeRequestCardStyles;
