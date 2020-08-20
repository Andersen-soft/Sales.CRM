// @flow

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Grid } from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';
import LibraryAdd from '@material-ui/icons/LibraryAdd';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import ReactSwipe from 'react-swipe';
import Upload from 'crm-static/customIcons/upload.svg';
import CRMTabs from 'crm-components/crmUI/CRMTabs/CRMTabs';
import CRMDotMenu from 'crm-ui/CRMDotMenu/CRMDotMenu';
import CancelConfirmation from 'crm-components/common/CancelConfirmation';
import { useTranslation } from 'crm-hooks/useTranslation';
import { pages } from 'crm-constants/navigation';
import { AVAILABLE_FILE_TYPES } from 'crm-constants/resumeRequestPage/resumeRequestPageConstant';
import AddAplicantModal from 'crm-components/resumeRequestPage/ResumeTable/ResumeModal';
import CRMLoader from 'crm-ui/CRMLoader/CRMLoader';
import { MAX_FILE_SIZE } from 'crm-constants/resumeRequestPage/attachmentConstants';
import Notification from 'crm-components/notification/NotificationSingleton';
import { addAttachment as addResumeRequestAttachment } from 'crm-api/resumeRequestService/resumeRequestService';
import { checkDisableDeleteButton } from 'crm-utils/ResumeRequest/ResumeRequestUtils';

import ResumeRequestCard from './ResumeRequestCard';
import Resume from './MobileComponents/Resume/Resume';
import Comments from './Comments';
import Attachments from './MobileComponents/Attachments/Attachments';
import History from './MobileComponents/History/History';
import UploadFile from './MobileComponents/UploadFile/UploadFile';

import type {
    resumeRequestCardPropsType,
    resumeTablePropsType,
    ResumeRequestActions,
} from 'crm-containers/ResumeRequestPage/ResumeRequestPage';
import type { StyledComponentProps } from '@material-ui/core/es';

import styles from './MobileLayoutStyles';

type Props = {
    requestId: string,
    resumeRequestCardProps: resumeRequestCardPropsType,
    resumeTableProps: resumeTablePropsType,
} & StyledComponentProps & ResumeRequestActions;

const LOADING_KEY_MAIN = 'main';
const LOADING_KEY_RESUME = 'resume';
const COMMENT_TAB_INDEX = 2;
const ATTACMENT_TAB_INDEX = 3;

const MobilePageLayout = ({
    requestId,
    classes,
    resumeRequestCardProps: {
        request,
        error,
        session,
        session: { roles: userRoles, id: userId },
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
    addAttachment,
    deleteAttachment,
    deleteResume,
    updateResume,
    createResume,
    history,
}: Props) => {
    const [tab, setTabData] = useState(0);
    const [showConfirmationDeleteDialog, setShowConfirmationDeleteDialog] = useState(false);
    const [localLoading, setLoading] = useState({});
    const [updateHistory, setUpdateHistory] = useState(false);
    const [updateAttachment, setUpdateAttachment] = useState(false);
    const [attachmentCount, setAttachmentCount] = useState(null);
    const [showModalAddApplicant, setShowModalAddApplicant] = useState(false);
    const [commentSubject, setCommentSubject] = useState(null);
    const reactSwipeEl = useRef(null);

    const translations = {
        notificationDeleteCv: useTranslation('requestForCv.requestSection.notificationDeleteCv'),
        notificationFileSizeLimit: useTranslation('requestForCv.commentSection.attachmentsTab.notificationFileSizeLimit'),
        notificationFileUploadError: useTranslation('requestForCv.commentSection.attachmentsTab.notificationFileUploadError'),
        addFile: useTranslation('requestForCv.commentSection.attachmentsTab.addFile'),
        addApplicant: useTranslation('requestForCv.cvSection.addApplicant'),
        delete: useTranslation('common.delete'),
        main: useTranslation('common.main'),
        cv: useTranslation('sale.saleSection.cv'),
        comments: useTranslation('requestForCv.commentSection.tabs.comments'),
        attachments: useTranslation('requestForCv.commentSection.tabs.attachments'),
        activityLog: useTranslation('requestForCv.activityLogSection.activityLog'),
        applicantCanNotAdded: useTranslation('requestForCv.cvSection.applicantCanNotAdded'),
    };

    const setLocalLoading = (key: string, status: boolean) =>
        setLoading(prevlocalLoading => ({ ...prevlocalLoading, [key]: status }));

    useEffect(() => {
        setLocalLoading(LOADING_KEY_RESUME, loading);
    }, [loading]);

    useEffect(() => {
        commentSubject && setCommentSubject(null);
    }, [commentSubject]);

    const handleChange = (event: SyntheticInputEvent<HTMLInputElement>, tabNumber: number) => {
        setTabData(tabNumber);
    };

    const toogleConfirmDialog = () => setShowConfirmationDeleteDialog(!showConfirmationDeleteDialog);

    const deleteRequest = async () => {
        try {
            toogleConfirmDialog();
            setLocalLoading(LOADING_KEY_MAIN, true);
            await deleteResumeRequest(requestId);

            history.push(pages.RESUME_REQUESTS_ALL);
        } catch {
            toogleConfirmDialog();
        }
    };

    const toogleShowModalAddApplicant = () => {
        if (!request.responsible) {
            Notification.showMessage({
                message: translations.applicantCanNotAdded,
                closeTimeout: 15000,
            });
            return;
        }
        setShowModalAddApplicant(!showModalAddApplicant);
    };

    const validateFiles = files => {
        const filesSize = files.reduce((sum, { size }) => sum + size, 0);

        if (filesSize > MAX_FILE_SIZE) {
            Notification.showMessage({
                message: translations.notificationFileSizeLimit,
                closeTimeout: 15000,
            });
            return false;
        }

        return true;
    };

    const uploadFile = async ({ target: { files } }) => {
        if (validateFiles([...files])) {
            try {
                setLocalLoading(LOADING_KEY_MAIN, true);
                await addResumeRequestAttachment(requestId, [...files]);

                setUpdateHistory(true);
                setUpdateAttachment(true);
                setLocalLoading(LOADING_KEY_MAIN, false);
                setTabData(ATTACMENT_TAB_INDEX);
            } catch (e) {
                setLocalLoading(LOADING_KEY_MAIN, false);
                Notification.showMessage({
                    message: translations.notificationFileUploadError,
                    closeTimeout: 15000,
                });
            }
        }
    };

    const isShowLoader = () => Object.values(localLoading).includes(true);

    const handleChangeIndex = index => setTabData(index);

    const dotMenuConfig = [
        { component: <UploadFile
            key={requestId}
            icon={Upload}
            text={translations.addFile}
            onFileChange={uploadFile}
            availableFileTypes={AVAILABLE_FILE_TYPES}

        /> },
        { icon: LibraryAdd, text: translations.addApplicant, handler: toogleShowModalAddApplicant },
        {
            icon: Delete,
            text: translations.delete,
            handler: toogleConfirmDialog,
            disabled: checkDisableDeleteButton(userRoles, totalElements),
        },
    ];

    const tabsList = [
        { label: translations.main },
        { label: translations.cv },
        { label: translations.comments },
        { label: translations.attachments, badgeContent: attachmentCount },
        { label: translations.activityLog },
    ];

    const useMemoWrapper = (Component, dependencies) => useMemo(() => Component, dependencies);

    const commentSubjectHandler = name => {
        setCommentSubject(name);
        setTabData(COMMENT_TAB_INDEX);
    };

    return <Grid className={classes.container}>
        <Grid
            container
            justify='space-between'
            alignItems='center'
            className={classes.headerRow}
        >
            <Grid className={classes.idResume}>
                {`#${requestId}`}
            </Grid>
            <Grid>
                <CRMDotMenu config={dotMenuConfig} />
            </Grid>
        </Grid>
        <Grid
            item
            className={classes.tabHeader}
        >
            <CRMTabs
                activeTab={tab}
                onChange={handleChange}
                variant='scrollable'
                scrollButtons='off'
                tabStyles={{
                    root: classes.tabLabel,
                    labelWrapper: classes.labelWrapper,
                    tabsRoot: classes.tabsRoot,
                    badge: classes.tabBadge,
                    tabLabelSelected: classes.tabLabelSelected,
                    indicator: classes.indicator,
                }}
                tabItems={tabsList}
            />
        </Grid>
        <Grid className={classes.swipeContainer}>
            <ReactSwipe
                className={classes.swipe}
                swipeOptions={{
                    startSlide: tab,
                    continuous: false,
                    callback: index => handleChangeIndex(index),
                }}
                style={{
                    container: {
                        overflow: 'hidden',
                        visibility: 'hidden',
                        position: 'relative',
                    },
                    wrapper: {
                        height: '100%',
                        overflow: 'hidden',
                        position: 'relative',
                    },
                    child: {
                        float: 'left',
                        width: '100%',
                        position: 'relative',
                        transitionProperty: 'transform',
                    },
                }}
                ref={reactSwipeEl}
            >
                <Grid className={classes.tabContentWrapper}>
                    {useMemoWrapper(<ResumeRequestCard
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
                        setMobileLoading={setLocalLoading}
                    />, [requestId, request, error, session, totalElements])}
                </Grid>
                <Grid className={classes.tabContentWrapper}>
                    {useMemoWrapper(<Resume
                        requestId={requestId}
                        resumes={resumes}
                        totalElements={totalElements}
                        resetPage={resetPage}
                        fetchResume={fetchResume}
                        deleteResume={deleteResume}
                        updateResume={updateResume}
                        addAttachment={addAttachment}
                        setUpdateHistory={setUpdateHistory}
                        deleteAttachment={deleteAttachment}
                        session={session}
                        reactSwipeEl={reactSwipeEl}
                        setCommentSubject={commentSubjectHandler}
                    />, [requestId, resumes, totalElements, resetPage, session])}
                </Grid>
                <Grid className={classes.tabContentWrapper}>
                    {useMemoWrapper(<Comments
                        requestResumeId={requestId}
                        setUpdateHistory={setUpdateHistory}
                        userId={session.id}
                        commentSubject={commentSubject}
                    />, [requestId, commentSubject, session])}
                </Grid>
                <Grid className={classes.tabContentWrapper}>
                    {useMemoWrapper(<Attachments
                        requestId={requestId}
                        updateAttachment={updateAttachment}
                        setUpdateAttachment={setUpdateAttachment}
                        setUpdateHistory={setUpdateHistory}
                        setAttachmentCount={setAttachmentCount}
                        setLoading={setLocalLoading}
                    />, [requestId, updateAttachment])}

                </Grid>
                <Grid className={classes.tabContentWrapper}>
                    {useMemoWrapper(<History
                        requestId={requestId}
                        setUpdateHistory={setUpdateHistory}
                        isUpdateHistoryNecessary={updateHistory}
                        setLoading={setLocalLoading}
                    />, [requestId, updateHistory])}
                </Grid>
            </ReactSwipe>
        </Grid>
        {isShowLoader() && <CRMLoader />}
        <CancelConfirmation
            showConfirmationDialog={showConfirmationDeleteDialog}
            onConfirmationDialogClose={toogleConfirmDialog}
            onConfirm={deleteRequest}
            text={translations.notificationDeleteCv}
        />
        <AddAplicantModal
            open={showModalAddApplicant}
            requestResumeId={requestId}
            onModalToggle={toogleShowModalAddApplicant}
            createResume={createResume}
            setUpdateHistory={setUpdateHistory}
            setResumeTab={() => setTabData(1)}
        />
    </Grid>;
};

export default withRouter(withStyles(styles)(MobilePageLayout));
