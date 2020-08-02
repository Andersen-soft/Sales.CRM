// @flow

import React, { useState, useCallback } from 'react';
import debounce from 'lodash.debounce';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import {
    Paper,
    MenuItem,
    FormControl,
    Fade,
    LinearProgress,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import CRMInput from 'crm-ui/CRMInput/CRMInput';
import { CANCELED_REQUEST } from 'crm-constants/common/constants';

import styles from './CRMAutocompleteInputStyles';

const renderInputComponent = ({
    classes,
    ref,
    inputRef = node => { ref(node); },
    error,
    fullWidth,
    variant,
    label,
    onClear,
    onBlur,
    value,
    loading,
    placeholder,
    ...other
}: Object) => (
    <FormControl
        fullWidth
        error={!!error}
    >
        <CRMInput
            label={label}
            placeholder={placeholder}
            searchable={!error}
            error={error}
            onBlur={onBlur}
            onClear={onClear}
            fullWidth
            value={value}
            InputLabelProps={{
                classes: { root: classes.label, outlined: classes.outlined },
            }}
            {...other}
        />
        <Fade
            in={loading}
            unmountOnExit
        >
            <LinearProgress
                value={100}
                valueBuffer={5}
                classes={{
                    root: classes.loader,
                }}
            />
        </Fade>
    </FormControl>
);

const renderSuggestion = (suggestion: *, { query, isHighlighted }: { query: string, isHighlighted: boolean}) => {
    const matches = match(suggestion.label, query);
    const parts = parse(suggestion.label, matches);

    return (
        <MenuItem selected={isHighlighted} component='div'>
            <div>
                {parts.map((part, index) => (part.highlight ? (
                    <span key={String(index)} style={{ fontWeight: 500 }}>
                        {part.text}
                    </span>
                ) : (
                    <strong key={String(index)} style={{ fontWeight: 300 }}>
                        {part.text}
                    </strong>
                )))}
            </div>
        </MenuItem>
    );
};

const getSuggestionValue = (suggestion: *) => suggestion.label;

type SearchList = {
    content: Array<*>,
}

type Props = {
    classes: Object,
    error: string,
    value: string,
    onClear: (*) => void,
    onChange: (*) => void,
    onBlur: (*) => void,
    onSuggestionSelected: (*) => void,
    searchOptionsHandler: (value: string, count: number, canceled?: boolean) => SearchList,
    placeholder: string,
    label: string,
    variant: string,
    fullWidth: boolean,
    menuItemsCount: number,
};

const CRMAutocompleteInput = ({
    searchOptionsHandler,
    menuItemsCount,
    onClear,
    classes,
    error,
    value = '',
    onChange = () => {},
    onBlur = () => {},
    onSuggestionSelected = () => {},
    placeholder,
    label,
    variant,
    fullWidth = false,
}: Props) => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSuggestionsFetchRequested = async ({ value: inputValue } : { value: string }) => {
        if (inputValue) {
            !loading && setLoading(true);

            const valuesForSuggestions = await searchOptionsHandler(inputValue, menuItemsCount, CANCELED_REQUEST);
            const suggestionsList = valuesForSuggestions.content.map(({ id, name }) => ({ label: name, value: id }));

            setSuggestions(suggestionsList);
            setLoading(false);
        }
    };

    const debouncedFetchRequeste = useCallback(debounce(event => handleSuggestionsFetchRequested(event), 300), []);

    const handleSuggestionsClearRequested = () => {
        setSuggestions([]);
        loading && setLoading(false);
    };

    const handleCLearInput = () => {
        handleSuggestionsClearRequested();
        onClear();
    };

    const autosuggestProps = {
        renderInputComponent,
        suggestions,
        onSuggestionsFetchRequested: debouncedFetchRequeste,
        onSuggestionsClearRequested: handleSuggestionsClearRequested,
        getSuggestionValue,
        renderSuggestion,
        onSuggestionSelected,
    };

    return (
        <div className={classes.root}>
            <Autosuggest
                {...autosuggestProps}
                inputProps={{
                    classes,
                    placeholder,
                    value,
                    onChange,
                    onBlur,
                    fullWidth,
                    error,
                    label,
                    variant,
                    loading,
                    onClear: handleCLearInput,
                }}
                focusInputOnSuggestionClick={false}
                theme={{
                    container: classes.container,
                    input: classes.input,
                    suggestionsContainerOpen: classes.suggestionsContainerOpen,
                    suggestionsList: classes.suggestionsList,
                    suggestion: classes.suggestion,
                }}
                renderSuggestionsContainer={options => (
                    <Paper {...options.containerProps} square>
                        {options.children}
                    </Paper>
                )}
            />
        </div>
    );
};

export default withStyles(styles)(CRMAutocompleteInput);
