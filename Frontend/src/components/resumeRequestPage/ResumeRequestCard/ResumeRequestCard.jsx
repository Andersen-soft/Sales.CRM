// @flow

import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import { includes, pathOr } from 'ramda';
import { useMobile } from 'crm-components/common/MobileContextProvider/MobileContextProvider';
import { useTranslation } from 'crm-hooks/useTranslation';
import { withStyles } from '@material-ui/core/styles';

import { Paper, List, ListItem } from '@material-ui/core';
import CRMLoader from 'crm-ui/CRMLoader/CRMLoader';
import { updateCompany } from 'crm-api/companyCardService/companyCardService';
import { Redirect } from 'react-router-dom';
import { pages } from 'crm-constants/navigation';
import { HEAD_SALE_ID, SALE_ID, MANAGER_ID, RM_ID, HEAD_SALES } from 'crm-roles';
import { CRMError } from 'crm-utils/errors';
import type { ResumeRequest } from 'crm-containers/ResumeRequestPage/ResumeRequestPage';

import styles from './ResumeRequestCardStyles';

import {
    ResumeHeader,
    ResumeCompany,
    ResumeDeadLine,
    ResumeEmployeeSelect,
    ResumeName,
    ResumePriority,
    ResumeSale,
    ResumeStatus,
} from './attributes';

type Props = {
    classes: Object,
    fetchResumeRequest: (number) => void,
    updateResume: (resumeId: number, fieldName: string, updateData: string | number) => boolean,
    request: ResumeRequest,
    error: CRMError,
    deleteResume: (number) => void,
    resumeId: number,
    session: Object,
    getResumes: (number, ?number, ?number) => void,
    resumeTotalElements: number,
    setUpdateHistory: (value: boolean) => void,
    setMobileLoading: (key: string, status: boolean) => void,
}

const CLEAR_VALUE = -1;
const LOADING_KEY = 'requestCard';

const ResumeRequestCard = ({
    classes,
    fetchResumeRequest,
    updateResume,
    request,
    error,
    deleteResume,
    resumeId,
    session: { roles, id: currentUserId },
    getResumes,
    resumeTotalElements,
    setUpdateHistory,
    setMobileLoading,
}: Props) => {
    const [resumeObject, setResumeObject]: [ResumeRequest, Function] = useState({});
    const [loading, setLoading] = useState(false);

    const translations = {
        responsibleRM: useTranslation('requestForCv.requestSection.responsibleRM'),
        responsible: useTranslation('requestForCv.requestSection.responsible'),
    };

    const isMobile = useMobile();

    useEffect(() => {
        setResumeObject(request);
    }, [request]);

    const getResumeRequest = async () => {
        isMobile ? setMobileLoading(LOADING_KEY, true) : setLoading(true);

        await fetchResumeRequest(resumeId);

        isMobile ? setMobileLoading(LOADING_KEY, false) : setLoading(false);
    };

    const updateResumeRequest = async (fieldName: string, updateData: string | number) => {
        isMobile ? setMobileLoading(LOADING_KEY, true) : setLoading(true);

        const result = await updateResume(resumeId, fieldName, updateData);

        isMobile ? setMobileLoading(LOADING_KEY, false) : setLoading(false);

        getResumeRequest();
        result && setUpdateHistory(true);

        return result;
    };

    const checkDisableDeliveryDirector = () => (!includes(HEAD_SALES, roles)
            && (pathOr(null, ['company', 'responsibleRm', 'id'], request)) !== currentUserId);

    const updateDeliveryDirector = async (fieldName, deliveryDirectorId) => {
        const companyId = pathOr(null, ['company', 'id'], request);

        if (companyId && deliveryDirectorId !== CLEAR_VALUE) {
            setLoading(true);

            await updateCompany(companyId, { [fieldName]: deliveryDirectorId });

            setLoading(false);

            getResumeRequest();
        }
    };

    if (error && error.status === 404) {
        return <Redirect to={pages.RESUME_REQUESTS_ALL} />;
    }

    const styleRoot = isMobile ? classes.rootMobile : classes.root;
    const styleListItem = isMobile ? classes.listItemMobile : classes.listItem;

    return (
        <Paper
            elevation={0}
            classes={{ root: styleRoot }}
        >
            <List className={classes.list}>
                {!isMobile && <ListItem className={cn(classes.listItem, classes.headerItem)}>
                    <ResumeHeader
                        resumeId={resumeId}
                        deleteResume={deleteResume}
                        userRoles={roles}
                        resumeTotalElements={resumeTotalElements}
                    />
                </ListItem>}
                <ListItem className={styleListItem}>
                    <ResumeCompany
                        company={resumeObject.company}
                        updateRequest={updateResumeRequest}
                        disable
                    />
                </ListItem>
                <ListItem className={styleListItem}>
                    <ResumeName
                        resumeRequestName={resumeObject.name}
                        updateRequest={updateResumeRequest}
                    />
                </ListItem>
                <ListItem className={styleListItem}>
                    <ResumeEmployeeSelect
                        employee={pathOr({}, ['company', 'responsibleRm'], resumeObject)}
                        updateHandler={updateDeliveryDirector}
                        reloadCard={getResumeRequest}
                        employeesFilterParams={{ role: [RM_ID], responsibleRM: true }}
                        title='Delivery Director:'
                        fieldName='responsibleRmId'
                        disable={checkDisableDeliveryDirector()}
                        componentProps={{ isClearable: false }}
                    />
                </ListItem>
                <ListItem className={styleListItem}>
                    <ResumeEmployeeSelect
                        employee={resumeObject.responsible}
                        updateHandler={updateResumeRequest}
                        reloadCard={getResumeRequest}
                        employeesFilterParams={{ role: [RM_ID, MANAGER_ID] }}
                        title={`${translations.responsibleRM}:`}
                        fieldName='responsibleId'
                    />
                </ListItem>
                <ListItem className={styleListItem}>
                    <ResumeEmployeeSelect
                        employee={resumeObject.responsibleForSaleRequest}
                        updateHandler={updateResumeRequest}
                        reloadCard={getResumeRequest}
                        employeesFilterParams={{ role: [HEAD_SALE_ID, SALE_ID, MANAGER_ID, RM_ID] }}
                        title={`${translations.responsible}:`}
                        fieldName='responsibleForSaleRequest'
                        disable
                    />
                </ListItem>
                <ListItem className={styleListItem}>
                    <ResumeSale saleId={resumeObject.saleId} />
                </ListItem>
                <ListItem className={cn(styleListItem, classes.deadline)}>
                    <ResumeDeadLine
                        deadLine={resumeObject.deadLine}
                        updateRequest={updateResumeRequest}
                    />
                </ListItem>
                <ListItem className={cn(styleListItem, classes.radioGroup)}>
                    <ResumePriority
                        priority={resumeObject.priority}
                        updateRequest={updateResumeRequest}
                    />
                </ListItem>
                <ListItem className={cn(styleListItem, classes.radioGroup)}>
                    <ResumeStatus
                        resumeId={resumeId}
                        status={resumeObject.status}
                        responsible={resumeObject.responsible}
                        updateRequest={updateResumeRequest}
                        getResumes={getResumes}
                    />
                </ListItem>
            </List>
            {loading && <CRMLoader />}
        </Paper>
    );
};

export default withStyles(styles)(ResumeRequestCard);
