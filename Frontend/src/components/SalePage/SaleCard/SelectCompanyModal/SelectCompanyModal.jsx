// @flow

import React, { useState, useEffect, useCallback } from 'react';
import {
    Grid,
    Paper,
    Dialog,
    DialogActions,
    IconButton,
} from '@material-ui/core';
import { pathOr } from 'ramda';
import { withStyles } from '@material-ui/core/styles';
import debounce from 'lodash.debounce';
import Close from '@material-ui/icons/Close';
import CRMAutocompleteSelect from 'crm-components/crmUI/CRMAutocompleteSelect/CRMAutocompleteSelect';
import CRMButton from 'crm-ui/CRMButton/CRMButton';
import CRMIcon from 'crm-icons/CRMIcon';
import { useTranslation } from 'crm-hooks/useTranslation';
import { getCompaniesSearch } from 'crm-api/companyCardService/companyCardService';
import { CANCELED_REQUEST } from 'crm-constants/common/constants';

import styles from './SelectCompanyModalStyles';

type Recommendation = {
    id: number,
    name: string,
}

type Props = {
    classes: Object,
    isShowModal: boolean,
    toggleShowModal: () => void,
    recommendation: Recommendation,
    onSaveRecommendation: (id: number) => void,
};

const CLEAR_VALUE = -1;
const SIZE = 150;

const SelectCompanyModal = ({
    classes,
    isShowModal,
    toggleShowModal,
    recommendation,
    onSaveRecommendation,
}: Props) => {
    const [localRecommendation, setLocalRecommendation]: [Recommendation, Function] = useState(recommendation);

    useEffect(() => {
        setLocalRecommendation(recommendation);
    }, [recommendation]);

    const translations = {
        changeRecommendationCompany: useTranslation('sale.saleSection.changeRecommendationCompany'),
        recommendationCompany: useTranslation('sale.saleSection.recommendationCompany'),
        cancel: useTranslation('common.cancel'),
        save: useTranslation('common.save'),
    };

    const handleSearch = (searchCompanyValue: string, callback: (Array<{id: number, name: string}>) => void) => {
        getCompaniesSearch(searchCompanyValue, SIZE, CANCELED_REQUEST).then(({ content }) => {
            callback(content);
        });
    };

    const debounceHandleSearch = useCallback(debounce((
        searchCompanyValue: string,
        callback: (Array<{id: number, name: string}>) => void,
    ) => handleSearch(searchCompanyValue, callback), 300), []);

    const changeRecommendation = (company: Recommendation | null) => setLocalRecommendation(company);

    const saveHandler = () => {
        onSaveRecommendation(pathOr(CLEAR_VALUE, ['id'], localRecommendation));
        toggleShowModal();
    };

    return (
        <Dialog
            open={isShowModal}
            onClose={toggleShowModal}
        >
            <Paper classes={{ rounded: classes.rounded }}>
                <IconButton
                    className={classes.exitButton}
                    onClick={toggleShowModal}
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
                        {`${translations.changeRecommendationCompany}:`}
                    </Grid>
                </Grid>
                <Grid className={classes.selectContainer}>
                    <CRMAutocompleteSelect
                        cacheOptions
                        async
                        value={localRecommendation}
                        loadOptions={debounceHandleSearch}
                        onChange={changeRecommendation}
                        getOptionLabel={(option: Recommendation) => option.name}
                        getOptionValue={(option: Recommendation) => option.id}
                        menuPosition='fixed'
                        menuShouldBlockScroll
                        controlled
                        label={translations.recommendationCompany}
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
                                onClick={toggleShowModal}
                                size='large'
                            >
                                {translations.cancel}
                            </CRMButton>
                        </Grid>
                        <Grid item>
                            <CRMButton
                                onClick={saveHandler}
                                primary
                                size='large'
                            >
                                {translations.save}
                            </CRMButton>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Paper>
        </Dialog>
    );
};

export default withStyles(styles)(SelectCompanyModal);
