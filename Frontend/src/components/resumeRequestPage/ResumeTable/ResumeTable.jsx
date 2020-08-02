// @flow

import React, { useState, useEffect, useRef } from 'react';
import { Paper, RootRef } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import tail from 'ramda/src/tail';
import { useTranslation } from 'crm-hooks/useTranslation';
import CRMTable from 'crm-ui/CRMTable/CRMTable';
import HeaderWithModal from 'crm-components/resumeRequestPage/ResumeTable/HeaderWithModal';
import CancelConfirmation from 'crm-components/common/CancelConfirmation';
import {
    userRoles,
    RESUME_TABLE_ROW_PER_PAGE,
} from 'crm-constants/resumeRequestPage/resumeRequestPageConstant';
import { fetchUsersByRole, getStatuses } from 'crm-api/resumeRequestService/resumeRequestService';

import {
    FioCell,
    StatusCell,
    ResponsibleHrCell,
    FilesCell,
    DateCell,
    ActionsCell,
} from './cells';

import type { NewResume, File, Resume } from 'crm-constants/resumeRequestPage/resumeRequestPageConstant';
import type { updateResumeArguments } from 'crm-actions/resumeRequestActions/resumeRequestActions';
import type { StyledComponentProps } from '@material-ui/core/es';

import styles from './ResumeTableStyles';

type Props = {
    requestResumeId: number,
    fetchResume: (number, ?number, ?number) => void,
    addAttachment: (number, File, number) => void,
    resumes: Array<Resume>,
    loading: boolean,
    createResume: (number, NewResume) => void,
    deleteResume: (number, number) => Promise<void>,
    updateResume: (number, updateResumeArguments, number) => Promise<void>,
    deleteAttachment: (number, number, number) => void,
    setCommentSubject: (string) => void,
    userId: number,
    responsibleRmId: ?number,
    totalElements: number,
    resetPage: boolean,
    setUpdateHistory: (boolean) => void,
} & StyledComponentProps;

const ResumeTable = ({
    classes,
    resumes,
    resetPage,
    requestResumeId,
    fetchResume,
    deleteAttachment,
    addAttachment,
    updateResume,
    userId,
    setUpdateHistory,
    deleteResume,
    setCommentSubject,
    loading,
    createResume,
    responsibleRmId,
    totalElements,
}: Props) => {
    const [responsiblesHrsList, setResponsiblesHrsList] = useState([]);
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const [selectedResumeId, setSelectedResumeId] = useState(null);
    const [selectedFileId, setSelectedFileId] = useState(null);
    const [confirmationText, setConfirmationText] = useState('');
    const [page, setPage] = useState(0);
    const [statuses, setStatuses] = useState([]);

    const translations = {
        fullName: useTranslation('requestForCv.cvSection.fullName'),
        status: useTranslation('requestForCv.cvSection.status'),
        responsibleHR: useTranslation('requestForCv.cvSection.responsibleHR'),
        cvFile: useTranslation('requestForCv.cvSection.cvFile'),
        dateUpload: useTranslation('requestForCv.cvSection.dateUpload'),
        notificationDeleteFile: useTranslation('requestForCv.cvSection.notificationDeleteFile'),
        notificationDeleteApplicant: useTranslation('requestForCv.cvSection.notificationDeleteApplicant'),
        emptyBlock: useTranslation('requestForCv.cvSection.emptyBlock'),
    };

    const table: {current: Object} = useRef(null);

    useEffect(() => {
        fetchResume(requestResumeId);

        getStatuses().then(statusesList => setStatuses(tail(statusesList)));
        fetchUsersByRole(userRoles.HR).then(({ content }) => setResponsiblesHrsList(content));
    }, []);

    useEffect(() => {
        resetPage && setPage(0);
    }, [resetPage]);

    const onDeleteAction = async () => {
        setShowConfirmationDialog(false);

        if (selectedResumeId) {
            selectedFileId
                ? await deleteAttachment(selectedResumeId, selectedFileId, requestResumeId)
                : await deleteResume(selectedResumeId, requestResumeId);
            setUpdateHistory(true);
        }

        selectedFileId
            ? setSelectedFileId(null)
            : table.current.focus();

        setSelectedResumeId(null);
    };

    const isUserPM = () => responsiblesHrsList.find(({ id }) => id === userId);

    const onChangeValue = (id: number, params: updateResumeArguments) => {
        if (params.status && params.status === 'in progress' && isUserPM()) {
            params.responsibleHrId = userId;
        }

        updateResume(id, params, requestResumeId)
            .then(() => setUpdateHistory(true));
    };

    const handleConfirmationDialogClose = () => setShowConfirmationDialog(false);

    const handleChangePage = (pageNum: number) => {
        setPage(pageNum);
        fetchResume(requestResumeId, RESUME_TABLE_ROW_PER_PAGE, pageNum);
    };

    const openConfirmDeleteResume = (id: number) => {
        setShowConfirmationDialog(true);
        setConfirmationText(translations.notificationDeleteApplicant);
        setSelectedResumeId(id);
    };

    const openConfirmDeleteResumeFile = (id: number, fileId: number) => {
        setShowConfirmationDialog(true);
        setConfirmationText(translations.notificationDeleteFile);
        setSelectedResumeId(id);
        setSelectedFileId(fileId);
    };

    const handlChangeCell = id => (params: updateResumeArguments) => onChangeValue(id, params);

    const config = [
        {
            title: translations.fullName,
            key: 'fio',
            RenderCell: FioCell,
        },
        {
            title: translations.status,
            key: 'status',
            RenderCell: StatusCell,
        },
        {
            title: translations.responsibleHR,
            key: 'responsibleHR',
            RenderCell: ResponsibleHrCell,
        },
        {
            title: translations.cvFile,
            key: 'files',
            RenderCell: FilesCell,
        },
        {
            title: translations.dateUpload,
            key: 'createDate',
            RenderCell: DateCell,
        },
        {
            title: '',
            key: 'actions',
            RenderCell: ActionsCell,
        },
    ];

    const prepareData = rawResume => rawResume.map(({
        id,
        fio,
        status,
        responsibleEmployee,
        files,
    }) => ({
        id,
        fio: [fio, handlChangeCell(id)],
        status: [status, statuses, handlChangeCell(id)],
        responsibleHR: [
            responsibleEmployee,
            responsiblesHrsList,
            handlChangeCell(id),
            () => fetchResume(requestResumeId),
        ],
        files: [
            id,
            files,
            openConfirmDeleteResumeFile,
            addAttachment,
            requestResumeId,
            setUpdateHistory,
        ],
        createDate: files,
        actions: [
            id,
            fio,
            openConfirmDeleteResume,
            setCommentSubject,
        ],
    }));

    return (
        <RootRef rootRef={table}>
            <Paper
                elevation={0}
                className={classes.cardWrap}
                tabIndex='-1'
            >
                <HeaderWithModal
                    classes={classes}
                    requestResumeId={requestResumeId}
                    createResume={createResume}
                    responsibleRmId={responsibleRmId}
                    setUpdateHistory={setUpdateHistory}
                />
                <CRMTable
                    data={prepareData(resumes)}
                    columnsConfig={config}
                    rowHover
                    isLoading={loading}
                    editableRowId={selectedResumeId}
                    paginationParams={{
                        rowsPerPage: RESUME_TABLE_ROW_PER_PAGE,
                        page,
                        count: totalElements,
                        onChangePage: handleChangePage,
                    }}
                    classes={{
                        root: classes.root,
                        cell: classes.cell,
                        title: classes.title,
                    }}
                    cellClasses={{
                        status: classes.status,
                        responsibleHR: classes.responsibleHR,
                        files: classes.files,
                        createDate: classes.createDate,
                        actions: classes.actions,
                    }}
                    errorMessage={translations.emptyBlock}
                    radiusLastRow={RESUME_TABLE_ROW_PER_PAGE >= totalElements}
                />
                <CancelConfirmation
                    showConfirmationDialog={showConfirmationDialog}
                    onConfirmationDialogClose={handleConfirmationDialogClose}
                    onConfirm={onDeleteAction}
                    text={confirmationText}
                />
            </Paper>
        </RootRef>
    );
};

export default withStyles(styles)(ResumeTable);
