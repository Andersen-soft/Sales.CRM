// @flow

import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Paper, List, ListItem } from '@material-ui/core';
import { connect } from 'react-redux';
import { includes, pathOr, pipe } from 'ramda';
import {
    getEstimationRequest as getEstimationRequestData,
    updateEstimation as updateEstimationData,
    deleteEstimation,
} from 'crm-api/estimationRequestPageService/estimationCard';
import { fetchHistory as featchHistoryAction } from 'crm-actions/estimationRequestActions/historyActions';
import { HEAD_SALE_ID, SALE_ID, MANAGER_ID, RM_ID, HEAD_SALES } from 'crm-roles';
import CRMLoader from 'crm-ui/CRMLoader/CRMLoader';
import { useTranslation } from 'crm-hooks/useTranslation';
import { updateCompany } from 'crm-api/companyCardService/companyCardService';

import {
    EstimationHeader,
    EstimationCompany,
    EstimationName,
    EstimationEmployeeSelect,
    EstimationStatus,
    EstimationDeadline,
    EstimationSale,
} from './attributes';

import styles from './EstimationStyles';

type EstimationRequest = {
    companyName?: string,
    created?: string,
    deadline?: string,
    responsibleForSaleRequest?: {
        firstName: string,
        id: number,
        lastName: string,
    },
    id?: number,
    name?: string,
    priority?: string,
    responsibleRm?: {
        firstName: string,
        id: number,
        lastName: string,
    },
    deliveryDirector?: {
        firstName: string,
        id: number,
        lastName: string,
    },
    responsibleForRequest?: {
        firstName: string,
        id: number,
        lastName: string,
    },
    saleId?: number | null,
    status?: string,
    company: {
        id: number,
        responsibleRm?: {
            firstName: string,
            id: number,
            lastName: string,
        },
    },
}

type Props = {
    estimationId: number,
    classes: Object,
    fetchHistory: (number) => void,
    getTitle: (string) => void,
    estimationsTotal: number,
    session: Object,
}

const EstimationCard = ({
    estimationId,
    classes,
    fetchHistory,
    getTitle,
    estimationsTotal,
    session: { roles, id: currentUserId },
}: Props) => {
    const [estimation, setEstimation]: [EstimationRequest, Function] = useState({});
    const [loading, setLoading] = useState(false);

    const translations = {
        responsible: useTranslation('requestForEstimation.requestSection.responsible'),
        responsibleForEstimation: useTranslation('requestForEstimation.requestSection.responsibleForEstimation'),
    };

    const getEstimationRequest = async () => {
        setLoading(true);
        const estimationData = await getEstimationRequestData(estimationId);

        setEstimation(estimationData);
        getTitle(`${estimationId} - ${estimationData.name}`);
        setLoading(false);
    };

    useEffect(() => {
        getEstimationRequest();
    }, []);

    const updateEstimation = (id, fieldName, updateData) => {
        setLoading(true);

        return updateEstimationData(id, fieldName, updateData)
            .then(() => {
                fetchHistory(estimationId);
                getEstimationRequest();
                setLoading(false);
            });
    };

    const updateDeliveryDirector = async (estimationRequestId, fieldName, deliveryDirectorId) => {
        const companyId = pathOr(null, ['company', 'id'], estimation);

        if (companyId) {
            setLoading(true);

            await updateCompany(companyId, { [fieldName]: deliveryDirectorId });

            setLoading(false);

            getEstimationRequest();
        }
    };

    const checkDisableDeliveryDirector = () => (!includes(HEAD_SALES, roles)
        && (pathOr(null, ['deliveryDirector', 'id'], estimation)) !== currentUserId);

    const {
        companyName,
        name,
        company,
        responsibleForRequest,
        status,
        responsibleForSaleRequest,
        deadline,
        saleId,
    } = estimation;

    return (
        <Paper
            elevation={0}
            classes={{ root: classes.root }}
        >
            <List className={classes.list}>
                <ListItem className={classes.listItem}>
                    <EstimationHeader
                        estimationId={estimationId}
                        deleteEstimation={deleteEstimation}
                        estimationsTotal={estimationsTotal}
                    />
                </ListItem>
                <ListItem className={classes.listItem}>
                    <EstimationCompany
                        estimationId={estimationId}
                        company={companyName}
                        updateEstimation={updateEstimation}
                    />
                </ListItem>
                <ListItem className={classes.listItem}>
                    <EstimationName
                        estimationId={estimationId}
                        name={name}
                        updateEstimation={updateEstimation}
                    />
                </ListItem>
                <ListItem className={classes.listItem}>
                    <EstimationEmployeeSelect
                        employee={responsibleForSaleRequest}
                        updateHandler={updateEstimation}
                        reloadCard={getEstimationRequest}
                        employeesFilterParams={{ role: [HEAD_SALE_ID, SALE_ID, MANAGER_ID, RM_ID] }}
                        title={`${translations.responsible}:`}
                        fieldName='responsibleForSaleRequest'
                        requestId={estimationId}
                        disable
                    />
                </ListItem>
                <ListItem className={classes.listItem}>
                    <EstimationEmployeeSelect
                        employee={pathOr({}, ['responsibleRm'], company)}
                        updateHandler={updateDeliveryDirector}
                        reloadCard={getEstimationRequest}
                        employeesFilterParams={{ role: [RM_ID], responsibleRM: true }}
                        title='Delivery Director:'
                        fieldName='responsibleRmId'
                        requestId={estimationId}
                        disable={checkDisableDeliveryDirector()}
                        componentProps={{ isClearable: false }}
                    />
                </ListItem>
                <ListItem className={classes.listItem}>
                    <EstimationEmployeeSelect
                        employee={responsibleForRequest}
                        updateHandler={updateEstimation}
                        reloadCard={getEstimationRequest}
                        employeesFilterParams={{ role: [MANAGER_ID, RM_ID] }}
                        title={`${translations.responsibleForEstimation}:`}
                        fieldName='responsibleForRequestId'
                        requestId={estimationId}
                    />
                </ListItem>
                <ListItem className={classes.listItem}>
                    <EstimationStatus
                        estimationId={estimationId}
                        status={status}
                        updateEstimation={updateEstimation}
                        cancelLoading={() => setLoading(false)}
                    />
                </ListItem>
                <ListItem className={classes.listItem}>
                    <EstimationDeadline
                        estimationId={estimationId}
                        deadLine={deadline}
                        updateEstimation={updateEstimation}
                    />
                </ListItem>
                <ListItem className={classes.listItem}>
                    <EstimationSale saleId={saleId} />
                </ListItem>
            </List>
            {loading && <CRMLoader />}
        </Paper>
    );
};

const mapDispatchToProps = { fetchHistory: featchHistoryAction };

const mapStateToProps = ({
    EstimationRequest: {
        EstimationTable: {
            estimations,
        },
    },
    session: { userData },
}) => ({
    estimationsTotal: estimations.length,
    session: userData,
});

const compose = pipe(
    withStyles(styles),
    connect(mapStateToProps, mapDispatchToProps),
);

export default compose(EstimationCard);
