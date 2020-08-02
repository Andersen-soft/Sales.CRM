// @flow

import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Tooltip, IconButton } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { changeResume } from 'crm-api/ResumeService/resumeService';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';
import { useTranslation } from 'crm-hooks/useTranslation';
import CollapsedComment from './CollapsedComment';
import EditableComment from './EditableComment';

import styles from './CommentStyles';

type Props = {
    classes: Object,
    values: [string, number, () => void, (boolean) => void]
};

const CommentCell = ({
    values: [comment, id, reloadTable, setLoading],
    classes,
}: Props) => {
    const [normalMessageHeight, setNormalMessageHeight] = useState(true);
    const [inEditMode, setInEditMode] = useState(false);

    const translations = {
        edit: useTranslation('common.edit'),
    };

    const handleEdit = () => setInEditMode(edit => !edit);

    const handleSave = async (newComment: string) => {
        setLoading(true);
        await changeResume({ resumeId: id, comment: newComment });
        handleEdit();
        reloadTable();
    };

    return <Grid
        container
        className={classes.editableCell}
    >
        {inEditMode
            ? <EditableComment
                message={comment}
                classes={classes}
                updateEditRowState={handleSave}
            />
            : <Grid
                item
                container
                direction='row'
                justify='flex-start'
                wrap='nowrap'
                alignItems='center'
            >
                <Grid>
                    {comment
                        ? <CollapsedComment
                            message={comment}
                            classes={classes}
                            normalMessageHeight={normalMessageHeight}
                            setNormalMessageHeight={setNormalMessageHeight}
                        />
                        : <CRMEmptyBlock />
                    }
                </Grid>
                <Tooltip title={translations.edit}>
                    <IconButton onClick={handleEdit}>
                        <Edit />
                    </IconButton>
                </Tooltip>
            </Grid>
        }
    </Grid>;
};

export default withStyles(styles)(CommentCell);
