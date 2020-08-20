// @flow

import React, { useEffect, useRef } from 'react';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { AutoSizer, CellMeasurer, List, CellMeasurerCache } from 'react-virtualized';
import CRMLoader from 'crm-ui/CRMLoader/CRMLoader';
import { useMobile } from 'crm-components/common/MobileContextProvider/MobileContextProvider';
import CommentsCardDesktop from '../CommentsDesktop/CommentsCardDesktop';
import CommentsCardMobile from '../CommentsMobile/CommentsCardMobile';

import styles from './CommentsListStyles';

type Props = {
    loading: boolean,
    classes: Object,
    comments: Array<any>,
    handleCommentEdit: (commentId: number) => void,
    handleCommentDeleteInitiated: (commentId: number) => void,
    userId: number,
    getCommentsUpdate: () => void,
}

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
    loading,
    classes,
    comments,
    handleCommentEdit,
    handleCommentDeleteInitiated,
    userId,
    getCommentsUpdate,
}: Props) => {
    const listRef = useRef(null);

    useEffect(() => {
        if (comments.length) {
            listRef.current && listRef.current.scrollToRow(comments.length);
        }
    }, [comments]);

    const isMobile = useMobile();

    const CommentsCard = isMobile ? CommentsCardMobile : CommentsCardDesktop;

    const rowRenderer = ({ index, key, style, parent }: RowProps) => <CellMeasurer
        key={key}
        cache={cache}
        parent={parent}
        columnIndex={0}
        rowIndex={index}
    >
        <div key={key} style={{ padding: '8px 8px 0 0', ...style }}>
            <CommentsCard
                commentCurrent={comments[index]}
                onCommentEdit={handleCommentEdit}
                onCommentDelete={handleCommentDeleteInitiated}
                userId={userId}
                reloadComments={getCommentsUpdate}
            />
        </div>
    </CellMeasurer>;

    return <Grid
        className={classes.commentsContainer}
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

export default withStyles(styles)(CommentsList);
