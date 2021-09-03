import React from 'react';
import { connect } from 'react-redux';

import { setFieldValues } from '../actions';

import { Form } from 'semantic-ui-react';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';

class DocumentForms extends React.Component {
  onSubmit(key, value) {
    const newFieldValues = { ...this.props.fieldValues };
    newFieldValues[key] = value;
    this.props.setFieldValues(newFieldValues);
  }

  render() {
    if (!this.props.fields) return null;
    return Object.keys(this.props.fields).map((key) => {
      if (this.props.fields[key] === 'date') {
        return (
          <SemanticDatepicker
            key={key}
            label={key}
            value={
              this.props.fieldValues[key] ? this.props.fieldValues[key] : ''
            }
            onChange={(e, d) => {
              this.onSubmit(d.label, d.value);
            }}
          />
        );
      } else if (this.props.fields[key] === 'text') {
        return (
          <Form.TextArea
            key={key}
            value={
              this.props.fieldValues[key] ? this.props.fieldValues[key] : ''
            }
            onChange={(e, d) => this.onSubmit(key, d.value)}
            label={key}
          />
        );
      } else if (this.props.fields[key] === 'keyword') {
        return (
          <Form.TextArea
            key={key}
            value={
              this.props.fieldValues[key] ? this.props.fieldValues[key] : ''
            }
            onChange={(e, d) => this.onSubmit(key, d.value)}
            label={key}
          />
        );
      }
      return null;
    });
  }
}

const mapStateToProps = (state) => {
  return {
    fields: state.indexFields,
    fieldValues: state.fieldValues,
  };
};

export default connect(mapStateToProps, { setFieldValues })(DocumentForms);
