// @flow

import React, {
    useState, useRef, useEffect,
} from 'react';
import cn from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { type BaseTextFieldProps } from '@material-ui/core/TextField';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import RootRef from '@material-ui/core/es/RootRef/RootRef';
import { omit } from 'ramda';
import CRMInput from '../../crmUI/CRMInput/CRMInput';
import CalendarIcon from 'crm-static/customIcons/calendar.svg';
import styles from './CRMDateInputStyles';

export const INPUT_THEME_DEFAULT = 'input';
export const INPUT_THEME_SECOND = 'inline';

export type CRMDateInputTheme = 'input' | 'inline';

type Props = {
    children: Node,
    renderElement: Node,
    inputValue: ?string,
    inputHint?: boolean,
    classes: Object,
    theme: CRMDateInputTheme,
    clearable: boolean,
    onClear: () => void,
    fullWidth: boolean,
    readOnly?: boolean,
    label?: string,
    InputProps?: BaseTextFieldProps,
    inlineClass?: string,
    isOpen: boolean,
    setIsOpen: (isOpen: boolean) => void,
    withIcon?: boolean,
};

const CRMDateInput = ({
    classes,
    renderElement,
    inputValue,
    onClear,
    children,
    inputHint,
    clearable,
    theme = INPUT_THEME_DEFAULT,
    fullWidth,
    label,
    readOnly,
    InputProps = { classes: {} },
    inlineClass,
    isOpen,
    setIsOpen,
    withIcon,
    ...rest
}: Props) => {
    const [popupAnchorElement, setPopupAnchorElement] = useState(null);

    const inputRef = useRef(null);
    const popupRef = useRef(null);

    const handleOutsideClick = ({ target }: Event) => {
        const inputElement = inputRef.current;
        const popoverElement = popupRef.current;

        if (
            inputElement
            && popoverElement
            && !inputElement.contains(target)
            && !popoverElement.contains(target)
        ) {
            setPopupAnchorElement(null);
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
    }, []);

    useEffect(
        () => () => document.removeEventListener('mousedown', handleOutsideClick),
        [],
    );

    const handleInputFocus = ({
        target,
    }: SyntheticInputEvent<HTMLInputElement>) => {
        setPopupAnchorElement(target);
        setIsOpen(true);
    };

    const getDateElement = () => {
        const { classes: inputClasses } = InputProps;

        if (theme === INPUT_THEME_DEFAULT) {
            return (
                <CRMInput
                    {...rest}
                    clearable={clearable}
                    InputProps={{
                        classes: {
                            ...InputProps.classes,
                            root: cn({ [classes.input]: !fullWidth }, inputClasses.root),
                            input: cn(classes.inputElem, {
                                [classes.inputHint]: inputHint,
                            }, inputClasses.input),
                        },
                        ...(withIcon
                            ? {
                                endAdornment: <CalendarIcon />,
                                ...omit(['classes'], InputProps),
                            }
                            : { ...omit(['classes'], InputProps) }),
                    }}
                    value={inputValue}
                    onFocus={handleInputFocus}
                    onClear={onClear}
                    fullWidth={fullWidth}
                    readOnly={readOnly}
                    label={label}
                />
            );
        }
        if (theme === INPUT_THEME_SECOND) {
            return (
                <Typography
                    onClick={handleInputFocus}
                    className={cn(classes.inlineStyle, inlineClass)}
                >
                    {inputValue}
                </Typography>
            );
        }

        return <></>;
    };

    const dateElement = getDateElement();

    return (
        <>
            <RootRef rootRef={inputRef}>{dateElement}</RootRef>
            <Popper
                open={isOpen && !!popupAnchorElement}
                anchorEl={popupAnchorElement}
                modifiers={{
                    offset: { offset: '10px, 10px' },
                }}
                className={classes.popper}
            >
                <RootRef rootRef={popupRef}>
                    <Paper className={classes.popupRoot}>{children}</Paper>
                </RootRef>
            </Popper>
        </>
    );
};

CRMDateInput.defaultProps = {
    clearable: true,
    isOpen: true,
    setIsOpen: () => {},
};
export default withStyles(styles)(CRMDateInput);
