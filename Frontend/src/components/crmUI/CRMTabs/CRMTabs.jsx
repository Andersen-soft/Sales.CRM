// @flow

import React from 'react';
import cn from 'classnames';
import { Tabs, Tab, Badge, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { TabsContainersStyles, CRMTabsStyles } from './CRMTabsStyles';

type TabItem = {
    label: string,
    badgeContent?: number,
}

type Props = {
    activeTab: number,
    classes: Object,
    onChange: (event : SyntheticInputEvent<HTMLInputElement>, tab: number) => void,
    tabItems: Array<TabItem>,
    tabStyles: Object,
};

const CustomTabContainer = withStyles(TabsContainersStyles)(
    props => <Tabs {...props} TabIndicatorProps={{ children: <Grid /> }} />);

const CRMTabs = ({
    activeTab,
    classes,
    onChange,
    tabItems,
    tabStyles = {},
    ...props
}: Props) => {
    return (
        <CustomTabContainer
            value={activeTab}
            onChange={onChange}
            {...props}
            classes={{
                root: tabStyles.tabsRoot,
                indicator: tabStyles.indicator,
            }}
        >
            {tabItems.map((item: TabItem) => {
                return (<Tab
                    disableRipple
                    key={item.label}
                    label={
                        <Badge
                            badgeContent={item.badgeContent}
                            classes={{ badge: cn(classes.badge, tabStyles.badge) }}
                            color='secondary'
                        >
                            {item.label}
                        </Badge>
                    }
                    className={tabStyles.root}
                    classes={{
                        root: cn(classes.tabRoot, classes.label),
                        wrapper: tabStyles.labelWrapper,
                        selected: tabStyles.tabLabelSelected,
                    }}
                />);
            })}
        </CustomTabContainer>
    );
};

export default withStyles(CRMTabsStyles)(CRMTabs);
