// @flow

import React, { useEffect, useRef, useState } from 'react';
import { withRouter } from 'react-router-dom';

import cn from 'classnames';
import applyForUsers from 'crm-utils/sales/applyForUsers';
import CRMTag from 'crm-components/crmUI/CRMTag/CRMTag';
import EmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';

import { Tooltip, Grid, Popover } from '@material-ui/core';
import { Add, ArrowDropDown, Check } from '@material-ui/icons';
import { TinyIconButton } from 'crm-components/common/cardAttributeWrappers';
import type { CommonListItem } from 'crm-types/resourceDataTypes';
import { useTranslation } from 'crm-hooks/useTranslation';

const MAX_TAG_LENGTH = 20;

type Props = {
    title: string,
    list: Array<CommonListItem>,
    sale: Object,
    listFromRequest: Array<Object>,
    updateHandler: Function,
    addButtonHint?: string,
    moreButtonHint? : string,
    isEditingDisabled?: boolean,
    userRoles?: Array<string>,
    applyId: boolean,
    pagePath: string,
    disableForHr?: boolean,
    classes: Object,
};


const RemovableItemList = ({
    title,
    list,
    sale,
    listFromRequest,
    updateHandler,
    addButtonHint = 'Add',
    moreButtonHint,
    isEditingDisabled = false,
    userRoles,
    applyId,
    pagePath,
    disableForHr,
    classes = {},
}: Props) => {
    const arrowDropDownAnchor = useRef(null);
    const popupAddAnchor = useRef(null);

    const [isOpenTagList, setTagListState] = useState(false);
    const [isShowingAllTags, setIsEdit] = useState(false);
    const [tags, setTagList] = useState([]);
    const [moreButtonHintData, setMoreButtonHintData] = useState(moreButtonHint);

    const translations = {
        showAll: useTranslation('common.showAll'),
    };

    if (!moreButtonHintData) {
        setMoreButtonHintData(translations.showAll);
    }

    useEffect(() => {
        const tagList = [...listFromRequest, ...list].sort((a, b) => a.id - b.id);

        setTagList(tagList);
    }, [listFromRequest]);


    const TagsWrapper = ({ maxLength }: {maxLength?: number}) => (
        list.length
            ? list.map(({ id, name }) => (
                <Grid
                    item
                    key={id}
                >
                    <CRMTag
                        label={actualizeStrLength(name, maxLength)}
                        onClick={() => !disableForHr && window.open(`${pagePath}/${id}`)}
                    />
                </Grid>
            ))
            : <Grid className={classes.emptyBlock}>
                <EmptyBlock />
            </Grid>
    );

    return (
        <>
            <Grid
                item
                container
                xs={2} sm={2}
                lg={2} xl={2}
                ref={arrowDropDownAnchor}
                alignItems='center'
                className={classes.title}
            >
                {title}
            </Grid>
            <Grid
                item
                container
                xs={10} sm={10}
                lg={10} xl={10}
                wrap='nowrap'
                justify={list.length ? 'flex-start' : 'flex-end'}
                alignItems='center'
                className={classes.overflowList}
            >
                <TagsWrapper maxLength={MAX_TAG_LENGTH} />
            </Grid>
            {applyForUsers(applyId, userRoles)
                                && <Tooltip
                                    title={moreButtonHintData} placement='right'
                                    onClick={() => setIsEdit(!isShowingAllTags)}
                                >
                                    <span className={classes.wrapperArrowDropdown}>
                                        <TinyIconButton
                                            aria-label='Add'
                                            disabled={isEditingDisabled}
                                            className={classes.positionFix}
                                            onMouseDown={e => e.preventDefault()}
                                            classes={{ root: classes.showAllButtonContainer }}
                                        >
                                            <ArrowDropDown classes={{ root: classes.showAllButton }} fontSize='small' />
                                        </TinyIconButton>
                                    </span>
                                </Tooltip>}
            <Popover
                open={isShowingAllTags}
                anchorEl={arrowDropDownAnchor.current}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={() => setIsEdit(!isShowingAllTags)}
            >
                <Grid container className={classes.wrapperTags}>
                    <TagsWrapper className={classes.overflowFix} />
                </Grid>
                <TinyIconButton
                    aria-label='Add'
                    ref={popupAddAnchor}
                    className={classes.popupAdd}
                    disabled={isEditingDisabled || !tags.length}
                    onClick={() => setTagListState(!isOpenTagList)}
                >
                    <Add fontSize='small' />
                </TinyIconButton>
            </Popover>
            <Popover
                open={isOpenTagList}
                anchorEl={popupAddAnchor.current}
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={() => setTagListState(!isOpenTagList)}
            >

                <Grid
                    container item
                    direction='column'
                    className={cn(classes.wrapperTags, classes.wrapperTagList)}
                >
                    {tags.map(({ id, name }) => (
                        <Grid
                            item
                            key={id}
                            onClick={() => updateHandler(id, sale.id)}
                        >
                            {list.some(chosen => chosen.id === id)
                                ? <CRMTag
                                    item
                                    label={name}
                                    icon={<Check />}
                                />
                                : <CRMTag
                                    icon={
                                        <Tooltip title={addButtonHint}>
                                            <Add />
                                        </Tooltip>
                                    }
                                    item
                                    label={name}
                                />
                            }
                        </Grid>
                    ))}
                </Grid>
            </Popover>
        </>
    );
};


function actualizeStrLength(str, len = str.length) {
    return str.length > len ? `${str.substr(0, len)}...` : str;
}

export default withRouter(RemovableItemList);
