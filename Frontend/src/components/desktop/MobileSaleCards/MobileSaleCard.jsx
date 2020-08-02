// @flow
import React, { useState } from 'react';
import cn from 'classnames';
import { parseISO } from 'date-fns';
import { head, pathOr } from 'ramda';
import { Grid, Typography, Paper, Tooltip } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { InfoOutlined, PermIdentity } from '@material-ui/icons';

import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';
import CRMDatePicker from 'crm-components/common/CRMDatePicker/CRMDatePicker';
import CRMLink from 'crm-ui/CRMLink/CRMLink';
import List from 'crm-static/customIcons/list.svg';
import { pages } from 'crm-constants/navigation';
import { STATUSES } from 'crm-constants/desktop/statuses';
import { getDate } from 'crm-utils/dates';
import { FULL_DATE_CS } from 'crm-constants/dateFormat';
import CRMDotMenu from 'crm-ui/CRMDotMenu/CRMDotMenu';
import CRMInformationDialog from 'crm-ui/CRMInformationDialog/CRMInformationDialog';
import CRMSocialNetworkIconLink from 'crm-ui/CRMSocialNetworkIconLink/CRMSocialNetworkIconLink';
import CRMIcon from 'crm-icons';
import DefaultIconSVG from 'crm-static/customIcons/link_social.svg';
import SkypeSVG from 'crm-static/customIcons/skype.svg';
import EmailSVG from 'crm-static/customIcons/email.svg';
import NextActivityDateAdding from 'crm-components/NextActivityDateAdding';

import type { StatusKeyType } from 'crm-constants/desktop/statuses';
import type { StyledComponentProps } from '@material-ui/core/es';
import type { Company, SingleActivity } from 'crm-types/resourceDataTypes';
import type { ContactsType } from 'crm-components/SalePage/contactsCard/ContactsCard';
import type { fetchSalesArguments } from 'crm-api/desktopService/salesService';
import type { UpdateSalePayload } from 'crm-api/saleService';
import type { addActivityArguments } from 'crm-api/desktopService/activityService';

import { useTranslation } from 'crm-hooks/useTranslation';

import styles from './MobileSaleCardStyles';

type Props = {
    id: number,
    status: StatusKeyType,
    company: $Shape<Company>,
    mainContact: ContactsType,
    lastActivity: SingleActivity,
    nextActivityDateProps: string | null,
    handleNextActivityDateChange: (number, Date) => void,
    userId: number,
    page: number,
    pageSize: number,
    statusFilter: Array<string>,
    searchValue: string,
    nextActivityDateFilter: string,
    editSale: (id: number, editSaleBody: UpdateSalePayload, salesRequestParams: fetchSalesArguments) => void,
    addActivity: (data: addActivityArguments, params: fetchSalesArguments) => void,
    updatePastActivitiesCount: () => void,
} & StyledComponentProps;

const getStatusClassName = (statusTitle: StatusKeyType) => head(STATUSES.filter(({ statusKey }) => statusKey === statusTitle)
    .map(
        ({ styleClass }) => styleClass,
    ));

const DIALOG_CONTENT_KEYS = {
    LAST_ACTIVITY: 'lastActivity',
    COMPANY_INFO: 'companyInfo',
    MAIN_CONTACT: 'mainContact',
};

const MobileSaleCard = ({
    id,
    status,
    company,
    mainContact,
    lastActivity,
    nextActivityDateProps,
    handleNextActivityDateChange,
    classes,
    userId,
    page,
    pageSize,
    statusFilter,
    searchValue,
    nextActivityDateFilter,
    editSale,
    addActivity,
    updatePastActivitiesCount,
}: Props) => {
    const [nextActivityDate, setNextActivityDate] = useState(
        nextActivityDateProps
            ? parseISO(nextActivityDateProps)
            : null,
    );
    const [informationDialogState, setInformationDialogState] = useState(false);
    const [informationDialogKey, setInformationDialogKey] = useState(null);

    const translations = {
        noLastActivity: useTranslation('desktop.saleCard.noLastActivity'),
        comment: useTranslation('common.comment'),
        noMainContact: useTranslation('desktop.saleCard.noMainContact'),
        company: useTranslation('desktop.saleCard.company'),
        mainContactShort: useTranslation('desktop.saleCard.mainContactShort'),
        lastActivityShort: useTranslation('desktop.saleCard.lastActivityShort'),
        nextActivity: useTranslation('desktop.saleCard.nextActivity'),
        industry: useTranslation('common.industry'),
    };

    const onChangeNextActivityDate = value => {
        if (value) {
            setNextActivityDate(value);
            handleNextActivityDateChange(id, value);
        }
    };

    const showLastAcivity = () => {
        setInformationDialogKey(DIALOG_CONTENT_KEYS.LAST_ACTIVITY);
        setInformationDialogState(true);
    };

    const showCompanyInfo = () => {
        setInformationDialogKey(DIALOG_CONTENT_KEYS.COMPANY_INFO);
        setInformationDialogState(true);
    };

    const showMainContact = () => {
        setInformationDialogKey(DIALOG_CONTENT_KEYS.MAIN_CONTACT);
        setInformationDialogState(true);
    };

    const informationDialogClose = () => setInformationDialogState(false);

    const renderLastActivityInfo = () => lastActivity
        ? (<Typography className={classes.infoText}>
            {lastActivity.description}
        </Typography>)
        : (<CRMEmptyBlock
            text={translations.noLastActivity}
            className={cn(classes.emptyBlockWidth, classes.lightFont)}
        />);

    const renderCompanyInfo = () => (
        <>
            <CRMLink to={`${pages.SALES_FUNNEL}/${id}`}>{`#${id}`}</CRMLink>
            {pathOr([], ['industryDtos'], company).length
                ? <>
                    <Typography className={cn(classes.smallSubHeader, classes.lightFont)}>
                        {translations.industry}
                    </Typography>
                    <Typography className={classes.infoText}>
                        {company.industryDtos.map(({ name }) => name).join(', ')}
                    </Typography>
                  </>
                : null
            }
            {company.description && (<>
                <Typography className={cn(classes.smallSubHeader, classes.lightFont)}>
                    {translations.comment}
                </Typography>
                <Typography className={classes.infoText}>
                    {company.description}
                </Typography>
            </>)}
        </>
    );

    const renderMainContactInfo = () => mainContact
        ? (<>
            <Grid
                container
                item
                alignItems={'center'}
                className={classes.row}
            >
                {mainContact.socialNetwork
                    ? (<CRMSocialNetworkIconLink
                        className={classes.socialIcon}
                        link={mainContact.socialNetwork}
                    >
                        {`${pathOr('', ['firstName'], mainContact)} ${pathOr('', ['lastName'], mainContact)}`}
                    </CRMSocialNetworkIconLink>)
                    : (<>
                        <CRMIcon
                            className={cn(classes.socialIcon, classes.disableIcon)}
                            IconComponent={DefaultIconSVG}
                        />
                        <Typography variant='body2'>
                            {`${pathOr('', ['firstName'], mainContact)} ${pathOr('', ['lastName'], mainContact)}`}
                        </Typography>
                    </>)
                }
            </Grid>
            <Grid
                container
                item
                wrap='nowrap'
                alignItems='center'
                className={classes.row}
            >
                <CRMIcon
                    className={classes.icon}
                    IconComponent={EmailSVG}
                />
                {mainContact.email
                    ? (<Tooltip
                        title={mainContact.email}
                        interactive
                        placement='bottom-start'
                        classes={{ tooltip: classes.tooltip }}
                    >
                        <Typography
                            variant='body2'
                            className={cn(classes.ellipsisUrl, classes.link, classes.lightFont)}
                        >
                            {mainContact.email}
                        </Typography>
                    </Tooltip>)
                    : <CRMEmptyBlock className={classes.lightFont} />
                }
            </Grid>
            <Grid
                container
                item
                wrap='nowrap'
                alignItems='center'
            >
                <CRMIcon
                    className={classes.icon}
                    IconComponent={SkypeSVG}
                />
                {mainContact.skype
                    ? <Tooltip
                        title={mainContact.skype}
                        interactive
                        placement='bottom-start'
                        classes={{ tooltip: classes.tooltip }}
                    >
                        <Typography
                            variant='body2'
                            className={cn(classes.ellipsisUrl, classes.link, classes.lightFont)}
                        >
                            {mainContact.skype}
                        </Typography>
                    </Tooltip>
                    : <CRMEmptyBlock className={classes.lightFont}/>
                }
            </Grid>
        </>)
        : (<CRMEmptyBlock
            text={translations.noMainContact}
            className={cn(classes.emptyBlockWidth, classes.lightFont)}
        />);

    const renderInformationContent = () => {
        switch (true) {
            case (informationDialogKey === DIALOG_CONTENT_KEYS.LAST_ACTIVITY):
                return renderLastActivityInfo;
            case (informationDialogKey === DIALOG_CONTENT_KEYS.COMPANY_INFO):
                return renderCompanyInfo;
            case (informationDialogKey === DIALOG_CONTENT_KEYS.MAIN_CONTACT):
                return renderMainContactInfo;
            default: return () => null;
        }
    };

    const renderAddActivity = () => (
        <NextActivityDateAdding
            key={company.id}
            isUseInSalePage={false}
            company={company.id}
            companySaleId={id}
            addActivity={addActivity}
            statusFilter={statusFilter}
            query={searchValue}
            nextActivityDatePicker={nextActivityDateFilter}
            editSale={editSale}
            mainContactId={pathOr(null, ['id'], mainContact)}
            size={pageSize}
            page={page}
            userId={userId}
            updatePastActivitiesCount={updatePastActivitiesCount}
        />
    );

    const dotMenuConfig = [
        { component: renderAddActivity() },
        { icon: List, text: useTranslation('desktop.saleCard.lastActivityShort'), handler: showLastAcivity },
        { icon: InfoOutlined, text: useTranslation('desktop.saleCard.companyInfoShort'), handler: showCompanyInfo },
        { icon: PermIdentity, text: useTranslation('desktop.saleCard.mainContactShort'), handler: showMainContact },
    ];

    return (
        <Paper className={cn(classes.root, classes.lightFont, classes[getStatusClassName(status)])}>
            <Grid container>
                <Grid
                    item
                    container
                    xs={6} sm={6}
                    lg={6} xl={6}
                    direction='column'
                    className={classes.topSubColumn}
                >
                    <Typography className={cn(classes.smallSubHeader, classes.lightFont)}>
                        {translations.company}
                    </Typography>
                    <CRMLink
                        className={classes.saleLink}
                        to={`${pages.SALES_FUNNEL}/${id}`}
                    >
                        {company.name}
                    </CRMLink>
                </Grid>
                <Grid
                    item
                    container
                    xs={6} sm={6}
                    lg={6} xl={6}
                    direction='column'
                    className={classes.topSubColumn}
                >
                    {mainContact
                        ? (<>
                            <Typography className={cn(classes.smallSubHeader, classes.lightFont)}>
                                {translations.mainContactShort}
                            </Typography>
                            <Typography
                                className={classes.lightFont}
                                variant='body2'
                            >
                                {`${pathOr('', ['firstName'], mainContact)} ${pathOr('', ['lastName'], mainContact)}`}
                            </Typography>
                        </>)
                        : <CRMEmptyBlock
                            text={translations.noMainContact}
                            className={classes.lightFont}
                        />
                    }
                </Grid>
                <Grid
                    item
                    container
                    xs={6} sm={6}
                    lg={6} xl={6}
                    direction='column'
                >
                    {lastActivity
                        ? (<>
                            <Typography className={cn(classes.smallSubHeader, classes.lightFont)}>
                                {translations.lastActivityShort}
                            </Typography>
                            <Typography
                                className={classes.lightFont}
                                variant='body2'
                            >
                                {getDate(lastActivity.dateActivity, FULL_DATE_CS)}
                            </Typography>
                        </>)
                        : <CRMEmptyBlock
                            text={translations.noLastActivity}
                            className={classes.lightFont}
                        />
                    }
                </Grid>
                <Grid
                    item
                    container
                    xs={6} sm={6}
                    lg={6} xl={6}
                    direction='column'
                >
                    <Typography className={cn(classes.smallSubHeader, classes.lightFont)}>
                        {translations.nextActivity}
                    </Typography>
                    <CRMDatePicker
                        date={nextActivityDate}
                        onChange={onChangeNextActivityDate}
                        theme='inline'
                        inlineClass={cn(classes.lightFont, classes.nextActivity)}
                        minDate={new Date()}
                    />
                </Grid>
                <CRMDotMenu
                    className={classes.dotsMenu}
                    config={dotMenuConfig}
                />
            </Grid>
            <CRMInformationDialog
                open={informationDialogState}
                onClose={informationDialogClose}
                renderContent={renderInformationContent()}
            />
        </Paper>
    );
};

export default withStyles(styles)(MobileSaleCard);
