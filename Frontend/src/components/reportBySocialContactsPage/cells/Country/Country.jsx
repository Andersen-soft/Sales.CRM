// @flow

import React, { useState, useEffect, memo } from 'react';
import { Grid } from '@material-ui/core';
import CRMAutocompleteSelect from 'crm-ui/CRMAutocompleteSelect/CRMAutocompleteSelect';
import { getCountry } from 'crm-api/contactsCard/contactsCardService';

type Props = {
  values: { value: number, label: string },
  isEdit: boolean,
  updateEditRowState: (key: string, value: { id: number, name: string }) => void,
};

const areEqualProps = (
    { values: { value: prevCountryId }, isEdit: prevIsEdit },
    { values: { value: nextCountryId }, isEdit: nextIsEdit }
) => (prevCountryId === nextCountryId) && (prevIsEdit === nextIsEdit);

const Country = ({
    values,
    isEdit,
    updateEditRowState,
}: Props) => {
    const [localCountry, setLocalCountry] = useState(values);
    const [countryList, setCountryList] = useState([]);
    const [loadingCountryList, setLoadingCountryList] = useState(false);

    useEffect(() => {
        if (isEdit) {
            setLoadingCountryList(true);
            getCountry().then(countries => {
                const countriesSuggestions = countries.map(({ name, id }) => ({
                    label: name,
                    value: id,
                }));

                setCountryList(countriesSuggestions);
                setLoadingCountryList(false);
            });
        }
        setLocalCountry(values);
    }, [isEdit]);

    const changeCountry = ({ label, value }) => {
        setLocalCountry({ label, value });
        updateEditRowState('country', { id: value, name: label });
    };

    return isEdit
        ? <CRMAutocompleteSelect
            value={localCountry}
            options={countryList}
            onChange={changeCountry}
            isClearable={false}
            menuPosition={'fixed'}
            menuShouldBlockScroll
            controlled
            isLoading={loadingCountryList}
        />
        : <Grid>
            {localCountry.label}
        </Grid>;
};

export default memo < Props > (Country, areEqualProps); // NOSONAR
