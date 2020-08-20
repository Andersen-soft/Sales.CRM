// @flow

import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { pathOr } from 'ramda';
import { withStyles } from '@material-ui/core/styles/index';
import CRMAutocompleteSelect from 'crm-ui/CRMAutocompleteSelect/CRMAutocompleteSelect';

import type { StyledComponentProps } from '@material-ui/core/es';

import styles from './filterStyles';

type Suggestion = {
    label: string,
    value: number,
};

type Props = {
    filters: Object,
    filterName: string,
    onSetFilters: (filterName: string, filterValue: number | Array<string> | string) => void;
    getFilterParams: () => void,
    onClose: () => void;
} & StyledComponentProps;

const AutoCompleteFilter = ({
    filters,
    filterName,
    onSetFilters,
    getFilterParams,
    onClose,
    classes,
}: Props) => {
    const [suggestions, setSuggestions] = useState([]);
    const [selectedSuggestion, setSelectedSuggestion] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const suggestionsList = await getFilterParams({ ...filters, [filterName]: null }, filterName);

            setSuggestions(suggestionsList);
            setSelectedSuggestion(suggestionsList.find(suggestion => suggestion.value === filters[filterName]));
            setIsLoading(false);
        })();
    }, []);

    const handleChange = (suggestion: Suggestion | null) => {
        setSelectedSuggestion(suggestion);
        onClose();
        onSetFilters(filterName, pathOr(null, ['value'], suggestion));
    };

    return (
        <Grid classes={{ root: classes.inputFilterRoot }}>
            <CRMAutocompleteSelect
                autoFocus
                controlled
                isClearable={false}
                options={suggestions}
                value={selectedSuggestion}
                onChange={handleChange}
                defaultMenuIsOpen
                isLoading={isLoading}
            />
        </Grid>
    );
};

export default withStyles(styles)(AutoCompleteFilter);
