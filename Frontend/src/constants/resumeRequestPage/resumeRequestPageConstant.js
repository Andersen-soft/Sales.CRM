// @flow

export const RESUME_REQUEST: string = 'RESUME_REQUEST';
export const GET_RESUME_REQUEST_SUCCESS: string = 'GET_RESUME_REQUEST_SUCCESS';
export const GET_RESUME_REQUEST_ERROR: string = 'GET_RESUME_REQUEST_ERROR';
export const UPDATE_RESUME_SUCCESS: string = 'UPDATE_RESUME_SUCCESS';
export const ADD_RESUME_ATTACHMENT_SUCCESS: string = 'ADD_RESUME_ATTACHMENT_SUCCESS';
export const DELETE_RESUME_ATTACHMENT_SUCCESS: string = 'DELETE_RESUME_ATTACHMENT_SUCCESS';
export const DELETE_RESUME_SUCCESS: string = 'DELETE_RESUME_SUCCESS';
export const ADD_RESUME_REQUEST: string = 'ADD_RESUME_REQUEST';
export const ADD_RESUME_ERROR: string = 'ADD_RESUME_ERROR';
export const RESUME_REQUEST_SUCCESS: string = 'RESUME_REQUEST_SUCCESS';
export const RESET_PAGE: string = 'RESET_PAGE';

export const URL_GET_RESUME: string = '/resume_request/resume';
export const URL_UPDATE_RESUME: string = '/resume_request/resume/';
export const URL_ADD_RESUME_ATTACHMENT = (id: number) => `/resume_request/resume/${id}/attachment`;
export const URL_DELETE_RESUME_ATTACHMENT = (id: number, fileId: number) => `/resume_request/resume/${id}/attachment/${fileId}`;
export const URL_DELETE_RESUME = '/resume_request/resume/';
export const URL_GET_USERS_REQUEST: string = '/employee/get_employees';
export const URL_ADD_RESUME_REQUEST: string = '/resume_request';
export const URI_COMMENTS: string = '/comment';
export const URL_ADD_RESUME = (id: number) => `/resume_request/${id}/resume`;
export const URL_GET_STATUSES: string = '/resume_request/get_statuses';

export const COMMENTS_REQUEST_SIZE = 1000;

export const EMPTY_VALUE = -1;
export const MAX_INPUT_LENGTH = 600;

export const userRoles = {
    HR: 5,
};

type Employee = {
  id: number,
  firstName: string,
  lastName: string
};

export type File = {
  addedDate: string,
  employee: Employee,
  id: number,
  name: string
};

export type ResponsibleEmployee = {
  lastName: string,
  firstName: string,
  id: number,
  additionalInfo: string,
  additionalPhone: string,
  email: string,
  phone: string,
  skype: string
};

export type ResumeItem = {
  id: number,
  fio: string,
  status: string,
  responsibleHr: ResponsibleEmployee,
  files: Array<File>
};

export type Resume = {
  files: Array<File>,
  fio: string,
  id: number,
  isActive: boolean,
  responsibleEmployee: ResponsibleEmployee,
  status: string,
  createDate: string,
};

export type NewResume = {
  fullName: string,
  responsibleHrid: ?number,
  status: string
};

export type AutoCompleteType = {
  label: string,
  value: number
};

type ResumeTableHeader = {
  title: string,
  key: string
};

export const resumeTableColumn: Array<ResumeTableHeader> = [
    {
        title: 'Full name',
        key: 'fio',
    },
    {
        title: 'Status',
        key: 'status',
    },
    {
        title: 'Responsible HR',
        key: 'responsibleHR',
    },
    {
        title: 'CV file',
        key: 'files',
    },
    {
        title: 'Date of CV’s upload',
        key: 'createDate',
    },
    {
        title: '',
        key: 'actions',
    },
];

export type UserKeys = {
  id: number,
  login: string,
  createDate: string,
  isActive: boolean,
  lastAccessDate: string,
  role: string,
  companies: Array<Object>,
  firstName: string,
  lastName: string,
  email: string,
  skype: string,
  phone: string,
  additionalPhone: string,
  additionalInfo: string
};

export const AVAILABLE_FILE_TYPES: string = '.jpg,.png,.gif,.txt,.doc,.docx,.pdf,.xls,.xlsx,.ppt,.pptx,.odt,.odts,.odg,.odp';

export const COMMENT_TEXT_FIELD_ID: string = 'commentInput';

export const NOTIFICATION_ERRORS = {
    UPDATE_FIELD_ERR: 'Error! Impossible to edit field',
    ADD_ATTACHMENT_ERR: 'Error! Impossible to add file',
    DELETE_ATTACHMENT_ERR: 'Error! Impossible to delete file',
    DELETE_CANDIDATE_ERR: 'Error! Impossible to delete applicant',
    ADD_CANDIDATE_ERR: 'Error! Impossible to add applicant',
    ADD_COMMENT_ERR: 'Error! Impossible to add comment',
    DELETE_COMMENT_ERR: 'Error! Impossible to delete comment',
    UPDATE_COMMENT_ERR: 'Error! Impossible to edit comment',
};

export const RESUME_TABLE_ROW_PER_PAGE: number = 10;

export const ADD_OR_UPDATE_COMMENT_MESSAGE = '/topic/resume_request/comments';
export const DELETE_COMMENT_MESSAGE = '/topic/resume_request/deleted';
