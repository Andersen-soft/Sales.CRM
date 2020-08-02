// @flow

import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';

import getEmployees from 'crm-api/saleCard/employeeServiceForSale';
import { SALE_ID, HEAD_SALE_ID, SITE_ID, MANAGER_ID } from 'crm-constants/roles';
import CRMEditableField from 'crm-ui/CRMEditableField/CRMEditableField';
import CRMAutocompleteSelect from 'crm-ui/CRMAutocompleteSelect/CRMAutocompleteSelect';
import UserInformationPopover from 'crm-components/common/UserInformationPopover/UserInformationPopover';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';

import type { Sale } from 'crm-types/sales';
import type { StyledComponentProps } from '@material-ui/core/es';
import { useTranslation } from 'crm-hooks/useTranslation';

import styles from './AttributesStyles';

type ResponsibleUserSuggestion = {
    label: string,
    value: number,
}

type Props = {
    sale: Sale,
    updateHandler: ({ responsibleId: number }) => void,
    updateActivities: (saleId: number, size?: number, page?: number) => void,
    disable: boolean,
} & StyledComponentProps;

const ResponsibleUser = ({
    sale,
    updateHandler,
    classes,
    disable,
    updateActivities,
}: Props) => {
    const [responsibleUserList, setResponsibleUserList] = useState([]);
    const [responsibleUser, setResponsibleUser] = useState(null);

    const translations = {
        responsible: useTranslation('sale.saleSection.responsible'),
    };

    useEffect(() => {
        (async () => {
            const response = await getEmployees({ role: [SALE_ID, HEAD_SALE_ID, SITE_ID, MANAGER_ID] });
            const transformedResponsibleUserList = response.content.map(
                ({ firstName, lastName, id }) => ({ label: `${firstName} ${lastName}`, value: id })
            );

            setResponsibleUserList(transformedResponsibleUserList);
        })();
    }, []);

    useEffect(() => {
        if (sale.responsible) {
            const { firstName = '', lastName = '', id = null } = sale.responsible;
            const fullName = `${firstName} ${lastName}`.trim();

            setResponsibleUser({ label: fullName, value: id });
        }
    }, [sale]);

    const handleChange = (responsible: ResponsibleUserSuggestion) => {
        if (responsible) {
            updateHandler({ responsibleId: responsible.value });
            setResponsibleUser({ label: responsible.label, value: responsible.value });
        } else {
            setResponsibleUser({ label: null, value: null });
        }
    };

    const handlerCloseEditMode = () => {
        if (!responsibleUser) {
            const { firstName = '', lastName = '', id = null } = sale.responsible;
            const fullName = `${firstName} ${lastName}`.trim();

            setResponsibleUser({ label: fullName, value: id });
        }
    };

    const getUserUpdate = ({ id, firstName, lastName }) => {
        const fullName = `${firstName} ${lastName}`.trim();

        responsibleUser
            && responsibleUser.label !== fullName
            && setResponsibleUser({ label: fullName, value: id });

        updateActivities(sale.id);
    };

    const renderCustomLabel = () => (
        responsibleUser
            ? <UserInformationPopover
                userName={responsibleUser.label}
                userNameStyle={classes.fullName}
                userId={responsibleUser.value}
                reloadParent={getUserUpdate}
            />
            : <CRMEmptyBlock className={classes.fullName} />
    );

    return (
        <Grid
            item
            container
            direction='row'
            justify='space-between'
            alignItems='center'
            xs={12} sm={12}
            lg={12} xl={12}
            wrap='nowrap'
        >
            <Grid className={classes.label}>
                {`${translations.responsible}:`}
            </Grid>
            <Grid className={classes.value}>
                <CRMEditableField
                    component={CRMAutocompleteSelect}
                    componentType='select'
                    disableEdit={disable}
                    renderCustomLabel={renderCustomLabel}
                    onCloseEditMode={handlerCloseEditMode}
                    componentProps={{
                        controlled: true,
                        value: responsibleUser,
                        options: responsibleUserList,
                        onChange: handleChange,
                        autoFocus: true,
                        menuIsOpen: true,
                        isClearable: false,
                    }}
                />
            </Grid>
        </Grid>
    );
};

export default withStyles(styles)(ResponsibleUser);
