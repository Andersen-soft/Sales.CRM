// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import cn from 'classnames';
import { Grid, Paper } from '@material-ui/core';
import CRMPagination from 'crm-ui/CRMPagination/CRMPagination';
import CRMLoader from 'crm-ui/CRMLoader/CRMLoader';
import { PAGE_SIZE } from 'crm-constants/desktop/salesConstants';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';
import { useMobile } from 'crm-components/common/MobileContextProvider/MobileContextProvider';
import { useTranslation } from 'crm-hooks/useTranslation';

import type { StyledComponentProps } from '@material-ui/core/es';
import type { UpdateSalePayload } from 'crm-api/saleService';
import type { fetchSalesArguments } from 'crm-api/desktopService/salesService';
import type { addActivityArguments } from 'crm-api/desktopService/activityService';
import type { CommonListItem, Responsible } from 'crm-types/resourceDataTypes';

import SaleCard from '../SaleCard/SaleCard';
import MobileSaleCard from '../MobileSaleCards/MobileSaleCard';

import styles from './DesktopCardsStyles';

type Sale = {
    id: number,
    company: {
        id: number,
        name: string,
        url: string,
        linkedSales: Array<number>,
    },
    createDate: string,
    description: string,
    estimations: Array<CommonListItem>,
    name: string,
    lastActivity: string,
    mainContact: string,
    nextActivityDate: string,
    responsible: Responsible,
    resumes: Array<CommonListItem>,
    status: string,
    nextActivityId: number,
};

type Props = {
    sales: {
        content: Array<Sale>,
        totalElements: number,
    },
    onChangePage: (number) => void,
    page: number,
    isLoading: boolean,
    handleNextActivityDateChange: (number, Date) => void,
    onSaveNextActivityComment: (number, SyntheticInputEvent<HTMLInputElement>) => void,
    userId: number,
    statusFilter: Array<string>,
    searchValue: string,
    nextActivityDateFilter: string,
    editSale: (id: number, editSaleBody: UpdateSalePayload, salesRequestParams: fetchSalesArguments) => void,
    addActivity: (data: addActivityArguments, params: fetchSalesArguments) => void,
    updatePastActivitiesCount: () => void,
} & StyledComponentProps;

const DesktopCards = ({
    classes,
    sales: {
        content,
        totalElements,
    },
    onChangePage,
    page,
    isLoading,
    onSaveNextActivityComment,
    handleNextActivityDateChange,
    userId,
    statusFilter,
    searchValue,
    nextActivityDateFilter,
    editSale,
    addActivity,
    updatePastActivitiesCount,
}: Props) => {
    const isMobile = useMobile();

    const translations = {
        emptyBlock: useTranslation('common.emptyBlock'),
    };

    const renderCards = () => (
        content.map(({
            id,
            description,
            status,
            company,
            estimations,
            resumes,
            mainContact,
            lastActivity,
            nextActivityDate,
        }) => (
            isMobile
                ? <MobileSaleCard
                    key={id}
                    id={id}
                    company={company}
                    mainContact={mainContact}
                    lastActivity={lastActivity}
                    nextActivityDateProps={nextActivityDate}
                    status={status}
                    handleNextActivityDateChange={handleNextActivityDateChange}
                    userId={userId}
                    page={page}
                    pageSize={PAGE_SIZE}
                    statusFilter={statusFilter}
                    searchValue={searchValue}
                    nextActivityDateFilter={nextActivityDateFilter}
                    editSale={editSale}
                    addActivity={addActivity}
                    updatePastActivitiesCount={updatePastActivitiesCount}
                />
                : <SaleCard
                    key={id}
                    id={id}
                    description={description}
                    status={status}
                    company={company}
                    estimations={estimations}
                    resumeRequests={resumes}
                    mainContact={mainContact}
                    lastActivity={lastActivity}
                    nextActivityDateProp={nextActivityDate}
                    className={classes.card}
                    onSaveNextActivityComment={onSaveNextActivityComment}
                    handleNextActivityDateChange={handleNextActivityDateChange}
                    userId={userId}
                    page={page}
                    pageSize={PAGE_SIZE}
                    statusFilter={statusFilter}
                    searchValue={searchValue}
                    nextActivityDateFilter={nextActivityDateFilter}
                    editSale={editSale}
                    addActivity={addActivity}
                    updatePastActivitiesCount={updatePastActivitiesCount}
                />
        ))
    );

    return (
        <Grid
            container
            direction='column'
            justify='flex-start'
            className={cn({ [classes.mobileCardsContainer]: isMobile })}
            wrap='nowrap'
        >
            {renderCards()}
            {!content.length && <Grid
                container
                justify='center'
                alignItems='center'
                className={classes.emptyCard}
            >
                <CRMEmptyBlock
                    className={classes.emptyBlock}
                    text={translations.emptyBlock}
                />
            </Grid>}
            {!!content.length && <Paper className={classes.pagination}>
                <CRMPagination
                    rowsPerPage={PAGE_SIZE}
                    count={totalElements}
                    onChangePage={onChangePage}
                    page={page}
                />
            </Paper>}
            {isLoading && <CRMLoader position='fixed'/>}
        </Grid>);
};

export default withRouter(withStyles(styles)(DesktopCards));
