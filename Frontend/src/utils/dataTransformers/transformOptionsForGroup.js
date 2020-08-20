
export default options => options.reduce((result, { id, name, common }) => {
    if (common) {
        return { common: [...result.common, { label: name, value: id, group: common }], other: result.other };
    }

    return { common: result.common, other: [...result.other, { label: name, value: id, group: common }] };
}, { common: [], other: [] });

