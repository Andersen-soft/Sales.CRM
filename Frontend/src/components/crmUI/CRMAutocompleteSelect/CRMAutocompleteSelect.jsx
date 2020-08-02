// @flow

import React, { useState, useEffect } from 'react';
// $FlowFixMe // TODO: delete line after update Select
import SyncSelect, { Async as AsyncSelect } from 'react-select';
import cn from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { Tooltip, IconButton, Grid, Typography } from '@material-ui/core';
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import DropdownIndicator from './InnerAutoCompleteComponents/DropdownIndicator';
import Control from './InnerAutoCompleteComponents/Control';
import Option from './InnerAutoCompleteComponents/Option';
import { useTranslation } from 'crm-hooks/useTranslation';

import { CRMAutocompleteSelectStyles as styles, InnerAutocompleteSelectStyles as selectStyles } from './CRMAutocompleteSelectStyles';

type Suggestion = {
    label: string | number,
    value: string | number,
}

const components = { DropdownIndicator, Control, Option };

type AutoCompleteProps = {
    classes: Object,
    onChange: (value: Suggestion | null) => void,
    options: Array<Suggestion>,
    value: Suggestion,
    placeholder?: string,
    label?: string,
    onBlur: (SyntheticFocusEvent<HTMLElement>) => void,
    onFocus: (SyntheticFocusEvent<HTMLElement>) => void,
    error: boolean,
    autoFocus: boolean,
    maxMenuHeight: number,
    menuPlacement: string,
    isClearable?: boolean,
    isMulti?: boolean,
    isDisabled: boolean,
    controlled?: boolean,
    menuIsOpen: boolean,
    async?: boolean,
    showErrorMessage?: boolean,
    onInputChange?: () => void,
}

export const INPUT_CHANGE_ACTION = 'input-change';
const CLEAR_ACTION = 'clear';

const CRMAutocompleteSelect = ({
    classes,
    value: incomingValue,
    onChange,
    onInputChange,
    onBlur,
    onFocus,
    options,
    placeholder,
    label,
    autoFocus = false,
    maxMenuHeight = 296,
    menuPlacement = 'auto',
    isClearable = true,
    isMulti = false,
    isDisabled,
    controlled = false,
    menuIsOpen,
    error,
    async = false,
    showErrorMessage,
    ...props
}: AutoCompleteProps) => {
    const [value, setValue] = useState(incomingValue);
    const [focused, setFocused] = useState(false);

    const translations = {
        emptyBlock: useTranslation('common.emptyBlock'),
    };

    useEffect(() => {
        if (controlled) {
            setValue(incomingValue);
        }
    }, [incomingValue]);

    const handleChange = (changedValue, option) => {
        let newValue = changedValue;

        if (!controlled) {
            if (option.action === CLEAR_ACTION) {
                newValue = null;
            }

            setValue(newValue);
        }

        onChange && onChange(newValue);
    };

    const Select = async ? AsyncSelect : SyncSelect;

    const handleBlur = event => {
        setFocused(false);
        onBlur && onBlur(event);
    };

    const handleFocus = event => {
        setFocused(true);
        onFocus && onFocus(event);
    };

    return (
        <Grid className={classes.container}>
            <Select
                classes={classes}
                styles={selectStyles}
                options={options}
                components={components}
                value={value}
                onChange={handleChange}
                onInputChange={onInputChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                isDisabled={isDisabled}
                autoFocus={autoFocus}
                menuPlacement={menuPlacement}
                noOptionsMessage={() => translations.emptyBlock}
                placeholder={(!focused && !label && placeholder) ? placeholder : null}
                isClearable={isClearable}
                maxMenuHeight={maxMenuHeight}
                isMulti={isMulti}
                menuIsOpen={menuIsOpen}
                className={cn(classes.container, { [classes.error]: error })}
                label={label}
                {...props}
            />
            {error && (showErrorMessage
                ? <Typography className={classes.errorMessage}>{error}</Typography>
                : <Tooltip
                    title={error}
                    classes={{
                        tooltip: classes.errorPopper,
                    }}
                    placement='top-start'
                    PopperProps={{
                        modifiers: {
                            offset: { offset: '5px, -85px' },
                        },
                    }}
                >
                    <IconButton
                        className={cn(
                            classes.iconButton,
                            classes.errorIcon,
                        )}
                    >
                        <ErrorOutline />
                    </IconButton>
                </Tooltip>)
            }
        </Grid>
    );
};

export default withStyles(styles)(CRMAutocompleteSelect);
