import React from 'react';
import { connect } from 'react-redux';
import { Button, Container, Dropdown } from 'semantic-ui-react';
import { selectAmcatIndex, setAmcatIndices, uploadDocuments } from '../actions';

import SelectionTable from './SelectionTable';
import CreateAmcatIndex from './CreateAmcatIndex';

const tableColumns = [
  {
    Header: 'Project',
    accessor: 'name',
    headerClass: 'thirteen wide',
  },
  {
    Header: 'Role',
    accessor: 'role',
    headerClass: 'five wide',
  },
];

class AmcatIndexSelector extends React.Component {
  constructor(props) {
    super(props);
    this.type = this.props.type ? this.props.type : 'table';
    this.state = {
      selectedAmcatIndex: this.props.amcatIndex,
    };
  }

  componentDidMount() {
    this.props.amcat.getIndices().then((res) => {
      this.props.setAmcatIndices(res.data);
    });
  }

  renderTable() {
    return (
      <Container>
        <Button.Group widths="2">
          <CreateAmcatIndex />
        </Button.Group>
        <SelectionTable
          columns={tableColumns}
          data={this.props.amcatIndices ? this.props.amcatIndices : []}
          selectedRow={this.state.selectedAmcatIndex}
          setSelectedRow={(index) => {
            this.props.selectAmcatIndex(index);
            this.props.uploadDocuments([]);
          }}
          defaultSize={10}
          downloadArticleSet={false}
        />
      </Container>
    );
  }

  renderDropDownItems = (indices) => {
    return indices.map((index) => {
      return { key: index.name, text: index.name, value: index.name };
    });
  };

  onDropdownSelect = (value) => {
    if (value && this.props.amcatIndices !== null) {
      const i = this.props.amcatIndices.findIndex((row) => row.name === value);

      this.props.selectAmcatIndex({
        ...this.props.amcatIndices[i],
        ROW_ID: i.toString(),
      });
    } else this.props.selectAmcatIndex(null);
  };

  renderDropDown() {
    return (
      <React.Fragment>
        <div className="ui content" style={{ marginTop: '5px' }}>
          <h4 style={{ marginBottom: '10px' }}>
            {this.props.amcatIndex ? 'Current Project: ' : 'Select Project'}
          </h4>
        </div>
        <Dropdown
          search
          fluid
          button
          floating
          options={this.renderDropDownItems(this.props.amcatIndices)}
          value={this.props.amcatIndex ? this.props.amcatIndex.name : null}
          onChange={(e, d) => this.onDropdownSelect(d.value)}
        />
      </React.Fragment>
    );
  }

  render() {
    switch (this.type) {
      case 'table':
        return this.renderTable();
      case 'dropdown':
        return this.renderDropDown();
      default:
        return null;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    amcat: state.amcat,
    amcatIndex: state.amcatIndex,
    amcatIndices: state.amcatIndices,
  };
};

export default connect(mapStateToProps, {
  selectAmcatIndex,
  setAmcatIndices,
  uploadDocuments,
})(AmcatIndexSelector);
