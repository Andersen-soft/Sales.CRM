// @flow
import type { Dispatch } from 'redux';

export default function executeAction(
    dispatch: Dispatch,
    type: string,
    payload: any = null,
    meta: any = null,
): void {
    dispatch({ type, payload, meta });
}
