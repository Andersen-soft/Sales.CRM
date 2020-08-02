// @flow
// TODO: replace it with flow-typed implementation
export type Action = {
    type: string,
    payload: any,
    meta: any,
}

type PromiseAction = Promise<Action>;
export type Dispatch = (action: Action | ThunkAction | PromiseAction) => void;
type ThunkAction = (dispatch: Dispatch) => void;

export type ResumeRequestTableContent =
{
    favorite: boolean,
    id: number,
    company: string,
    project: string,
    technology: string,
    deadline: string,
    status: string,
    rm: string,
}

export type MarkRequestTableContent =
{
    favorite: boolean,
    id: number,
    company: string,
    project: string,
    technology: string,
    deadline: string,
    status: string,
    rm: string,
}

export type ActivityTableContent =
{
    id: number,
    company: string,
    date: string,
    fromCustomer: string,
    theme: string,
    method: string,
    nextActivity: string,
    comment: string,
}

export type Select = { value: string, title: string };
