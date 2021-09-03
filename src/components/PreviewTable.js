import React from 'react';
import { connect } from 'react-redux';

import { Container, Header, Table } from 'semantic-ui-react';

class PreviewTable extends React.Component {
  constructor(props) {
    super(props);
    this.n = 10;
  }

  createHeader = (data) => {
    return data[0].data.map((colname) => {
      return (
        <Table.HeaderCell>
          <span title={colname}>{colname}</span>
        </Table.HeaderCell>
      );
    });
  };

  createRows = (data, n) => {
    const previewdata = data.slice(0, n + 1);
    return previewdata.slice(1).map((row) => {
      return <Table.Row>{this.createRowCells(row.data)}</Table.Row>;
    });
  };

  createRowCells = (row) => {
    return row.map((cell) => {
      return (
        <Table.Cell>
          <span title={cell}>{cell}</span>
        </Table.Cell>
      );
    });
  };

  render() {
    if (this.props.data.length <= 1) return null;
    return (
      <Container style={{ marginTop: '2em' }}>
        <Table fixed singleLine basic="very">
          <Table.Header>
            <Table.Row>{this.createHeader(this.props.data)}</Table.Row>
          </Table.Header>
          <Table.Body>{this.createRows(this.props.data, this.n)}</Table.Body>
        </Table>
        {this.props.data.length > this.n ? (
          <Header align="center">
            {this.props.data.length - 1 - this.n} more rows
          </Header>
        ) : null}
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return { data: state.uploadDocuments };
};

export default connect(mapStateToProps, {})(PreviewTable);
