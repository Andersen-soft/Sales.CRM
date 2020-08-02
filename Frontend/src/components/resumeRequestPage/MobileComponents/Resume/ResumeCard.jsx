// @flow

import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { head, equals, pathOr } from 'ramda';
import { Grid, Typography } from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import ChatBubbleOutline from '@material-ui/icons/ChatBubbleOutline';
import AttachFile from '@material-ui/icons/AttachFile';
import Add from '@material-ui/icons/Add';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';
import CRMInput from 'crm-components/crmUI/CRMInput/CRMInput';
import CRMAutocompleteSelect from 'crm-ui/CRMAutocompleteSelect/CRMAutocompleteSelect';
import { MAX_FILE_SIZE } from 'crm-constants/resumeRequestPage/attachmentConstants';
import Notification from 'crm-components/notification/NotificationSingleton';
import { useTranslation } from 'crm-hooks/useTranslation';
import UserInformationPopover from 'crm-components/common/UserInformationPopover/UserInformationPopover';
import CRMDotMenu from 'crm-ui/CRMDotMenu/CRMDotMenu';
import { STATUS_IN_PROGRESS } from 'crm-constants/statusesForResume';
import { HR } from 'crm-constants/roles';
import CRMButton from 'crm-ui/CRMButton/CRMButton';
import UploadFile from '../UploadFile/UploadFile';

import type { ResponsibleEmployee } from 'crm-constants/resumeRequestPage/resumeRequestPageConstant';
import type { StyledComponentProps } from '@material-ui/core/es';
import type { updateResumeArguments } from 'crm-actions/resumeRequestActions/resumeRequestActions';
import type { Session } from 'crm-containers/ResumeRequestPage/ResumeRequestPage';

import styles from './ResumeStyles';

type Props = {
    requestId: number,
    id: number,
    fio: string,
    status: string,
    statusList: Array<string>,
    responsibleEmployee: ResponsibleEmployee,
    responsiblesHrsList: Array<ResponsibleEmployee>,
    fetchResume: (requestId: number) => void,
    showResumeAttachments: (resumeId: number) => void,
    setUpdateHistory: (boolean) => void,
    addAttachment: () => void,
    showConfirmationDeleteDialog: (resumeId: number) => void,
    updateResume: (resumeId: number, updateResumeArguments, requestId: number) => Promise<void>,
    session: Session,
    setEditCardId: (resumeId: number | null) => void,
    editCardId: number,
    setCommentSubject: (name: string) => void,
} & StyledComponentProps;

const CLEAR_VALUE = -1;

const ResumeCard = ({
    classes,
    id,
    fio,
    status,
    statusList,
    responsibleEmployee,
    responsiblesHrsList,
    fetchResume,
    requestId,
    showResumeAttachments,
    setUpdateHistory,
    addAttachment,
    showConfirmationDeleteDialog,
    updateResume,
    session: { id: userId, roles },
    reactSwipeEl,
    setEditCardId,
    editCardId,
    setCommentSubject,
}: Props) => {
    const [localFio, setLocalFio] = useState(fio);
    const [localStatus, setLocalStatus] = useState({ label: status, value: status });
    const [localResponsible, setLocalResponsible] = useState(
        responsibleEmployee && { label: `${responsibleEmployee.firstName} ${responsibleEmployee.lastName}`,
            value: responsibleEmployee.id }
    );
    const [fioError, setFioError] = useState('');

    const translations = {
        deleteCv: useTranslation('requestForCv.cvSection.deleteCv'),
        maxSizeOfFiles: useTranslation('requestForCv.cvSection.maxSizeOfFiles'),
        enterCommentShort: useTranslation('requestForCv.mobile.enterCommentShort'),
        cvFile: useTranslation('requestForCv.cvSection.cvFile'),
        status: useTranslation('requestForCv.cvSection.status'),
        responsibleHR: useTranslation('requestForCv.cvSection.responsibleHR'),
        emptyBlock: useTranslation('requestForCv.cvSection.emptyBlock'),
        seeResumeFiles: useTranslation('requestForCv.mobile.seeResumeFiles'),
        edit: useTranslation('common.edit'),
        requiredField: useTranslation('common.requiredField'),
        cancel: useTranslation('common.cancel'),
        save: useTranslation('common.save'),
        fullName: useTranslation('requestForCv.cvSection.fullName'),
    };

    const checkFieldsChange = () => !equals(
        { fio, status, responsibleEmployeeId: pathOr(null, ['id'], responsibleEmployee) },
        { fio: localFio, status: localStatus.value, responsibleEmployeeId: pathOr(null, ['value'], localResponsible) });

    const onSave = async () => {
        setEditCardId(null);

        if (checkFieldsChange()) {
            const params = {
                fio: localFio,
                responsibleHrId: localResponsible ? localResponsible.value : CLEAR_VALUE,
                status: localStatus.value,
            };

            if ((!status !== localStatus.value) && localStatus.value === STATUS_IN_PROGRESS && roles.include(HR)) {
                params.responsibleHrId = userId;
            }

            await updateResume(id, params, requestId);

            setUpdateHistory(true);
        }
    };

    const changeFio = ({ target: { value } }: SyntheticInputEvent<HTMLInputElement>) => {
        value ? setFioError('') : setFioError(translations.requiredField);
        setLocalFio(value);
    };

    const validateInputFile = ({ size }) => {
        if (size > MAX_FILE_SIZE) {
            Notification.showMessage({
                message: translations.maxSizeOfFiles,
                closeTimeout: 15000,
            });
            return false;
        }

        return true;
    };

    const uploadFile = (resumeId: number) => async ({ target: { files: filesList } }) => {
        if (validateInputFile(filesList[0])) {
            await addAttachment(resumeId, head(filesList), requestId);
            setUpdateHistory(true);
            fetchResume(requestId);
        }
    };

    const getDotMenuConfig = (resumeId: number) => [
        { icon: Edit, text: translations.edit, handler: () => setEditCardId(id) },
        { icon: ChatBubbleOutline, text: translations.enterCommentShort, handler: () => setCommentSubject(fio) },
        {
            icon: AttachFile,
            text: translations.seeResumeFiles,
            handler: showResumeAttachments(id),
            itemClass: classes.attachIcon,
        },
        { component: <UploadFile
            key={requestId}
            icon={Add}
            text={translations.cvFile}
            onFileChange={uploadFile(resumeId)}
        /> },
        { icon: Delete, text: translations.deleteCv, handler: showConfirmationDeleteDialog(resumeId) },
    ];

    return <Grid className={classes.resumeItem}>
        {editCardId === id
            ? <Grid>
                <CRMInput
                    fullWidth
                    value={localFio}
                    onChange={changeFio}
                    error={fioError}
                    label={translations.fullName}
                />
                <Grid className={classes.row}>
                    <CRMAutocompleteSelect
                        value={localStatus}
                        options={statusList}
                        onChange={setLocalStatus}
                        controlled
                        menuShouldBlockScroll
                        isClearable={false}
                        maxMenuHeight={200}
                        label={translations.status}
                        menuPortalTarget={reactSwipeEl.current.containerEl}
                        menuPosition='fixed'
                        menuPlacement='auto'
                        isSearchable={false}

                    />
                </Grid>
                <Grid className={classes.row}>
                    <CRMAutocompleteSelect
                        value={localResponsible}
                        options={responsiblesHrsList}
                        onChange={setLocalResponsible}
                        controlled
                        menuShouldBlockScroll
                        maxMenuHeight={200}
                        label={translations.responsibleHR}
                        menuPortalTarget={reactSwipeEl.current.containerEl}
                        menuPosition='fixed'
                        menuPlacement='auto'
                        isSearchable={false}
                    />
                </Grid>
                <Grid
                    className={classes.row}
                    container
                    justify='center'
                >
                    <CRMButton
                        className={classes.buttonWrapper}
                        onClick={() => setEditCardId(null)}
                    >
                        {translations.cancel}
                    </CRMButton>
                    <CRMButton
                        primary
                        onClick={onSave}
                        disabled={fioError}
                    >
                        {translations.save}
                    </CRMButton>
                </Grid>
            </Grid>
            : <>
                <Typography className={classes.fio}>{fio}</Typography>
                <Grid
                    className={classes.status}
                    container
                    alignItems='baseline'
                    wrap='nowrap'
                >
                    <span className={classes.title}>{`${translations.status}:`}</span>
                    <span className={classes.status}>{status}</span>
                </Grid>
                <Grid className={classes.responsible}>
                    <span className={classes.title}>{`${translations.responsibleHR}:`}</span>
                    {responsibleEmployee
                        ? <UserInformationPopover
                            userName={`${responsibleEmployee.firstName} ${responsibleEmployee.lastName}`}
                            userNameStyle={classes.userInformation}
                            userId={responsibleEmployee.id}
                            reloadParent={() => fetchResume(requestId)}
                        />
                        : <CRMEmptyBlock />}
                </Grid>
            </>
        }
        {editCardId !== id && <CRMDotMenu
            className={classes.dotMenu}
            config={getDotMenuConfig(id)}
        />}
    </Grid>;
};

export default withStyles(styles)(ResumeCard);
