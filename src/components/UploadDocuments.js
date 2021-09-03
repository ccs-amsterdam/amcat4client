import React from 'react';
import { connect } from 'react-redux';
import { CSVReader } from 'react-papaparse';

import { uploadDocuments } from '../actions';
import PreviewTable from './PreviewTable';
import SubmitForm from './submitForm';

import { Grid } from 'semantic-ui-react';

class UploadDocuments extends React.Component {
  constructor(props) {
    super(props);
    this.fileRef = React.createRef();
  }

  render() {
    if (!this.props.amcatIndex) return null;
    return (
      <Grid stackable style={{ marginTop: '4.3em' }}>
        <Grid.Row>
          <Grid.Column floated="right" width={4}>
            {' '}
            <CSVReader
              ref={this.fileRef}
              onFileLoad={(data) => this.props.uploadDocuments(data)}
              addRemoveButton
              onRemoveFile={() => this.props.uploadDocuments([])}
            >
              <span>Click to upload</span>
            </CSVReader>
          </Grid.Column>
          <Grid.Column floated="right" width={10}>
            <SubmitForm
              data={this.props.newDocuments}
              amcatIndex={this.props.amcatIndex}
              fileRef={this.fileRef}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <PreviewTable data={this.props.newDocuments} />
        </Grid.Row>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    amcatIndex: state.amcatIndex,
    newDocuments: state.uploadDocuments,
  };
};

export default connect(mapStateToProps, { uploadDocuments })(UploadDocuments);
