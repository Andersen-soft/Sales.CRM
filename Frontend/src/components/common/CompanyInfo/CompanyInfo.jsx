// @flow

import React, { memo, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { pages } from 'crm-constants/navigation';

import { RootRef, Tooltip } from '@material-ui/core';
import { InfoOutlined } from '@material-ui/icons';
import cn from 'classnames';
import Grid from '@material-ui/core/Grid';
import type { StyledComponentProps } from '@material-ui/core/es';

import { head } from 'ramda';
import CRMLink from 'crm-ui/CRMLink/CRMLink';
import CRMIcon from 'crm-ui/CRMIcons';
import Typography from '@material-ui/core/Typography';
import { STATUSES } from 'crm-constants/desktop/statuses';
import type { StatusKeyType } from 'crm-constants/desktop/statuses';
import Popover from '@material-ui/core/Popover';
import { useTranslation } from 'crm-hooks/useTranslation';
import type { Industries, Company } from 'crm-types/resourceDataTypes';

import styles from './CompanyInfoStyles';

export type CompanyInfoProps = {
    id: number,
    status: StatusKeyType,
    companyName: string,
    description?: string,
    displayInfo?: string,
    linkDisabled?: boolean,
    company: $Shape<Company>,
    elipsisName?: boolean,
    industries: Array<Industries> | null,
} & StyledComponentProps;

export type StatusesBarProps = {
    statusTitle: StatusKeyType,
} & StyledComponentProps;

const getStatusClassName = (statusTitle: StatusKeyType) =>
    head(
        STATUSES.filter(({ statusKey }) => statusKey === statusTitle).map(
            ({ styleClass }) => styleClass,
        ),
    );

const StatusesBar = memo(({ classes, statusTitle }: StatusesBarProps) => (
    <div
        className={cn(
            classes.statusBar,
            classes[getStatusClassName(statusTitle)],
        )}
    />
));

const CompanyInfo = ({
    companyName = '',
    description,
    classes,
    status,
    id,
    displayInfo,
    linkDisabled,
    elipsisName = false,
    industries,
}: CompanyInfoProps) => {
    const [showInfo, setShowInfo] = useState(false);
    const infoIconRef = useRef(null);

    const translations = {
        comment: useTranslation('common.comment'),
        industry: useTranslation('common.industry'),
    };

    return (
        <Grid item className={classes.companyInfo}>
            <StatusesBar statusTitle={status} classes={classes} />
            {linkDisabled
                ? <Tooltip
                    title={elipsisName ? companyName : ''}
                    placement='bottom-start'
                    interactive
                >
                    <Typography className={cn(classes.companyName, { [classes.companyNameEllipsis]: elipsisName })}>
                        {companyName}
                    </Typography>
                </Tooltip>
                : <CRMLink
                    className={cn(classes.companyName, classes.saleLink)}
                    to={`${pages.SALES_FUNNEL}/${id}`}
                >
                    {companyName}
                </CRMLink>}
            {displayInfo && (
                <RootRef rootRef={infoIconRef}>
                    <CRMIcon
                        IconComponent={InfoOutlined}
                        className={classes.infoIcon}
                        onClick={() => {
                            setShowInfo(true);
                        }}
                    />
                </RootRef>
            )}
            <Popover
                open={showInfo && displayInfo}
                anchorEl={infoIconRef.current}
                onClose={() => {
                    setShowInfo(false);
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                PaperProps={{
                    classes: {
                        root: classes.infoPopover,
                    },
                }}
            >
                <CRMLink to={`${pages.SALES_FUNNEL}/${id}`}>{`#${id}`}</CRMLink>
                {industries && industries.length
                    ? <>
                        <Typography
                            className={cn(
                                classes.smallSubHeader,
                                classes.lightFont,
                            )}
                        >
                            {translations.industry}
                        </Typography>
                        <Typography className={classes.smallSubText}>
                            {industries.map(({ name }) => name).join(', ')}
                        </Typography>
                    </>
                    : null
                }
                {description && (
                    <>
                        <Typography
                            className={cn(
                                classes.smallSubHeader,
                                classes.lightFont,
                            )}
                        >
                            {translations.comment}
                        </Typography>
                        <Typography className={classes.smallSubText}>
                            {description}
                        </Typography>
                    </>
                )}
            </Popover>
        </Grid>
    );
};

export default withStyles(styles)(CompanyInfo);
