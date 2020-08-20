// @flow

import React, { useState } from 'react';
import { pathOr } from 'ramda';
import { withStyles } from '@material-ui/core/styles';
import { InfoOutlined } from '@material-ui/icons';
import { Grid, Typography, Popover } from '@material-ui/core';
import CRMIcon from 'crm-ui/CRMIcons';
import LinksBlock from 'crm-components/desktop/LinksBlock/LinksBlock';
import { useTranslation } from 'crm-hooks/useTranslation';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';
import { getCompany } from 'crm-api/reportsByLeadService/reportService';
import CRMLoader from 'crm-ui/CRMLoader/CRMLoader';

import styles from './cellStyles';

type Props = {
    values: [number, string],
    classes: Object,
}

const RecommendationCell = ({
    values: [companyId, companyName],
    classes,
}: Props) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [company, setCompany] = useState(null);

    const translations = {
        recommendationCompany: useTranslation('reportLead.recommendationCompany'),
        companyName: useTranslation('reportLead.companyName'),
        linkedSales: useTranslation('reportLead.linkedSales'),
        industry: useTranslation('reportLead.industry'),
    };

    const prepareLinks = (sales: Array<number>) => sales.map(saleId => ({
        name: `${saleId}`,
        to: `/sales/${saleId}`,
        highlighted: false,
    }));

    const openModal = async event => {
        setAnchorEl(event.currentTarget);
        setLoading(true);

        const companyInfo = await getCompany(companyId);

        setLoading(false);
        setCompany(companyInfo);
    };

    const closeModal = () => {
        setAnchorEl(null);
    };

    return companyId
        ? <>
            <Grid
                container
                wrap='nowrap'
                alignItems='center'
            >
                <Grid>
                    {companyName}
                </Grid>
                <CRMIcon
                    className={classes.informationIcon}
                    IconComponent={InfoOutlined}
                    onClick={openModal}
                />
            </Grid>
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={closeModal}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                PaperProps={{
                    classes: {
                        root: classes.infoPopover,
                    },
                }}
            >
                <Typography className={classes.infoTitle}>
                    {translations.recommendationCompany}
                </Typography>
                <Grid>
                    <Typography className={classes.infoSubTitle}>
                        {translations.companyName}
                    </Typography>
                    <Typography className={classes.infoSubValue}>
                        {companyName}
                    </Typography>
                </Grid>
                <Grid>
                    <Typography className={classes.infoSubTitle}>
                        {translations.industry}
                    </Typography>
                    <Grid className={classes.infoSubValue}>
                        {pathOr([], ['industryDtos'], company).map(({ name }) => name).join(', ') || <CRMEmptyBlock />}
                    </Grid>
                </Grid>
                <Grid>
                    <Typography className={classes.infoSubTitle}>
                        Delivery Director
                    </Typography>
                    <Grid className={classes.infoSubValue}>
                        {pathOr(null, ['responsibleRm', 'responsibleRM'], company)
                            ? `${pathOr('', ['responsibleRm', 'firstName'], company)}
                                     ${pathOr('', ['responsibleRm', 'lastName'], company)}`
                            : <CRMEmptyBlock />
                        }
                    </Grid>
                </Grid>
                <Grid>
                    <Typography className={classes.infoSubTitle}>
                        {`${translations.linkedSales}:`}
                    </Typography>
                    <Grid>
                        <LinksBlock
                            justify='flex-start'
                            separator=','
                            closingSeparator={false}
                            links={prepareLinks(pathOr([], ['linkedSales'], company))}
                        />
                    </Grid>
                </Grid>
                {loading && <CRMLoader />}
            </Popover>
        </>
        : <CRMEmptyBlock />;
};

export default withStyles(styles)(RecommendationCell);

