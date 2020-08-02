// @flow

import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import cn from 'classnames';
import { Grid, Paper, Typography } from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
import CRMTabs from 'crm-components/crmUI/CRMTabs/CRMTabs';
import { useTranslation } from 'crm-hooks/useTranslation';

import ResumeRequestCard from 'crm-components/resumeRequestPage/ResumeRequestCard';
import ResumeTable from 'crm-components/resumeRequestPage/ResumeTable';
import Comments from 'crm-components/resumeRequestPage/Comments';
import Attachment from 'crm-components/resumeRequestPage/Attachment';
import History from 'crm-components/resumeRequestPage/History';

import type {
    resumeRequestCardPropsType,
    resumeTablePropsType,
    ResumeRequestActions,
} from 'crm-containers/ResumeRequestPage/ResumeRequestPage';

import styles from './LayoutPageStyles';

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
    requestId: string,
    classes: Object,
    resumeRequestCardProps: resumeRequestCardPropsType,
    resumeTableProps: resumeTablePropsType,
} & ResumeRequestActions;


const DesktopPageLayout = ({
    requestId,
    classes,
    resumeRequestCardProps: {
        request,
        error,
        session,
    },
    resumeTableProps: {
        resumes,
        loading,
        totalElements,
        resetPage,
    },
    fetchResumeRequest,
    updateResumeRequest,
    deleteResumeRequest,
    fetchResume,
    updateResume,
    addAttachment,
    deleteAttachment,
    deleteResume,
    createResume,
}: Props) => {
    const [tab, setTabData] = useState(0);
    const [attachmentCount, setAttachmentCountData] = useState(0);
    const [commentSubject, setCommentSubjectData] = useState(null);
    const [needUpdateHistory, setNeedUpdateHistoryData] = useState(false);

    const translations = {
        comments: useTranslation('requestForCv.commentSection.tabs.comments'),
        attachments: useTranslation('requestForCv.commentSection.tabs.attachments'),
    };

    const handleChange = (event : SyntheticInputEvent<HTMLInputElement>, tabNumber: number) => {
        setTabData(tabNumber);
    };

    const setCommentSubject = (fio: string) => {
        setTabData(0);
        setCommentSubjectData(fio);
    };

    useEffect(() => {
        commentSubject && setCommentSubjectData(null);
    }, [commentSubject]);

    const setUpdateHistory = (value: boolean) => setNeedUpdateHistoryData(value);

    return <Grid className={classes.scroll}>
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
                    <ResumeRequestCard
                        resumeId={requestId}
                        request={request}
                        error={error}
                        session={session}
                        resumeTotalElements={totalElements}
                        fetchResumeRequest={fetchResumeRequest}
                        updateResume={updateResumeRequest}
                        deleteResume={deleteResumeRequest}
                        getResumes={fetchResume}
                        setUpdateHistory={setUpdateHistory}
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
                        className={classes.tabsHeader}
                        classes={{ rounded: classes.headerRounded }}
                    >
                        <CRMTabs
                            activeTab={tab}
                            onChange={handleChange}
                            tabItems={[
                                { label: translations.comments },
                                { label: translations.attachments, badgeContent: attachmentCount },
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
                            onSwitching={setTabData}
                            style={{ height: '100%', width: '100%' }}
                            containerStyle={{ height: '100%' }}
                        >
                            <TabContainer classes={classes}>
                                <Comments
                                    requestResumeId={requestId}
                                    commentSubject={commentSubject}
                                    setUpdateHistory={setUpdateHistory}
                                    userId={session.id}
                                />
                            </TabContainer>
                            <TabContainer classes={classes}>
                                <Attachment
                                    requestResumeId={requestId}
                                    setAttachmentCount={setAttachmentCountData}
                                    setUpdateHistory={setUpdateHistory}
                                />
                            </TabContainer>
                        </SwipeableViews>
                    </Paper>
                </Grid>
            </Grid>
            <Grid
                container
                className={classes.tableContainer}
            >
                <ResumeTable
                    requestResumeId={requestId}
                    setCommentSubject={setCommentSubject}
                    setUpdateHistory={setUpdateHistory}
                    resumes={resumes}
                    loading={loading}
                    userId={session.id}
                    responsibleRmId={request.responsible ? request.responsible.id : null}
                    totalElements={totalElements}
                    resetPage={resetPage}
                    fetchResume={fetchResume}
                    updateResume={updateResume}
                    addAttachment={addAttachment}
                    deleteAttachment={deleteAttachment}
                    deleteResume={deleteResume}
                    createResume={createResume}
                />
            </Grid>
            <Grid
                container
                className={classes.blockContainer}
            >
                <History
                    requestResumeId={requestId}
                    isUpdateHistoryNecessary={needUpdateHistory}
                    setUpdateHistory={setUpdateHistory}
                />
            </Grid>
        </Grid>
    </Grid>;
};

export default withStyles(styles)(DesktopPageLayout);
