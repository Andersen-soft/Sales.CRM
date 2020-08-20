// @flow

import React, {
    useEffect, useRef, useState,
} from 'react';
import { concat, pathOr } from 'ramda';
import cn from 'classnames';

import CRMIcon from 'crm-icons';
import CRMLink from 'crm-ui/CRMLink/CRMLink';
import { pages } from 'crm-constants/navigation';
import { removeProtocol } from 'crm-utils/urls';
import SkypeSVG from 'crm-static/customIcons/skype.svg';
import EmailSVG from 'crm-static/customIcons/email.svg';
import CRMTextArea from 'crm-ui/CRMTextArea/CRMTextArea';
import CRMDatePicker from 'crm-components/common/CRMDatePicker/CRMDatePicker';
import { parseISO } from 'date-fns';
import { FULL_DATE_CS } from 'crm-constants/dateFormat';
import { getDate } from 'crm-utils/dates';
import NextActivityDateAdding from 'crm-components/NextActivityDateAdding';
import CRMSocialNetworkIconLink from 'crm-ui/CRMSocialNetworkIconLink/CRMSocialNetworkIconLink';
import DefaultIconSVG from 'crm-static/customIcons/link_social.svg';
import { useTranslation } from 'crm-hooks/useTranslation';

import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import { RootRef } from '@material-ui/core';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';
import Popover from '@material-ui/core/Popover';
import { MAX_DESCRIPTION_HEIGHT } from './constants';
import LinksBlock, { type LinkType } from '../LinksBlock/LinksBlock';
import { type StatusKeyType } from '../../../constants/desktop/statuses';

import type { StyledComponentProps } from '@material-ui/core/es';
import type { ContactsType } from 'crm-components/SalePage/contactsCard/ContactsCard';
import type { SingleActivity, Company } from '../../../types/resourceDataTypes';
import type { UpdateSalePayload } from 'crm-api/saleService';
import type { fetchSalesArguments } from 'crm-api/desktopService/salesService';
import type { addActivityArguments } from 'crm-api/desktopService/activityService';
import { crmTrim } from 'crm-utils/trimValue';

import styles from './SaleCardStyles';
import CompanyInfo from '../../common/CompanyInfo/CompanyInfo';

type EstimationDTO = {
    id: number,
    name: string,
    oldId: number,
};

type ResumeRequestDTO = {
    id: number,
    name: string,
    oldId: number,
};

type Props = {
    id: number,
    description?: string,
    company: $Shape<Company>,
    estimations: Array<EstimationDTO>,
    resumeRequests: Array<ResumeRequestDTO>,
    status: StatusKeyType,
    mainContact: ContactsType,
    lastActivity: SingleActivity,
    // server format
    nextActivityDate: string | null,
    className: string | null,
    onSaveNextActivityComment: (number, SyntheticInputEvent<HTMLInputElement>) => void,
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

const convertEstimationDTOtoLinks = ({
    id,
    name,
}: EstimationDTO): LinkType => ({
    name,
    to: `${pages.ESTIMATION_REQUESTS}/${id}`,
});

const convertResumeDTOtoLinks = ({ id, name }: ResumeRequestDTO): LinkType => ({
    name,
    to: `${pages.RESUME_REQUESTS}/${id}`,
});

const estimationsResumeRequestsToLinks = (
    estimations: Array<EstimationDTO>,
    resumeRequests: Array<ResumeRequestDTO>,
) => concat(
    estimations.map(convertEstimationDTOtoLinks),
    resumeRequests.map(convertResumeDTOtoLinks),
);


const SaleCard = ({
    classes,
    id,
    description: outDescriptionValue,
    company,
    estimations,
    resumeRequests,
    status,
    mainContact,
    lastActivity,
    nextActivityDateProp,
    className,
    onSaveNextActivityComment,
    handleNextActivityDateChange,
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
    const descriptionRef = useRef(null);
    const descriptionPopoverAnchorRef = useRef(null);
    const [showDescriptionPopover, setShowDescriptionPopover] = useState(false);
    const [showReadMore, setShowReadMore] = useState(false);
    const [descriptionWidth, setDescriptionWidth] = useState(288);
    const [nextActivityDate, setNextActivityDate] = useState(
        nextActivityDateProp
            ? parseISO(nextActivityDateProp)
            : null,
    );
    const [description, setDescription] = useState(outDescriptionValue || '');

    const translations = {
        estimations: useTranslation('desktop.saleCard.estimations'),
        virtualProfile: useTranslation('desktop.saleCard.virtualProfile'),
        noMainContact: useTranslation('desktop.saleCard.noMainContact'),
        lastActivity: useTranslation('desktop.saleCard.lastActivity'),
        readMore: useTranslation('desktop.saleCard.readMore'),
        noLastActivity: useTranslation('desktop.saleCard.noLastActivity'),
        nextActivity: useTranslation('desktop.saleCard.nextActivity'),
        addComment: useTranslation('desktop.saleCard.addComment'),
    };

    useEffect(() => {
        if (
            !descriptionRef.current
            || !descriptionRef.current.clientHeight
        ) {
            return;
        }

        if (
            descriptionRef.current.clientHeight
            >= MAX_DESCRIPTION_HEIGHT
        ) {
            setDescriptionWidth(descriptionRef.current.clientWidth);
            setShowReadMore(true);
            return;
        }

        setShowReadMore(false);
    }, [descriptionRef.current]);

    useEffect(() => {
        if (nextActivityDateProp) {
            setNextActivityDate(parseISO(nextActivityDateProp));
        }
    }, [nextActivityDateProp]);

    const onChangeDescription = ({ target: { value } }) => {
        setDescription(value);
    };

    const onSaveDescription = event => {
        const { target: { value } } = event;

        value !== outDescriptionValue && onSaveNextActivityComment(id, event);
        setDescription(crmTrim(value));
    };

    const onDescriptionKeyPressCheck = event => {
        const { key, ctrlKey, target: { value } } = event;

        if (key === 'Enter' && ctrlKey && value !== outDescriptionValue) {
            onSaveNextActivityComment(id, event);
            setDescription(crmTrim(value));
        }
    };

    const onChangeNextActivityDate = value => {
        if (value) {
            setNextActivityDate(value);
            handleNextActivityDateChange(id, value);
        }
    };

    return (
        <Paper className={cn(classes.root, classes.lightFont, className)}>
            <Grid container wrap='nowrap'>
                {/* О компании */}
                <Grid
                    item
                    container
                    xs={3}
                    className={classes.companyBlock}
                    direction='column'
                >
                    <CompanyInfo
                        id={id}
                        status={status}
                        companyName={company.name}
                        description={company.description}
                        industries={company.industryDtos}
                        displayInfo
                    />
                    <Grid
                        item
                        className={cn(classes.ellipsisUrl, classes.fieldMargin)}
                    >
                        { company.url
                            ? (<Tooltip
                                title={removeProtocol(company.url)}
                                interactive
                                placement='bottom-start'
                                classes={{ tooltip: classes.tooltip }}
                            >
                                <Link
                                    rel='noopener noreferrer'
                                    target='_blank'
                                    href={company.url}
                                    className={cn(classes.ellipsisUrl, classes.fullWidth, classes.link)}
                                >
                                    {removeProtocol(company.url)}
                                </Link>
                            </Tooltip>)
                            : <CRMEmptyBlock className={classes.empty}/>
                        }
                    </Grid>
                    <Grid
                        item
                        className={cn(classes.fieldMargin, classes.requests)}
                    >
                        <Typography className={cn(classes.smallSubHeader, classes.lightFont)}>
                            {translations.estimations}
                        </Typography>
                        <LinksBlock
                            justify='flex-start'
                            links={estimationsResumeRequestsToLinks(
                                estimations,
                                resumeRequests,
                            )}
                        />
                    </Grid>
                </Grid>
                {/* Основной контакт */}
                <Grid
                    item
                    container
                    xs={2}
                    className={classes.responsible}
                    direction='column'
                >
                    {mainContact
                        ? (
                            <>
                                <Grid
                                    container
                                    item
                                    alignItems={'center'}
                                    className={classes.contact}
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
                                    alignItems={'center'}
                                    className={cn(classes.fullWidth, classes.contact)}
                                >
                                    <CRMIcon
                                        className={classes.icon}
                                        IconComponent={EmailSVG}
                                    />
                                    {mainContact.email
                                        ? <Tooltip
                                            title={mainContact.email}
                                            interactive
                                            placement='bottom-start'
                                            classes={{ tooltip: classes.tooltip }}
                                        >
                                            <Link
                                                href={`mailto:${mainContact.email}`}
                                                className={cn(classes.ellipsisUrl, classes.link, classes.lightFont)}
                                            >
                                                {mainContact.email}
                                            </Link>
                                        </Tooltip>
                                        : <CRMEmptyBlock className={classes.lightFont} />
                                    }
                                </Grid>
                                <Grid
                                    container
                                    item
                                    wrap='nowrap'
                                    alignItems={'center'}
                                    className={classes.skype}
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
                                            <Link
                                                href={`skype:${mainContact.skype}`}
                                                className={cn(classes.ellipsisUrl, classes.link, classes.lightFont)}
                                            >
                                                {mainContact.skype}
                                            </Link>
                                        </Tooltip>
                                        : <CRMEmptyBlock className={classes.lightFont}/>
                                    }
                                </Grid>
                                {mainContact.socialNetworkUser
                                    && mainContact.socialNetworkUser.name && (
                                        <>
                                            <Typography className={cn(classes.smallSubHeader, classes.lightFont)}>
                                                {translations.virtualProfile}
                                            </Typography>
                                            <Typography
                                                variant='body2'
                                                className={classes.lightFont}
                                            >
                                                {pathOr('', ['socialNetworkUser', 'name'], mainContact)}
                                            </Typography>
                                        </>
                                )}
                        </>
                        )
                        : <CRMEmptyBlock
                            text={translations.noMainContact}
                            className={cn(classes.noData, classes.lightFont)}
                        />
                    }
                </Grid>
                <Grid
                    item
                    container
                    direction='column'
                    xs={5}
                    className={classes.lastActivityBlock}
                >
                    {lastActivity
                        ? (
                            <>
                                <Grid
                                    container
                                    direction='column'
                                >
                                    <RootRef rootRef={descriptionPopoverAnchorRef}>
                                        <Typography className={cn(classes.smallSubHeader, classes.lightFont)}>
                                            {`${translations.lastActivity}: ${getDate(lastActivity.dateActivity, FULL_DATE_CS)}`}
                                        </Typography>
                                    </RootRef>
                                    <RootRef rootRef={descriptionRef}>
                                        <>
                                            <Typography
                                                variant='caption'
                                                className={cn(
                                                    showReadMore
                                                    && classes.lastActivityDescription,
                                                    classes.lightFont, classes.preLine
                                                )}
                                            >
                                                {lastActivity.description}
                                            </Typography>
                                            {showReadMore && (
                                                <CRMLink
                                                    onClick={() => { setShowDescriptionPopover(true); }}
                                                    className={classes.readMode}
                                                >
                                                    {translations.readMore}
                                                </CRMLink>
                                            )}
                                        </>
                                    </RootRef>
                                </Grid>
                                <Popover
                                    open={showDescriptionPopover}
                                    anchorEl={descriptionPopoverAnchorRef.current}
                                    onClose={() => { setShowDescriptionPopover(false); }}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                    PaperProps={{
                                        classes: { root: classes.descriptionPopover },
                                        style: { width: `${descriptionWidth}px` },
                                    }}
                                >
                                    <Typography className={classes.lightFont}>
                                        {lastActivity.description}
                                    </Typography>
                                </Popover>
                            </>)
                        : <CRMEmptyBlock
                            text={translations.noLastActivity}
                            className={cn(classes.noData, classes.lightFont)}
                        />
                    }
                </Grid>
                {/* Следующая активность и комментарий */}
                <Grid
                    item
                    container
                    xs={2}
                    direction='column'
                    className={classes.nextActivityBlock}
                >
                    <Grid
                        item
                        container
                        justify='space-between'
                        alignItems='center'
                        className={classes.nextActivityWrapper}
                    >
                        <Grid item className={classes.nextActivity}>
                            <Typography className={cn(classes.smallSubHeader, classes.lightFont)}>
                                {translations.nextActivity}
                            </Typography>
                            <CRMDatePicker
                                date={nextActivityDate}
                                onChange={onChangeNextActivityDate}
                                theme='inline'
                                inlineClass={cn(classes.lightFont, classes.date)}
                                minDate={new Date()}
                            />
                        </Grid>
                        <Grid item>
                            <NextActivityDateAdding
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
                        </Grid>
                    </Grid>
                    <Grid
                        item
                        className={classes.fullWidth}
                    >
                        <CRMTextArea
                            value={description}
                            placeholder={translations.addComment}
                            rows={5}
                            rowsMax={5}
                            onChange={onChangeDescription}
                            onKeyPress={onDescriptionKeyPressCheck}
                            onBlur={onSaveDescription}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default withStyles(styles)(SaleCard);
