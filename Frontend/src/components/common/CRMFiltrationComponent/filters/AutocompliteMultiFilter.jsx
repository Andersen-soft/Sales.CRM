// @flow

import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { pathOr } from 'ramda';
import { withStyles } from '@material-ui/core/styles/index';
import CRMAutocompleteSelect from 'crm-ui/CRMAutocompleteSelect/CRMAutocompleteSelect';
import CRMButton from 'crm-ui/CRMButton/CRMButton';
import { useTranslation } from 'crm-hooks/useTranslation';

import type { StyledComponentProps } from '@material-ui/core/es';

import styles from './filterStyles';


type Suggestion = {
    label: string,
    value: number,
};

type Props = {
    filters: Object,
    filterName: string,
    onSetFilters: (filterName: string, filterValue: number | Array<number> | string) => void;
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
    const [selectedSuggestion, setSelectedSuggestion] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const translations = {
        apply: useTranslation('common.apply'),
    };

    useEffect(() => {
        (async () => {
            const suggestionsList = await getFilterParams(filters, filterName);

            setSuggestions(suggestionsList);
            setSelectedSuggestion(suggestionsList.filter(
                suggestion => pathOr([], [filterName], filters).includes(suggestion.value)
            ));
            setIsLoading(false);
        })();
    }, []);

    const handleChange = (suggestionsList: Array<Suggestion>) => setSelectedSuggestion(suggestionsList);

    const handleConfirm = () => {
        onClose();
        onSetFilters(filterName, selectedSuggestion.map(({ value }) => value));
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
                isLoading={isLoading}
                isMulti
            />
            <CRMButton
                fullWidth
                onClick={handleConfirm}
                className={classes.applyButton}
            >
                {translations.apply}
            </CRMButton>
        </Grid>
    );
};

export default withStyles(styles)(AutoCompleteFilter);
