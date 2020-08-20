// @flow

import { connect } from 'react-redux';
import {
    fetchResumeRequest,
    updateResume as updateResumeRequest,
    deleteResume as deleteResumeRequest,
} from 'crm-actions/resumeRequestActions/resumeRequestCardActions';
import {
    fetchResume,
    updateResume,
    addAttachment,
    deleteAttachment,
    deleteResume,
    createResume,
} from 'crm-actions/resumeRequestActions/resumeRequestActions';
import ResumeRequestPage from 'crm-components/resumeRequestPage/ResumeRequestPage';

import { type AppState } from 'crm-stores';
import type { File, NewResume, Resume } from 'crm-constants/resumeRequestPage/resumeRequestPageConstant';
import type { updateResumeArguments } from 'crm-actions/resumeRequestActions/resumeRequestActions';

export type ResumeRequest = {
    company?: {
        id: number,
        name: string,
    },
    created?: string,
    deadLine?: string,
    responsibleForSaleRequest?: {
        firstName: string,
        id: number,
        lastName: string,
    },
    id?: number,
    name?: string,
    priority?: string,
    responsible?: {
        firstName: string,
        id: number,
        lastName: string,
    },
    saleId?: number | null,
    status?: string,
    autoDistribution: boolean,
};

export type Session = {
    username: string,
    roles: Array<string>,
    id: number,
    employeeLang: 'string'
};

export type resumeRequestCardPropsType = {
    request: ResumeRequest,
    error: Object,
    session: Session,
}

export type resumeTablePropsType = {
    resumes: Array<Resume>,
    loading: boolean,
    totalElements: number,
    resetPage: boolean,
}
export type ResumeRequestActions = {
    fetchResumeRequest: (number | string) => Promise<ResumeRequest>,
    updateResumeRequest: (resumeId: number, fieldName: string, updateData: string | number) => boolean,
    deleteResumeRequest: (number) => void,
    fetchResume: (number, ?number, ?number) => void,
    updateResume: (number, updateResumeArguments, number) => Promise<void>,
    addAttachment: (number, File, number) => void,
    deleteAttachment: (number, number, number) => void,
    deleteResume: (number, number) => Promise<void>,
    createResume: (number, NewResume) => void,
};

const mapStateToProps = ({
    ResumeRequest: {
        ResumeRequestCard: {
            request,
            error,
        },
        Resume: {
            totalElements,
            resumes,
            isLoading,
            resetPage,
        },
    },
    session: { userData },
}: AppState) => ({
    resumeRequestCardProps: {
        request,
        error,
        session: userData,
    },
    resumeTableProps: {
        resumes,
        loading: isLoading,
        totalElements,
        resetPage,
    },
});

const mapDispatchToProps = {
    fetchResumeRequest,
    updateResumeRequest,
    deleteResumeRequest,
    fetchResume,
    updateResume,
    addAttachment,
    deleteAttachment,
    deleteResume,
    createResume,
};

export default connect(mapStateToProps, mapDispatchToProps)(ResumeRequestPage);
