import { connect } from 'react-redux';
import Attachment from 'crm-components/estimationRequestPage/Attachment';
import { fetchHistory } from 'crm-actions/estimationRequestActions/historyActions';

const mapDispatchToProps = { fetchHistory };

export default connect(null, mapDispatchToProps)(Attachment);
