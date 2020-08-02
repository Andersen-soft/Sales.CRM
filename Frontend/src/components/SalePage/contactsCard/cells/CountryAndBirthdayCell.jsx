// @flow

import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import { getCountry } from 'crm-api/contactsCard/contactsCardService';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';
import CRMAutocompleteSelect from 'crm-ui/CRMAutocompleteSelect/CRMAutocompleteSelect';
import { useTranslation } from 'crm-hooks/useTranslation';
import { getDate } from 'crm-utils/dates';
import { FULL_DATE_CS, FULL_DATE_DS } from 'crm-constants/dateFormat';
import CRMDatePicker from 'crm-components/common/CRMDatePicker/CRMDatePicker';

import type { StyledComponentProps } from '@material-ui/core/es';

import styles from './cellsStyles';

type CompanyType = {
    value: number,
    label: string,
}

type Props = {
    values: [CompanyType | null, string | null],
    isEdit: boolean,
    updateEditRowState: () => void,
} & StyledComponentProps;

const CountryAndBirthdayCell = ({
    values: [country, birthday],
    isEdit,
    updateEditRowState,
    classes,
}: Props) => {
    const [localCountry, setLocalCountry] = useState(country);
    const [localBirthday, setLocalBirthday] = useState(birthday);
    const [countryList, setCountryList] = useState([]);
    const [countryError, setCountryError] = useState(null);
    const [loadingCountryList, setLoadingCountryList] = React.useState(false);

    const translations = {
        errorRequiredField: useTranslation('forms.errorRequiredField'),
    };

    useEffect(() => {
        if (isEdit) {
            setLoadingCountryList(true);
            getCountry().then(countries => {
                const countriesSuggestions = countries.map(({ name, id }) => ({ label: name, value: id }));

                setCountryList(countriesSuggestions);
                setLoadingCountryList(false);
            });

            setLocalCountry(country);

            if (!country.value) {
                setCountryError(translations.errorRequiredField);
                updateEditRowState('countryId', Error(translations.errorRequiredField));
            }
        }
    }, [isEdit]);

    const changeCountry = newCountry => {
        if (!newCountry) {
            setCountryError(translations.errorRequiredField);
            updateEditRowState('countryId', Error(translations.errorRequiredField));
        } else {
            setCountryError(null);
            setLocalCountry(newCountry);
            updateEditRowState('countryId', newCountry.value);
        }
    };

    const changeBirthday = (date: ?Date) => {
        setLocalBirthday(date);
        updateEditRowState('dateOfBirth', date ? getDate(date, FULL_DATE_DS) : '');
    };

    return (
        <Grid
            container
            direction='column'
        >
            { isEdit
                ? <>
                    <Grid
                        item
                        className={cn(classes.cell, classes.topCell)}
                    >
                        <CRMDatePicker
                            date={localBirthday ? new Date(localBirthday) : null}
                            onChange={changeBirthday}
                            maxDate={new Date()}
                            InputProps={{
                                classes: { root: classes.dateRoot },
                            }}
                            clearable
                            fullWidth
                            showMonthAndYearPickers
                        />
                    </Grid>
                    <Grid
                        item
                        className={classes.cell}
                    >
                        <CRMAutocompleteSelect
                            value={localCountry}
                            options={countryList}
                            onChange={changeCountry}
                            isClearable={false}
                            menuPosition='fixed'
                            menuShouldBlockScroll
                            controlled
                            error={countryError}
                            isLoading={loadingCountryList}
                        />
                    </Grid>
                </>
                : <>
                    <Grid
                        container
                        item
                        className={cn(classes.cell, classes.topCell)}
                    >
                        {birthday ? getDate(birthday, FULL_DATE_CS) : <CRMEmptyBlock className={classes.emptyBlock} /> }
                    </Grid>
                    <Grid
                        item
                        className={classes.cell}
                    >
                        {country.label || <CRMEmptyBlock className={classes.emptyBlock} />}
                    </Grid>
                </>
            }
        </Grid>
    );
};

export default withStyles(styles)(CountryAndBirthdayCell);
