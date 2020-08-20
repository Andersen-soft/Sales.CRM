// @flow

import React, { PureComponent } from 'react';
import { Button, Typography, Tooltip } from '@material-ui/core';
import { saveAs } from 'file-saver';
import Download from '@material-ui/icons/GetApp';

import { withStyles } from '@material-ui/core/styles';
import styles from './ReportUploadStyles';

type Props = {
    classes: Object,
    fileName: string,
    handleDownload: () => void,
};

class ReportUpload extends PureComponent<Props> {
    handleDownLoadReport = async () => {
        const { handleDownload, fileName } = this.props;
        const fileReport = await handleDownload();
        const name: string = fileName || 'requests_report.csv';

        saveAs(new Blob([fileReport]), name);
    };

    render() {
        const { classes } = this.props;

        return (
            <Button
                onClick={this.handleDownLoadReport}
                className={classes.wrapper}
            >
                <Download className={classes.icon} />
                <Tooltip title='Download with set filters'>
                    <Typography>
                        Download csv file
                    </Typography>
                </Tooltip>
            </Button>
        );
    }
}

export default withStyles(styles)(ReportUpload);
