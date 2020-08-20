// @flow

import React, { useState, useEffect, useCallback } from 'react';
import cn from 'classnames';
import debounce from 'lodash.debounce';
import { Grid, Typography, Tooltip } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import CRMEditableField from 'crm-ui/CRMEditableField/CRMEditableField';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';
import { getCompaniesSearch } from 'crm-api/estimationRequestPageService/estimationCard';
import CRMAutocompleteSelect from 'crm-components/crmUI/CRMAutocompleteSelect/CRMAutocompleteSelect';
import type { EstimationRequest } from 'crm-constants/estimationRequestPage/estimationRequestPageConstants';
import { useTranslation } from 'crm-hooks/useTranslation';

import styles from './AttributesStyles';

type CompanyType = {
    id: number,
    name: string,
}

type Props = {
    estimationId: string,
    classes: Object,
    company: string,
    updateEstimation: (estimationId: string, fieldName: string, updateData: string | number) => Promise<EstimationRequest>,
}

const CompanySelect = ({
    estimationId,
    classes,
    company,
    updateEstimation,
}: Props) => {
    const [localCompany, setLocalCompany] = useState({});
    const [localCompanyId, setLocalCompanyId] = useState(0);

    const translations = {
        company: useTranslation('requestForEstimation.requestSection.company'),
    };

    useEffect(() => {
        if (company) {
            setLocalCompany({ id: localCompanyId, name: company });
        }
    }, [company]);

    const handleSearch = (searchCompanyValue: string, callback: (Array<{id: number, name: string}>) => void) => {
        getCompaniesSearch(searchCompanyValue, 50).then(({ content }) => {
            callback(content);
        });
    };

    const debounceHandleSearch = useCallback(debounce((
        searchCompanyValue: string,
        callback: (Array<{id: number, name: string}>) => void,
    ) => handleSearch(searchCompanyValue, callback), 300), []);

    const renderCustomLabel = () => (localCompany.name
        ? <Tooltip
            title={localCompany.name}
            interactive
            placement='bottom-start'
        >
            <Typography className={cn(classes.editable, classes.cellEllipsis)}>
                {localCompany.name}
            </Typography>
        </Tooltip>
        : <CRMEmptyBlock className={classes.editable} />
    );

    const changeCompany = async (selectedCompany: CompanyType) => {
        if (selectedCompany) {
            setLocalCompanyId(selectedCompany.id);
            await updateEstimation(estimationId, 'companyId', selectedCompany.id);
        }
    };

    return (
        <Grid
            item
            container
            direction='row'
            justify='space-between'
            alignItems='center'
            xs={12}
            wrap='nowrap'
        >
            <Grid className={classes.label}>
                {`${translations.company}:`}
            </Grid>
            <Grid className={classes.value}>
                <CRMEditableField
                    component={CRMAutocompleteSelect}
                    componentType='select'
                    renderCustomLabel={renderCustomLabel}
                    disableEdit
                    componentProps={{
                        cacheOptions: true,
                        async: true,
                        value: localCompany,
                        loadOptions: debounceHandleSearch,
                        onChange: changeCompany,
                        autoFocus: true,
                        getOptionLabel: (option: CompanyType) => option.name,
                        getOptionValue: (option: CompanyType) => option.id,
                    }}
                />
            </Grid>
        </Grid>
    );
};

export default withStyles(styles)(CompanySelect);
