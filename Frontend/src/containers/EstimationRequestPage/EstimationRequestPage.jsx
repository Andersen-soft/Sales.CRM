// @flow

import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import { path } from 'ramda';
import { useTranslation } from 'crm-hooks/useTranslation';
import SwipeableViews from 'react-swipeable-views';

import { Grid, Paper, Typography } from '@material-ui/core';
import CRMTabs from 'crm-ui/CRMTabs/CRMTabs';

import History from './History';
import Attachment from './Attachment';
import Estimation from './EstimationTable';
import Comments from 'crm-components/estimationRequestPage/Comments';
import EstimationCard from 'crm-components/estimationRequestPage/EstimationCard';
import Notification from 'crm-components/notification/NotificationSingleton';

import { pages } from 'crm-constants/navigation';
import { getEstimationRequest } from 'crm-api/estimationRequestPageService/estimationCard';

import { withStyles } from '@material-ui/core/styles';
import styles from './EstimationRequestPageStyles';

type TabProps = {
    children?: *,
    classes: Object,
};

const TabContainer = ({ children, classes }: TabProps) => (
    <Typography component='div' classes={{ root: classes.tabContainer }}>
        {children}
    </Typography>
);

type Props = {
    routeParams: {
        estimationId: number
    },
    classes: Object,
    history: Object,
}

const EstimationRequestPage = ({
    routeParams: { estimationId },
    classes,
    history,
}: Props) => {
    const [tab, setTab] = useState(0);
    const [attachmentCount, setAttachmentCount] = useState(0);
    const [tabTitle, setTabTitle] = useState('Requests for estimation');
    const [correctUrl, setCorrectUrl] = useState(false);

    const translations = {
        comments: useTranslation('requestForEstimation.estimationSection.tabs.comments'),
        attachments: useTranslation('requestForEstimation.estimationSection.tabs.attachments'),
        estimations: useTranslation('requestForEstimation.estimationSection.tabs.estimations'),
        notificationNotExistStart: useTranslation('requestForEstimation.notifications.notificationNotExistStart'),
        notificationNotExistEnd: useTranslation('requestForEstimation.notifications.notificationNotExistEnd'),
    };

    useEffect(() => {
        getEstimationRequest(estimationId)
            .then(() => setCorrectUrl(true))
            .catch(error => {
                if (path(['response', 'status'], error) !== 401) {
                    Notification.showMessage({
                        message: `${translations.notificationNotExistStart} ${estimationId} ${translations.notificationNotExistEnd}`,
                        type: 'warning',
                        closeTimeout: 15000,
                    });
                    history.push(pages.ESTIMATION_REQUEST_ALL);
                }
            });
    }, []);

    useEffect(() => {
        document.title = tabTitle;
    });

    const getTitle = (title: string) => setTabTitle(title);

    const handleChange = (event : SyntheticInputEvent<HTMLInputElement>, tabData: number) => setTab(tabData);

    const handleChangeIndex = (tabData: number) => setTab(tabData);

    const setAttachmentCountData = (count: number) => setAttachmentCount(count);

    return correctUrl && (
        <Grid
            className={classes.scroll}
            key={estimationId}
        >
            <Grid container className={classes.container}>
                <Grid
                    container
                    justify='flex-end'
                    className={classes.rowContainer}
                >
                    <Grid
                        item
                        xs={12} sm={4}
                        lg={4} xl={3}
                        className={cn(classes.requestCard, classes.blockContainer)}
                    >
                        <EstimationCard
                            estimationId={estimationId}
                            getTitle={getTitle}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={12} sm={8}
                        lg={8} xl={9}
                        className={cn(classes.contentWrapper, classes.blockContainer)}
                    >
                        <Paper
                            elevation={0}
                            classes={{ rounded: classes.headerRounded }}
                        >
                            <CRMTabs
                                activeTab={tab}
                                onChange={handleChange}
                                tabItems={[
                                    { label: translations.comments },
                                    { label: translations.attachments, badgeContent: attachmentCount },
                                    { label: translations.estimations },
                                ]}
                            />
                        </Paper>
                        <Paper
                            elevation={0}
                            classes={{
                                root: classes.tabContentWrapper,
                                rounded: classes.contentRounded,
                            }}
                        >
                            <SwipeableViews
                                axis='x-reverse'
                                index={tab}
                                onSwitching={handleChangeIndex}
                                style={{ height: '100%', width: '100%' }}
                                containerStyle={{ height: '100%' }}
                            >
                                <TabContainer classes={classes}>
                                    <Comments estimationId={estimationId} />
                                </TabContainer>
                                <TabContainer classes={classes}>
                                    <Attachment
                                        estimationId={estimationId}
                                        setAttachmentCount={setAttachmentCountData}
                                    />
                                </TabContainer>
                                <TabContainer classes={classes}>
                                    <Estimation estimationId={estimationId} />
                                </TabContainer>
                            </SwipeableViews>
                        </Paper>
                    </Grid>
                </Grid>
                <Grid
                    container
                    item
                    xs={12}
                    className={cn(classes.rowContainer, classes.blockContainer)}
                >
                    <History estimationId={estimationId} />
                </Grid>
            </Grid>
        </Grid>
    );
};

export default withStyles(styles)(EstimationRequestPage);
