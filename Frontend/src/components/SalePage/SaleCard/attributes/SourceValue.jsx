// @flow

import React, { useState } from 'react';
import { pathOr } from 'ramda';
import cn from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Popover, Typography } from '@material-ui/core';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';
import { pages } from 'crm-constants/navigation';
import { useTranslation } from 'crm-hooks/useTranslation';
import LinksBlock from 'crm-components/desktop/LinksBlock/LinksBlock';
import type { Industries } from 'crm-types/resourceDataTypes';

import styles from './AttributesStyles';

type CompanyType = {
    id: number,
    name: string,
    linkedSales: Array<number>,
    responsibleRm: {
        id: number,
        firstName: string,
        lastName: string,
        responsibleRm: boolean,
    },
    industryDtos: Array<Industries> | null,
}

type Props = {
    classes: Object,
    company: CompanyType | null,
    disable: boolean,
    source: {
        label: string,
        value: number,
    },
}

const SourceValue = ({
    company,
    source,
    disable,
    classes,
}: Props) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const translations = {
        recommendationOfCompany: useTranslation('sale.saleSection.recommendationOfCompany'),
        companyName: useTranslation('sale.saleSection.companyName'),
        linkedSales: useTranslation('sale.saleSection.linkedSales'),
        industry: useTranslation('sale.saleSection.industry'),
    };

    return <Grid className={cn({ [classes.withoutEdit]: disable })}>
        { source && source.value
            ? <>
                <Grid
                    className={cn(classes.source, { [classes.recommendationLabel]: pathOr(null, ['id'], company) })}
                    onClick={({ currentTarget }) => company && setAnchorEl(currentTarget)}
                >
                    {source.label}
                </Grid>
                {company && <Popover
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    classes={{ paper: classes.recommendationInfoPaper }}
                >
                    <Grid
                        className={classes.recommendationInfo}
                        container
                        direction='column'
                    >
                        <Typography className={classes.recommendationTitle}>
                            {translations.recommendationOfCompany}
                        </Typography>
                        <Grid item>
                            <Typography className={classes.fieldName}>
                                {translations.companyName}:
                            </Typography>
                            <Typography className={classes.fieldValue}>
                                {company.name}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography className={classes.fieldName}>
                                {translations.industry}:
                            </Typography>
                            <Grid className={classes.fieldValue}>
                                {pathOr([], ['industryDtos'], company).map(({ name }) => name).join(', ')
                                || <CRMEmptyBlock className={classes.emptyBlock} />}
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Typography className={classes.fieldName}>
                                Delivery Director:
                            </Typography>
                            <Grid className={classes.fieldValue}>
                                {pathOr(null, ['responsibleRm', 'responsibleRM'], company)
                                    ? `${pathOr('', ['responsibleRm', 'firstName'], company)}
                                     ${pathOr('', ['responsibleRm', 'lastName'], company)}`
                                    : <CRMEmptyBlock className={classes.emptyBlock} />
                                }
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Typography className={classes.fieldName}>
                                {translations.linkedSales}:
                            </Typography>
                            <LinksBlock
                                justify='flex-start'
                                separator=','
                                closingSeparator={false}
                                links={company.linkedSales.map(link => (
                                    { name: link, to: `${pages.SALES_FUNNEL}/${link}` }))}
                            />
                        </Grid>
                    </Grid>
                </Popover>}
            </>
            : <CRMEmptyBlock className={cn({ [classes.emptyBlock]: !disable })} />
        }
    </Grid>;
};

export default withStyles(styles)(SourceValue);
