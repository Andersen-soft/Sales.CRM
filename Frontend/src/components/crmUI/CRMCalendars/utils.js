export const getMinMaxBoundariesProps = (minDate, maxDate) => {
    const minMaxBoundariesProps = {};

    if (minDate) {
        minMaxBoundariesProps.minDate = minDate;
    }

    if (maxDate) {
        minMaxBoundariesProps.maxDate = maxDate;
    }

    return minMaxBoundariesProps;
};
