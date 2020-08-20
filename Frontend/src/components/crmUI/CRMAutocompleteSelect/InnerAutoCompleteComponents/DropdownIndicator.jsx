// @flow

import React from 'react';

import { ArrowDropDown } from '@material-ui/icons';

type Props = {
    selectProps: {
        classes: Object,
    },
}

const DropdownIndicator = ({ selectProps }: Props) => (<ArrowDropDown className={selectProps.classes.arrow} />);

export default DropdownIndicator;
