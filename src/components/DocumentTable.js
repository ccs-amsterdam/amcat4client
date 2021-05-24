import React from 'react';
import { connect } from 'react-redux';

import SelectionTable from './SelectionTable';
import { selectDocument } from '../actions';

const documentTableColumns = [
  { Header: 'ID', accessor: 'id', headerClass: 'two wide' },
  { Header: 'Date', accessor: 'date', headerClass: 'six wide' },
  { Header: 'Title', accessor: 'title', headerClass: 'eight wide' },
];

class DocumentTable extends React.Component {
  render() {
    if (!this.props.amcatIndex) return null;

    return (
      <SelectionTable
        columns={documentTableColumns}
        data={this.props.documents}
        selectedRow={this.props.document}
        setSelectedRow={(row) => {
          this.props.selectDocument(row);
        }}
        defaultSize={15}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    amcatIndex: state.amcatIndex,
    documents: state.documents,
    document: state.document,
  };
};

export default connect(mapStateToProps, { selectDocument })(DocumentTable);
