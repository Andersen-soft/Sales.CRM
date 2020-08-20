// @flow

import React, { useEffect } from 'react';
import { Paper, List, ListItem } from '@material-ui/core';
import { pathOr } from 'ramda';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { pages } from 'crm-constants/navigation';
import applyForUsers from 'crm-utils/sales/applyForUsers';
import disableForHr from 'crm-utils/sales/disableForHr';
import CRMLoader from 'crm-ui/CRMLoader/CRMLoader';
import { isArchiveStatus } from 'crm-utils/dataTransformers/sales/isSaleArchived';
import {
    ResponsibleUser,
    StaticDate,
    NextActivityDate,
    Comment,
    Source,
    ManageActivities,
    Status,
    Category,
} from './attributes';

import type { StyledComponentProps } from '@material-ui/core/es';
import type { Contact, CommonListItem } from 'crm-types/resourceDataTypes';
import type { Sale } from 'crm-types/sales';
import { useTranslation } from 'crm-hooks/useTranslation';

import styles from './SaleCardStyles';

type Props = {
    sale: Sale,
    contactList: Array<Contact>,
    estimationsList: Array<CommonListItem>,
    resumesRequestsList: Array<CommonListItem>,
    fetchSaleCard: number => Promise<Sale>,
    editComment: (string) => void,
    updateSaleCard: (id: number, Object) => void,
    updateResumeForSale: (idResume: string, idSale: number) => void,
    updateEstimateForSale: (idEstimate: string, idSale: number) => void,
    userData: { username: string, roles: Array<string>, id: number},
    fetchActivities: (saleId: number, size: number, page: number) => void;
    isLoading: boolean,
} & StyledComponentProps

const SaleCard = ({
    fetchSaleCard,
    classes,
    sale,
    userData: { roles: userRoles, id: userId },
    updateSaleCard,
    editComment,
    contactList,
    updateResumeForSale,
    resumesRequestsList,
    updateEstimateForSale,
    estimationsList,
    sale: { responsible: responsibleUser },
    fetchActivities,
    isLoading,
}: Props) => {
    const translations = {
        dateCreation: useTranslation('sale.saleSection.dateCreation'),
        lastActivity: useTranslation('sale.saleSection.lastActivity'),
        cv: useTranslation('sale.saleSection.cv'),
        estimations: useTranslation('sale.saleSection.estimations'),
        cvAdd: useTranslation('sale.saleSection.cvAdd'),
        estimationAdd: useTranslation('sale.saleSection.estimationAdd'),
    };

    useEffect(() => {
        fetchSaleCard(sale.company.id);
    }, []);

    useEffect(() => {
        document.title = sale.company.name;
    }, [sale]);

    const availableToUser = responsibleUser && (userId === responsibleUser.id);
    const disable = isArchiveStatus(sale.status) || !applyForUsers(availableToUser, userRoles);

    const updateSale = value => updateSaleCard(sale.id, value);

    return (
        <Paper
            elevation={0}
            className={classes.blockContainer}
            classes={{ root: classes.root }}
        >
            <List className={classes.list}>
                <ListItem className={classes.listItem}>
                    <ResponsibleUser
                        sale={sale}
                        updateHandler={updateSale}
                        disable={!applyForUsers(availableToUser, userRoles)}
                        updateActivities={fetchActivities}
                    />
                </ListItem>
                <ListItem className={classes.listItem}>
                    <StaticDate
                        label={`${translations.dateCreation}:`}
                        date={sale.createDate}
                    />
                </ListItem>
                <ListItem className={classes.listItem}>
                    <StaticDate
                        label={`${translations.lastActivity}:`}
                        date={pathOr(null, ['lastActivity', 'dateActivity'], sale)}
                    />
                </ListItem>
                <ListItem className={classes.listItem}>
                    <NextActivityDate
                        sale={sale}
                        updateHandler={updateSale}
                        disable={disable}
                    />
                </ListItem>
                <ListItem className={classes.listItem}>
                    <Comment
                        sale={sale}
                        updateHandler={updateSale}
                        editHandler={editComment}
                        disable={disable}
                        contactCount={contactList.length}
                    />
                </ListItem>
                <ListItem className={classes.listItem}>
                    <Source
                        sale={sale}
                        updateHandler={updateSale}
                        disable={disable}
                    />
                </ListItem>
                <ListItem className={classes.listItem}>
                    <ManageActivities
                        sale={sale}
                        updateHandler={updateResumeForSale}
                        listFromRequest={resumesRequestsList}
                        attrName='resumes'
                        title={`${translations.cv}:`}
                        addButtonHint={translations.cvAdd}
                        pagePath={pages.RESUME_REQUESTS}
                        isNewVersion
                        userRoles={userRoles}
                        applyId={availableToUser}
                    />
                </ListItem>
                <ListItem className={classes.listItem}>
                    <ManageActivities
                        sale={sale}
                        updateHandler={updateEstimateForSale}
                        listFromRequest={estimationsList}
                        attrName='estimations'
                        title={`${translations.estimations}:`}
                        addButtonHint={translations.estimationAdd}
                        pagePath={pages.ESTIMATION_REQUESTS}
                        userRoles={userRoles}
                        applyId={availableToUser}
                        isNewVersion
                        disableForHr={disableForHr(userRoles)}
                    />
                </ListItem>
                <ListItem className={classes.listItem}>
                    <Status
                        sale={sale}
                        updateHandler={updateSale}
                        userRoles={userRoles}
                        availableToUser={availableToUser}
                    />
                </ListItem>
                <ListItem className={classes.listItem}>
                    <Category
                        sale={sale}
                        updateHandler={updateSale}
                        disable={!applyForUsers(false, userRoles)}
                    />
                </ListItem>
            </List>
            {isLoading && <CRMLoader />}
        </Paper>
    );
};

export default withRouter(withStyles(styles)(SaleCard));
