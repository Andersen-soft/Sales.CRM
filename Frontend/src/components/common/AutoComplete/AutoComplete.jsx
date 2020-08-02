// @flow

import React from 'react';

import { withStyles } from '@material-ui/core/styles';
// $FlowFixMe // TODO: delete line after update Select
import Select from 'react-select';
import { grey, red } from '@material-ui/core/colors';

import {
    Control,
    Menu,
    NoOptionsMessage,
    Option,
    ValueContainer,
    MenuList,
    Placeholder,
    DropdownIndicator,
} from './InnerAutoCompleteComponents';

import styles from './AutoCompleteStyles';

export type Suggestion = {
    label: string | number,
    value: string | number,
}

const components = {
    Control,
    Menu,
    NoOptionsMessage,
    Option,
    MenuList,
    ValueContainer,
    Placeholder,
    DropdownIndicator,
};

type AutoCompleteProps = {
    classes: Object,
    theme: Object,
    onChange: (value: Suggestion) => void,
    options: Array<Suggestion>,
    value: Suggestion,
    minInputWidth: number,
    placeholder: string,
    containerStyles: Object,
    onBlur: (SyntheticFocusEvent<HTMLElement>) => void,
    autoFocus: boolean,
    error: Object,
    maxMenuHeight: number,
    maxMenuWidth: number,
    paperClass: Object,
    isClearable: ?boolean,
    isMulti?: boolean,
    menuIsOpen: boolean,
    isDisabled: boolean,
    noOptionsMessage: string
}


const AutoComplete = (props: AutoCompleteProps) => {
    const {
        classes,
        theme,
        onChange,
        onBlur,
        options,
        value,
        minInputWidth = 0,
        placeholder,
        autoFocus = false,
        containerStyles = {},
        error,
        maxMenuHeight = 350,
        maxMenuWidth = 350,
        paperClass,
        isClearable = true,
        isMulti = false,
        menuIsOpen,
        isDisabled,
        noOptionsMessage = 'No data to display',
    } = props;

    const selectStyles = {
        root: base => ({
            ...base,
            color: 'grey',
            margin: 20,
        }),
        singleValue: base => ({
            ...base,
            maxWidth: '100%',
        }),
        indicatorSeparator: base => ({
            ...base,
            display: 'none',
        }),
        input: base => ({
            ...base,
            'minWidth': minInputWidth,
            'color': theme.palette.text.primary,
            '& input': {
                font: 'inherit',
            },
        }),
        clearIndicator: base => ({
            ...base,
            'color': grey[500],
            'fontSize': 20,
            'padding': 0,
            'paddingLeft': 4,
            '&:hover': {
                cursor: 'pointer',
                color: red[500],
            },
            'zIndex': 10,
        }),
        container: base => ({
            ...base,
            ...containerStyles,
            position: 'static',
        }),
        multiValue: base => ({
            ...base,
            position: 'relative',
            bottom: 8,
        }),
        multiValueRemove: base => ({
            ...base,
            cursor: 'pointer',
        }),
    };

    return (
        <Select
            classes={classes}
            styles={selectStyles}
            options={options}
            components={components}
            value={value}
            error={error}
            onChange={onChange}
            onBlur={onBlur}
            isDisabled={isDisabled}
            autoFocus={autoFocus}
            noOptionsMessage={() => noOptionsMessage}
            placeholder={placeholder || ''}
            isClearable={isClearable}
            maxMenuHeight={maxMenuHeight}
            maxMenuWidth={maxMenuWidth}
            paperClass={paperClass}
            isMulti={isMulti}
            menuIsOpen={menuIsOpen}
        />
    );
};

export default withStyles(styles, { withTheme: true })(AutoComplete);
