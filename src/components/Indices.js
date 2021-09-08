import React from 'react';
import { connect } from 'react-redux';
import history from '../history';

import CreateDocument from './CreateDocument';
import AmcatIndexDetails from './AmcatIndexDetails';
import DeleteAmcatIndex from './DeleteAmcatIndex';
import AmcatIndexSelector from './AmcatIndexSelector';
import UploadDocuments from './UploadDocuments';

import { Grid, Menu, Segment, Button } from 'semantic-ui-react';

class Indices extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: 'Project Details',
    };
  }

  renderSwitch(activeItem) {
    switch (activeItem) {
      case 'Project Details':
        return <AmcatIndexDetails />;
      case 'Upload Documents':
        return <UploadDocuments />;
      case 'Create New Document':
        return <CreateDocument />;
      default:
        return null;
    }
  }

  render() {
    return (
      <Grid stackable style={{ marginTop: '3em' }}>
        <Grid.Column floated="left" width={5}>
          <AmcatIndexSelector type="table" />
        </Grid.Column>
        <Grid.Column width={11}>
          <Button.Group widths="2">
            <Button
              primary
              disabled={!this.props.amcatIndex}
              onClick={(e, d) => history.push('/query')}
            >
              Query Documents
            </Button>
          </Button.Group>

          <Button.Group className="red" widths="2" style={{ marginTop: '5px' }}>
            <DeleteAmcatIndex amcatIndex={this.props.amcatIndex} />
          </Button.Group>
          <Segment style={{ border: 0 }}>
            <Menu pointing secondary>
              <Menu.Item
                name="Project Details"
                active={this.state.activeItem === 'details'}
                onClick={(e, d) =>
                  this.setState({
                    activeItem: d.name,
                  })
                }
              />
              <Menu.Item
                name="Upload Documents"
                active={this.state.activeItem === 'upload'}
                onClick={(e, d) =>
                  this.setState({
                    activeItem: d.name,
                  })
                }
              />
              <Menu.Item
                name="Create New Document"
                active={this.state.activeItem === 'create'}
                onClick={(e, d) =>
                  this.setState({
                    activeItem: d.name,
                  })
                }
              />
            </Menu>
            {this.renderSwitch(this.state.activeItem)}
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    amcatIndex: state.amcatIndex,
  };
};

export default connect(mapStateToProps, {})(Indices);
