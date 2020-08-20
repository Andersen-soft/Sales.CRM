// @flow

import React, { useState, useEffect } from 'react';
import { Paper, Grid } from '@material-ui/core';
import { tail } from 'ramda';
import { withStyles } from '@material-ui/core/styles';
import CRMPagination from 'crm-ui/CRMPagination/CRMPagination';
import { RESUME_TABLE_ROW_PER_PAGE, userRoles } from 'crm-constants/resumeRequestPage/resumeRequestPageConstant';
import { useTranslation } from 'crm-hooks/useTranslation';
import CancelConfirmation from 'crm-components/common/CancelConfirmation';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';
import { fetchUsersByRole, getStatuses } from 'crm-api/resumeRequestService/resumeRequestService';
import ResumeCard from './ResumeCard';
import ResumeAttachment from '../ResumeAttachment/ResumeAttachment';

import type { Session } from 'crm-containers/ResumeRequestPage/ResumeRequestPage';
import type { Resume as ResumeType } from 'crm-constants/resumeRequestPage/resumeRequestPageConstant';
import type { StyledComponentProps } from '@material-ui/core/es';
import type { updateResumeArguments } from 'crm-actions/resumeRequestActions/resumeRequestActions';

import styles from './ResumeStyles';

type Props = {
    resumes: Array<ResumeType>,
    requestId: number,
    totalElements: number,
    resetPage: boolean,
    fetchResume: (number) => void,
    addAttachment: () => void,
    deleteAttachment: (number, number, number) => void,
    updateResume: (number, updateResumeArguments, number) => Promise<void>,
    setUpdateHistory: (boolean) => void,
    session: Session,
    setCommentSubject: (name: string) => void,
} & StyledComponentProps;

const Resume = ({
    classes,
    requestId,
    resumes,
    totalElements,
    resetPage,
    fetchResume,
    deleteResume,
    addAttachment,
    updateResume,
    deleteAttachment,
    setUpdateHistory,
    session,
    reactSwipeEl,
    setCommentSubject,
}: Props) => {
    const [page, setPage] = useState(0);
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const [showResumeAttachments, setShowResumeAttachments] = useState(false);
    const [selectedResume, setSelectedResume]: [ResumeType | null, Function] = useState(null);
    const [statusList, setStatusList] = useState([]);
    const [responsiblesHrsList, setResponsiblesHrsList] = useState([]);
    const [editCardId, setEditCardId] = useState(null);

    const translations = {
        notificationDeleteApplicant: useTranslation('requestForCv.cvSection.notificationDeleteApplicant'),
        emptyBlock: useTranslation('requestForCv.cvSection.emptyBlock'),
    };

    useEffect(() => {
        (async () => {
            fetchResume(requestId);

            const statusesPromise = getStatuses();
            const hrPromise = fetchUsersByRole(userRoles.HR);

            const [statusesList, { content }] = await Promise.all([statusesPromise, hrPromise]);

            setStatusList(tail(statusesList).map(status => ({ label: status, value: status })));
            setResponsiblesHrsList(content.map(({
                firstName,
                lastName,
                id,
            }) => ({ label: `${firstName} ${lastName}`, value: id })));
        })();
    }, []);

    const handleChangePage = (pageNum: number) => {
        setPage(pageNum);
        fetchResume(requestId, RESUME_TABLE_ROW_PER_PAGE, pageNum);
    };

    const selectResume = (resumeId: number) => {
        const resume = resumes.find(({ id }) => id === resumeId);

        setSelectedResume(resume || null);
    };

    const showConfirmationDeleteDialog = (resumeId: number) => () => {
        setShowConfirmationDialog(!showConfirmationDialog);
        selectResume(resumeId);
    };

    const deleteResumeHandler = async () => {
        setShowConfirmationDialog(false);

        if (selectedResume && selectedResume.id) {
            await deleteResume(selectedResume.id, requestId);
            setUpdateHistory(true);
        }

        setSelectedResume(null);
    };

    const showResumeAttachmentsHandler = (resumeId: number) => () => {
        selectResume(resumeId);
        setShowResumeAttachments(true);
    };

    return <Grid className={classes.container}>
        {resumes.length
            ? resumes.map(({ id, fio, status, responsibleEmployee }) =>
                <ResumeCard
                    key={id}
                    requestId={requestId}
                    id={id}
                    fio={fio}
                    status={status}
                    responsibleEmployee={responsibleEmployee}
                    statusList={statusList}
                    responsiblesHrsList={responsiblesHrsList}
                    showResumeAttachments={showResumeAttachmentsHandler}
                    setUpdateHistory={setUpdateHistory}
                    addAttachment={addAttachment}
                    showConfirmationDeleteDialog={showConfirmationDeleteDialog}
                    updateResume={updateResume}
                    session={session}
                    reactSwipeEl={reactSwipeEl}
                    setEditCardId={setEditCardId}
                    editCardId={editCardId}
                    setCommentSubject={setCommentSubject}
                />)
            : <CRMEmptyBlock
                text={translations.emptyBlock}
                className={classes.emptyBlock}
            />}
        {!!resumes.length && totalElements > RESUME_TABLE_ROW_PER_PAGE && (
            <Paper className={classes.pagination}>
                <CRMPagination
                    rowsPerPage={RESUME_TABLE_ROW_PER_PAGE}
                    count={totalElements}
                    onChangePage={handleChangePage}
                    page={page}
                />
            </Paper>
        )}
        <CancelConfirmation
            showConfirmationDialog={showConfirmationDialog}
            onConfirmationDialogClose={() => setShowConfirmationDialog(false)}
            onConfirm={deleteResumeHandler}
            text={translations.notificationDeleteApplicant}
        />
        <ResumeAttachment
            requestId={requestId}
            classes={classes}
            open={showResumeAttachments}
            resume={selectedResume}
            deleteAttachment={deleteAttachment}
            closeWindow={() => setShowResumeAttachments(false)}
            setUpdateHistory={setUpdateHistory}
        />
    </Grid>;
};

export default withStyles(styles)(Resume);
