// @flow
export type FormikProps = {
    // FormikComputedProps
    dirty: boolean,
    isValid: boolean,
    // Formik state and state helpers
    values: any,
    setValues: (values: any) => void,
    setFieldValue: (field: string, value: any, validate?: boolean) => void,

    errors: any,
    setErrors: (errors: { [key: string]: string }) => void,
    setFieldError: (field: string, message: string) => void,

    touched: any,
    setTouched: (touched: { [key: string]: boolean }) => void,
    setFieldTouched: (
        field: string,
        isTouched?: boolean,
        validate?: boolean,
    ) => void,

    isSubmitting: boolean,
    setSubmitting: (isSubmitting: boolean) => void,

    status?: any,
    setStatus: (status: any) => void,

    resetForm: (nextProps?: any) => void,
    validateForm: () => Promise<Object>,
    submitForm: () => void,

    // FormikHandlers

    handleSubmit: (e: SyntheticEvent<EventTarget>) => void,
    handleChange: (e: SyntheticEvent<EventTarget> | string) => void,
    handleChangeValue: (name: string, value: any) => void,
    handleBlur: (e: SyntheticEvent<EventTarget>) => void,
    handleReset: () => void
}
