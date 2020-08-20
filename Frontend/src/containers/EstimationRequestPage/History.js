// @flow

import { connect } from 'react-redux';
import History from 'crm-components/estimationRequestPage/History';
import { fetchHistory } from 'crm-actions/estimationRequestActions/historyActions';

const mapStateToProps = ({
    EstimationRequest: {
        History: {
            eventHistory,
            loading,
            totalElements,
            resetPage,
        },
    },
}) => ({
    eventHistory,
    loading,
    totalElements,
    resetPage,
});

const mapDispatchToProps = {
    fetchHistory,
};

export default connect(mapStateToProps, mapDispatchToProps)(History);
