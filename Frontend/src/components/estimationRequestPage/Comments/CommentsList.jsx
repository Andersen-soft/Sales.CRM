// @flow

import React, { useEffect, useRef } from 'react';
import { Grid } from '@material-ui/core';
import CommentsCard from './CommentsCard';
import { AutoSizer, CellMeasurer, List, CellMeasurerCache } from 'react-virtualized';
import CRMLoader from 'crm-ui/CRMLoader/CRMLoader';

import type { Person } from 'crm-types/allResumeRequests';
import type { Comment } from './Comments';

type Props = {
    classes: Object,
    comments: Array<Comment>,
    onCommentEdit: (commendId: number) => void,
    onCommentDelete: (commentId: number) => void,
    userId: number,
    reloadComments: (updatedUser?: Person) => void,
    loading: boolean,
};

type RowProps = {
    index: number,
    key: string,
    style: Object,
    parent: Object,
};

const cache = new CellMeasurerCache({
    defaultHeight: 150,
    fixedWidth: true,
});

const CommentsList = ({
    classes,
    comments,
    onCommentEdit,
    onCommentDelete,
    userId,
    reloadComments,
    loading,
}: Props) => {
    const listRef = useRef(null);

    useEffect(() => {
        if (comments.length) {
            listRef.current && listRef.current.scrollToRow(comments.length);
        }
    }, [comments]);

    const rowRenderer = ({ index, key, style, parent }: RowProps) => {
        const {
            id,
            description,
            employee,
            createDate,
            isEdited,
        } = comments[index];

        return <CellMeasurer
            key={key}
            cache={cache}
            parent={parent}
            columnIndex={0}
            rowIndex={index}
        >
            <div key={key} style={{ padding: '0 8px 0 0', ...style }}>
                <CommentsCard
                    id={id}
                    description={description}
                    employee={employee}
                    createDate={createDate}
                    isEdited={isEdited}
                    reloadComments={reloadComments}
                    userId={userId}
                    onCommentEdit={onCommentEdit}
                    onCommentDelete={onCommentDelete}
                />
            </div>
        </CellMeasurer>;
    };

    return <Grid
        className={classes.commentsBlock}
        item
    >
        <AutoSizer>
            {({ height, width }) => (
                <List
                    ref={listRef}
                    width={width}
                    height={height}
                    overscanRowCount={10}
                    rowCount={comments.length}
                    rowHeight={cache.rowHeight}
                    rowRenderer={rowRenderer}
                    scrollToIndex={comments.length}
                    scrollToAlignment='end'
                    className={classes.list}
                />
            )}
        </AutoSizer>
        {loading && <CRMLoader />}
    </Grid>;
};

export default CommentsList;
