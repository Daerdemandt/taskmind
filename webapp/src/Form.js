
import React from "react";

import Modal from '@material-ui/core/Modal';
import Form from '@rjsf/material-ui';
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash/fp";

const getCurrentNodeId = _.prop('currentNodeId');

const sampleSchema = {
    "title": "Node contents",
    "description": "Edit node contents here",
    "type": "object",
    "required": [ "title"],
    "properties": {
        "title": {"type":"string"}
    }
};

const FormModal = () => {
    const nodeId = useSelector(getCurrentNodeId);
    const dispatch = useDispatch();
    const nodeContent = useSelector(_.prop(['parsedTree', 'nodeById', nodeId, 'content']));

    return <Modal open={!_.isUndefined(nodeId)} onClose={() => dispatch({type:'SELECT_NODE'})} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description" >
        <Form schema={sampleSchema} onSubmit={({formData}) => dispatch({type:'UPDATE_NODES', payload:[[{id:nodeId}, formData]]})}/>
    </Modal>
};

export default FormModal;
