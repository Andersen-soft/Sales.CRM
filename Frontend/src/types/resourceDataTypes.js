// @flow

export type CRMResponse = {
    success: boolean,
    responseCode: number,
    data: Object,
    errorCode: string | null,
    errorMessage: string | null,
};

export type ResumeComment = {
    id: number,
    hrComment: string,
};

export type Responsible = {
    additionalInfo: string,
    additionalPhone: string,
    email: string,
    firstName: string,
    id: number,
    lastName: string,
    phone: string,
    skype: string,
};

export type ResponsibleRm = {
    id: number,
    firstName: string,
    lastName: string,
}

export type Company = {
    description?: string,
    id?: number,
    name?: string,
    responsibleRm?: ResponsibleRm,
    url?: string,
    linkedSales: Array<number>,
    phone?: string,
};

export type Industries = {
    common: boolean,
    id: number,
    name: string,
};

export type ResumeData = {
    id: number,
    candidateInfo: string,
    hrComment: string,
    isActive: boolean,
    rating: {
        rating: number,
    },
    status: string,
    responsibleHr: string,
};

export type ResumeRequest = {
    id: number,
    name: string,
    status: string,
    isActive: boolean,
    isFavorite: boolean,
    resumes: Array<ResumeData>,
    priority: string,
    createDate: string,
    doneDate: string | null,
};

export type CommonListItem = {
    id: number,
    name: string,
    oldId: string,
};

export type Sale = {
    id: number,
    companyId: number,
    companyName: string,
    createDate: string,
    description: string,
    estimations: Array<CommonListItem>,
    name: string,
    lastActivity: { dateActivity: string },
    mainContact: Object,
    nextActivityDate: string,
    responsible: Responsible,
    resumes: Array<CommonListItem>,
    status: string,
    nextActivityId: number,
};

export type CompanySale = Sale & {
    company: Company,
};

export type Request = {
    id: number,
    createDate: number[],
    deadline: number[],
    isActive: boolean,
    status: string,
    projectDescription: string,
    priority: string,
    author: string,
    responsiblePm: Responsible,
};

export type Contact = {
    id: number,
    isActive?: ?boolean,
    firstName: string,
    lastName: string,
    position?: ?string,
    email?: ?string,
    skype?: ?string,
    socialNetwork?: ?string,
    socialContact?: ?string,
    phone?: ?string,
    personalEmail?: ?string,
    country?: ?string,
    sourceId?: ?number,
    dateOfBirth: ?string,
};


export type ContactData = {
    company: {
        id: number,
        name: string,
    },
    contactRelatedSales: Array<number> | [],
    id: number,
    isActive?: ?boolean,
    firstName: string,
    lastName: string,
    position?: ?string,
    email?: ?string,
    skype?: ?string,
    socialNetwork?: ?string,
    socialContact?: ?string,
    phone?: ?string,
    personalEmail?: ?string,
    country?: ?string,
    sourceId?: ?number,
}

export type NewContactData = {
    additionalInfo: string,
    additionalPhone: string,
    companyId?: 0,
    email: string,
    firstName: string,
    phone: string,
    profileLinks: Array<string>,
    lastName: string,
    skype: string,
};

export type NewCompanyData = {
    contacts?: Array<NewContactData>,
    description: string,
    name: string,
    responsibleId: number,
    url: string,
}

export type Report = {
    createDate: string,
    sourceName: string,
    id: number,
    status: string,
    statusChangedDate: string,
    responsibleName: string,
    requestType: string,
    requests: {
        id: number,
        name: string,
        type: string,
    },
    companyName: string,
    companyUrl: string,
    socialContact: string,
    contactPosition: string,
    email: string,
    skype: string,
    companyRecommendationName?: string,
    companyRecommendationId?: number,
    companyResponsibleRmId?: number,
    companyResponsibleRmName?: string,
};

export type Statistic = {
    source: string,
    leads: string,
    avg_weight?: string,
};

export type ContactsType = {
    firstName: string;
    lastName: string;
}

export type SingleActivity = {
    contacts: string;
    dateActivity: string;
    description: string;
    id: number;
    responsibleName: string;
    types: string;
}

export type FilterInfo = {
    companyName: Array<string>,
    socialContact: Array<string>,
    country: Array<string>,
    sourceName: Array<string>,
    status: Array<string>,
    responsibleName: Array<string>,
    weight: Array<number>,
};

export type ActivitiesReport = {
    id: number;
    sales: string;
    salesId: number;
    call: string;
    socialNetwork: string;
    email: string;
    meeting: string;
    interview: string;
    sum: string;
    resumeRequests: string;
    estimationRequests: string;
};

export type SortType = {
    ascending: boolean,
    descending: boolean,
    direction: string,
    ignoreCase: boolean,
    nullHandling: string,
    property: string,
};

export type CompanySearchingType = {
    description: null,
    id: number | string,
    linkedSales: Array<number>,
    name: string,
    phone: null,
    url: null,
};

export type SearchingResponseType = {
    content: Array<CompanySearchingType>,
    first: boolean,
    last: boolean,
    number: number,
    numberOfElements: number,
    size: number,
    sort: Array<SortType>,
    totalElements: number,
    totalPages: number,
};
