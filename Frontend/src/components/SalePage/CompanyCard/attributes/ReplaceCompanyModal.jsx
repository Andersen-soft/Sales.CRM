// @flow

import React, { useState, useCallback } from 'react';
import {
    Grid,
    DialogActions,
    Dialog,
    IconButton,
} from '@material-ui/core';
import CRMIcon from 'crm-icons';
import debounce from 'lodash.debounce';
import Close from '@material-ui/icons/Close';
import CRMButton from 'crm-ui/CRMButton/CRMButton';
import { useTranslation } from 'crm-hooks/useTranslation';
import CRMAutocompleteSelect from 'crm-ui/CRMAutocompleteSelect/CRMAutocompleteSelect';
import { getCompaniesSearch } from 'crm-api/companyCardService/companyCardService';
import { CANCELED_REQUEST } from 'crm-constants/common/constants';

type Props = {
    open: boolean,
    onClose: () => void,
    classes: Object,
    saveCompany: (id:number) => Promise<Object>,
};

type Company = {
    id: number,
    name: string,
}

const ReplaceCompanyModal = ({
    open,
    onClose,
    classes,
    saveCompany,
}: Props) => {
    const [company, setCompany]: [Company | null, Function] = useState(null);

    const translations = {
        companySelect: useTranslation('sale.companySection.changeCompany.companySelect'),
        companyName: useTranslation('sale.companySection.changeCompany.companyName'),
        cancel: useTranslation('common.cancel'),
        save: useTranslation('common.save'),
    };

    const handleSearch = (searchCompanyValue: string, callback: (Array<{id: number, name: string}>) => void) => {
        getCompaniesSearch(searchCompanyValue, 150, CANCELED_REQUEST).then(({ content }) => {
            callback(content);
        });
    };

    const debounceHandleSearch = useCallback(debounce((
        searchCompanyValue: string,
        callback: (Array<{id: number, name: string}>) => void,
    ) => handleSearch(searchCompanyValue, callback), 300), []);

    const changeCompany = (companySugestion: Company | null) => setCompany(companySugestion);

    const getOptionLabel = (option: Company) => option.name;

    const getOptionValue = (option: Company) => option.id;

    const handleSaveCompany = () => company && saveCompany(company.id);

    return <Dialog
        open={open}
        onClose={onClose}
        classes={{ paper: classes.containerDialog }}
    >
        <IconButton
            className={classes.exitButton}
            onClick={onClose}
        >
            <CRMIcon IconComponent={Close} />
        </IconButton>
        <Grid
            container
            justify='center'
            className={classes.modalTitle}
        >
            <Grid
                item
                className={classes.title}
            >
                {translations.companySelect}
            </Grid>
        </Grid>
        <Grid className={classes.selectContainer}>
            <CRMAutocompleteSelect
                cacheOptions
                async
                value={company}
                loadOptions={debounceHandleSearch}
                onChange={changeCompany}
                getOptionLabel={getOptionLabel}
                getOptionValue={getOptionValue}
                menuPosition='fixed'
                menuShouldBlockScroll
                controlled
                label={translations.companyName}
            />
        </Grid>
        <DialogActions className={classes.actions}>
            <Grid
                container
                justify='center'
            >
                <Grid
                    item
                    className={classes.buttonContainer}
                >
                    <CRMButton
                        onClick={onClose}
                        size='large'
                    >
                        {translations.cancel}
                    </CRMButton>
                </Grid>
                <Grid item>
                    <CRMButton
                        primary
                        onClick={handleSaveCompany}
                        disabled={!company}
                        size='large'
                    >
                        {translations.save}
                    </CRMButton>
                </Grid>
            </Grid>
        </DialogActions>
    </Dialog>;
};

export default ReplaceCompanyModal;
