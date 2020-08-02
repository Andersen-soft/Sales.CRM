// @flow

import React from 'react';
import cn from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography, Tooltip } from '@material-ui/core';

import CRMEditableField from 'crm-ui/CRMEditableField/CRMEditableField';
import CRMAutocompleteSelect from 'crm-components/crmUI/CRMAutocompleteSelect/CRMAutocompleteSelect';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';

import styles from '../AttributesDesktopStyles';

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

const ResumeCompanyDesktop = ({
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
            <Typography
                className={cn(
                    classes.editable,
                    classes.cellBigEllipsis,
                    { [classes.disable]: disable }
                )}
            >
                {localCompany.name}
            </Typography>
        </Tooltip>
        : <CRMEmptyBlock className={classes.emptyBlock} />
    );

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
                {`${translateCompany}:`}
            </Grid>
            <Grid className={classes.bigValue}>
                <CRMEditableField
                    component={CRMAutocompleteSelect}
                    componentType='select'
                    renderCustomLabel={renderCustomLabel}
                    disableEdit={disable}
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

export default withStyles(styles)(ResumeCompanyDesktop);
