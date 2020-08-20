// @flow

export type Location = {
    hash: string | void,
    key: string | void,
    pathname: string | void,
    search: string | void,
    state: {
        from: {
            pathname: string | void,
            hash: string | void,
            key: string | void,
            search: string | void,
            state: Object | void,
        },
    },
};
