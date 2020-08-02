// @flow

import React, { useState } from 'react';
import {
    Tooltip,
    Grid,
    Popover,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import cn from 'classnames';
import { ArrowDropDown } from '@material-ui/icons';
import CRMTag from 'crm-components/crmUI/CRMTag/CRMTag';
import { TinyIconButton } from 'crm-components/common/cardAttributeWrappers';
import EmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';
import { useTranslation } from 'crm-hooks/useTranslation';

import styles from './CRMIndustryListStyles';

type Suggestion = {
    value: number,
    label: string,
}

type Props = {
    industry: Array<Suggestion>,
    classes: Object,
    listClasses?: Object,
}

const Industry = ({
    industry,
    classes,
    listClasses = {},
}: Props) => {
    const [industryAnchor, setIndustryAnchor] = useState(null);

    const translations = {
        showAll: useTranslation('common.showAll'),
    };

    const cutIndustry = industry.slice(0, 2);

    return industry.length
        ? <Grid
            container
            className={cn(listClasses.container)}
        >
            <Grid
                container
                justify='flex-end'
                alignItems='center'
            >
                {cutIndustry.map(({ value, label }) => (
                    <Grid
                        item
                        key={value}
                    >
                        <CRMTag label={label} />
                    </Grid>
                ))}
                {industry.length > 2 && <span className={classes.dots}>...</span>}
                <Tooltip title={translations.showAll} placement='bottom'>
                    <TinyIconButton
                        onClick={({ target }) => setIndustryAnchor(target)}
                        classes={{ root: classes.showAllIndustry }}
                    >
                        <ArrowDropDown fontSize='small' />
                    </TinyIconButton>
                </Tooltip>
            </Grid>
            <Popover
                open={Boolean(industryAnchor)}
                anchorEl={industryAnchor}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                onClose={() => setIndustryAnchor(null)}
                classes={{ paper: classes.industryPopover }}
            >
                <Grid container>
                    {industry.map(({ value, label }) => (
                        <Grid
                            item
                            key={value}
                        >
                            <CRMTag label={label} />
                        </Grid>
                    ))}
                </Grid>
            </Popover>
        </Grid>
        : <EmptyBlock className={cn(listClasses.empty)} />;
};

export default withStyles(styles)(Industry);
