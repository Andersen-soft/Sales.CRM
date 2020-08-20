// @flow

export default (callback: Function, args: Object) => async ({ target }: SyntheticEvent<HTMLElement>) => {
    if (!(target instanceof HTMLElement)) {
        return;
    }

    const isScrolledToBottom = Math.floor(target.scrollHeight - target.scrollTop) === target.clientHeight;
    const scrollTopPosition = target.scrollTop;

    if (isScrolledToBottom) {
        await callback(args);
        target.scrollTop = scrollTopPosition;
    }
};
