// @flow

import { connect } from 'react-redux';
import EstimationTable from 'crm-components/estimationRequestPage/EstimationTable';
import { fetchHistory } from 'crm-actions/estimationRequestActions/historyActions';
import { fetchEstimations, addEstimation, deleteEstimation } from 'crm-actions/estimationRequestActions/estimationTableActions';

const mapDispatchToProps = { fetchHistory, fetchEstimations, addEstimation, deleteEstimation };

const mapStateToProps = ({
    EstimationRequest: {
        EstimationTable: {
            estimations,
            loading,
        },
    },
}) => ({
    estimations,
    loading,
});

export default connect(mapStateToProps, mapDispatchToProps)(EstimationTable);
