import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  PageHeader,
  ListGroup,
  ListGroupItem,
} from 'react-bootstrap';
import './Home.css';
import { invokeApig } from '../libs/awsLib';

class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      grants: [],
    };
  }

  async componentDidMount() {
  if (this.props.userToken === null) {
    return;
  }

  this.setState({ isLoading: true });

  try {
    const results = await this.grants();
    this.setState({ grants: results });
  }
  catch(e) {
    alert(e);
  }

  this.setState({ isLoading: false });
}

grants() {
  return invokeApig({ path: '/grants' }, this.props.userToken);
}

  renderGrantsList(grants) {
  return [{}].concat(grants).map((grant, i) => (
    i !== 0
      ? ( <ListGroupItem
            key={grant.grantId}
            href={`/grants/${grant.grantId}`}
            onClick={this.handleGrantClick}
            header={grant.content.trim().split('\n')[0]}>
              { "Created: " + (new Date(grant.createdAt)).toLocaleString() }
          </ListGroupItem> )
      : ( <ListGroupItem
            key="new"
            href="/grants/new"
            onClick={this.handleGrantClick}>
              <h4><b>{'\uFF0B'}</b> Create a new grant</h4>
          </ListGroupItem> )
  ));
}

handleGrantClick = (event) => {
  event.preventDefault();
  this.props.history.push(event.currentTarget.getAttribute('href'));
}

  renderLander() {
    return (
      <div className="lander">
        <h1>Grant Calculator</h1>
        <p>A simple grant calculator app</p>
      </div>
    );
  }

  renderGrants() {
    return (
      <div className="grants">
        <PageHeader>Your Grants</PageHeader>
        <ListGroup>
          { ! this.state.isLoading
            && this.renderGrantsList(this.state.grants) }
        </ListGroup>
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        { this.props.userToken === null
          ? this.renderLander()
          : this.renderGrants() }
      </div>
    );
  }
}

export default withRouter(Home);