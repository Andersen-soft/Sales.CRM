// @flow

import React from 'react';
// $FlowFixMe
import { components } from 'react-select';
import cn from 'classnames';

const Control = (props: *) => {
    const { selectProps: { label, classes, menuIsOpen }, hasValue, isFocused } = props;

    return <div className={classes.customControl}>
        <div className={cn(classes.label, { [classes.topLabel]: menuIsOpen || hasValue || isFocused })}>
            {label}
        </div>
        <components.Control {...props} />
    </div>;
};

export default Control;
