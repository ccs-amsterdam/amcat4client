import React from 'react';
import { connect } from 'react-redux';

import DocumentForms from './DocumentForms';
import { setIndexFields, setFieldValues } from '../actions';

import { Form, Button } from 'semantic-ui-react';

class CreateDocument extends React.Component {
  componentDidMount() {
    if (this.props.amcatIndex && this.props.amcat) {
      this.props.amcat.getFields(this.props.amcatIndex.name).then((res) => {
        this.props.setIndexFields(res.data);
      });
    } else {
      this.props.setIndexFields(null);
    }
  }

  onCreate = () => {
    let submitData = { ...this.props.fieldValues };

    for (const key of Object.keys(submitData)) {
      if (key === 'date' || /_date$/.test(key)) {
        submitData[key] = submitData[key].toISOString();
      }
    }

    this.props.amcat
      .createDocuments(this.props.amcatIndex.name, [submitData])
      .then((res) => {
        // maybe check for 201 before celebrating

        this.props.setFieldValues({});
      })
      .catch((e) => {
        console.log(e);
      });
  };

  render() {
    return (
      <Form>
        <DocumentForms />
        {!this.props.amcatIndex ? null : (
          <Button primary onClick={this.onCreate}>
            Create document
          </Button>
        )}
      </Form>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    amcat: state.amcat,
    amcatIndex: state.amcatIndex,
    indexFields: state.indexFields,
    fieldValues: state.fieldValues,
  };
};

export default connect(mapStateToProps, { setIndexFields, setFieldValues })(
  CreateDocument
);
