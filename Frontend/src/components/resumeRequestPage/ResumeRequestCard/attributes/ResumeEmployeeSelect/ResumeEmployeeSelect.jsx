// @flow

import React, { useState, useEffect } from 'react';
import { equals } from 'ramda';
import getEmployees from 'crm-api/saleCard/employeeServiceForSale';
import type { StyledComponentProps } from '@material-ui/core/es';
import { useMobile } from 'crm-components/common/MobileContextProvider/MobileContextProvider';

import ResumeEmployeeSelectDesktop from './ResumeEmployeeSelectDesktop';
import ResumeEmployeeSelectMobile from './ResumeEmployeeSelectMobile';

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
    updateHandler: (fieldName: string, updateData: string | number) => any,
    employee?: EmployeeType,
    reloadCard: () => Promise<Object>,
    disable?: boolean,
    employeesFilterParams: Object,
    title: string,
    fieldName: string,
    componentProps?: Object,
} & StyledComponentProps;

const CLEAR_VALUE = -1;

const ResumeEmployeeSelect = ({
    updateHandler,
    employee,
    reloadCard,
    disable,
    employeesFilterParams,
    title,
    fieldName,
    classes,
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
            updateHandler(fieldName, newUser.value);
            setUser({ label: newUser.label, value: newUser.value });
        } else {
            setUser({ label: null, value: null });
        }
    };

    const handlerCloseEditMode = () => {
        if (!user.value) {
            updateHandler(fieldName, CLEAR_VALUE);
        }
    };

    const getUserUpdate = ({ id, firstName }) => {
        user
            && user.label !== firstName
            && setUser({ label: firstName, value: id });

        reloadCard();
    };

    const isMobile = useMobile();

    const SectionLayout = isMobile ? ResumeEmployeeSelectMobile : ResumeEmployeeSelectDesktop;

    return (
        <SectionLayout
            classes={classes}
            user={user}
            getUserUpdate={getUserUpdate}
            title={title}
            handlerCloseEditMode={handlerCloseEditMode}
            disable={disable}
            userList={userList}
            handleChange={handleChange}
            componentProps={componentProps}
        />
    );
};

export default ResumeEmployeeSelect;
