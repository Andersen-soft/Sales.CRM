// @flow

const CommentsListStyles = ({ spacing, mixins: { mobile } }: Object) => ({
    paperRoot: {
        padding: 0,
        height: '100%',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    container: {
        minHeight: '100%',
        maxHeight: spacing(57.625),
    },
    spinnerContainer: {
        height: '100%',
    },
    commentsContainer: {
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: spacing(0, 2),
        flex: 1,
        ...mobile({
            padding: spacing(0, 0.5, 0, 0),
        }),
    },
    list: {
        outline: 'none',
    },
});

export default CommentsListStyles;
