// @flow

import React from 'react';
import cn from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography, Tooltip } from '@material-ui/core';

import CRMEditableField from 'crm-ui/CRMEditableField/CRMEditableField';
import CRMAutocompleteSelect from 'crm-components/crmUI/CRMAutocompleteSelect/CRMAutocompleteSelect';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';

import styles from '../AttributesMobileStyles';

type CompanyType = {
    id: number,
    name: string,
}

type Props = {
    classes: Object,
    translateCompany: string,
    localCompany: Object,
    disable: boolean,
    debounceHandleSearch: () => void,
    changeCompany: () => void,
}

const ResumeCompanyMobile = ({
    classes,
    translateCompany,
    localCompany,
    disable,
    debounceHandleSearch,
    changeCompany,
}: Props) => {
    const renderCustomLabel = () => (localCompany.name
        ? <Tooltip
            title={localCompany.name}
            interactive
            placement='bottom-start'
        >
            <Typography className={cn(classes.inputEditable, classes.inputEllipsis)}>
                {localCompany.name}
            </Typography>
        </Tooltip>
        : <CRMEmptyBlock className={classes.inputEditable} />
    );

    return (
        <Grid className={classes.filedContainer}>
            <Typography className={classes.inputLabel}>
                {`${translateCompany}:`}
            </Typography>
            <CRMEditableField
                component={CRMAutocompleteSelect}
                componentType='select'
                renderCustomLabel={renderCustomLabel}
                disableEdit={disable}
                justify='space-between'
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
    );
};

export default withStyles(styles)(ResumeCompanyMobile);
