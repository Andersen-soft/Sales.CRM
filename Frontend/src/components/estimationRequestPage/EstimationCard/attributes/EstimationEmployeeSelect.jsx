// @flow

import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { equals } from 'ramda';
import cn from 'classnames';
import { Grid } from '@material-ui/core';
import getEmployees from 'crm-api/saleCard/employeeServiceForSale';
import CRMEditableField from 'crm-ui/CRMEditableField/CRMEditableField';
import CRMAutocompleteSelect from 'crm-ui/CRMAutocompleteSelect/CRMAutocompleteSelect';
import UserInformationPopover from 'crm-components/common/UserInformationPopover/UserInformationPopover';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';

import type { StyledComponentProps } from '@material-ui/core/es';

import styles from './AttributesStyles';

type UserSuggestion = {
    label: string,
    value: number,
}
type EmployeeType = {
    id: number,
    firstName: string,
    lastName: string,
}

type Props = {
    updateHandler: (estimationId: string, fieldName: string, updateData: string | number) => void,
    employee: EmployeeType,
    updateActivities: (size?: number, page?: number) => void,
    reloadCard: () => void,
    disable: boolean,
    employeesFilterParams: Object,
    title: string,
    fieldName: string,
    requestId: string,
    componentProps?: Object,
} & StyledComponentProps;

const CLEAR_VALUE = -1;

const EmployeeSelect = ({
    updateHandler,
    employee,
    updateActivities,
    reloadCard,
    disable,
    employeesFilterParams,
    title,
    fieldName,
    classes,
    requestId,
    componentProps,
}: Props) => {
    const [userList, setUserList] = useState([]);
    const [user, setUser]: [UserSuggestion, Function] = useState({});
    const [localEmployeesFilterParams, setLocalEmployeesFilterParams] = useState(null);

    useEffect(() => {
        if (!equals(employeesFilterParams, localEmployeesFilterParams)) {
            setLocalEmployeesFilterParams(employeesFilterParams);
            (async () => {
                const response = await getEmployees(employeesFilterParams);

                const transformedUserList = response.content.map(
                    ({ firstName, lastName, id }) => ({ label: `${firstName} ${lastName}`, value: id })
                );

                setUserList(transformedUserList);
            })();
        }
    }, [employeesFilterParams]);

    useEffect(() => {
        if (employee && employee.id !== user.value) {
            const { firstName = '', lastName = '', id = null } = employee;
            const fullName = `${firstName} ${lastName}`.trim();

            setUser({ label: fullName, value: id });
        }
    }, [employee]);

    const handleChange = (newUser: UserSuggestion) => {
        if (newUser) {
            updateHandler(requestId, fieldName, newUser.value);
            setUser({ label: newUser.label, value: newUser.value });
        } else {
            setUser({ label: null, value: null });
        }
    };

    const handlerCloseEditMode = () => {
        if (!user.value) {
            updateHandler(requestId, fieldName, CLEAR_VALUE);
        }
    };

    const getUserUpdate = ({ id, firstName }) => {
        user
            && user.label !== firstName
            && setUser({ label: firstName, value: id });

        reloadCard();
    };

    const renderCustomLabel = () => (
        user.value
            ? <UserInformationPopover
                userName={user.label}
                userNameStyle={cn({ [classes.employeeDisable]: disable }, classes.employeeFullName)}
                userId={user.value}
                reloadParent={getUserUpdate}
            />
            : <CRMEmptyBlock className={cn(classes.editable, { [classes.employeeDisable]: disable })} />
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
                {title}
            </Grid>
            <Grid className={classes.value}>
                <CRMEditableField
                    component={CRMAutocompleteSelect}
                    componentType='select'
                    renderCustomLabel={renderCustomLabel}
                    onCloseEditMode={handlerCloseEditMode}
                    disableEdit={disable}
                    componentProps={{
                        ...componentProps,
                        controlled: true,
                        value: user,
                        options: userList,
                        onChange: handleChange,
                        autoFocus: true,
                        menuIsOpen: true,
                    }}
                />
            </Grid>
        </Grid>
    );
};

export default withStyles(styles)(EmployeeSelect);
