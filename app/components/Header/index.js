/**
*
* Header
*
*/

import React from 'react';
import { Link } from 'react-router-dom';

import './style.css';
import './styleM.css';

export default class Header extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      app:this.props.app
    }
  }

  componentWillReceiveProps(app) {
    this.setState({
      app:app.app
    }, function() {
      this.forceUpdate();
    })
  }


  renderAuthMenu = () => {
    if(this.props.app.state.user)
    {
      return(
        <div style={{display:'flex'}}>
          <div className="navButton" onClick={() => this.props.app.getProfile(this.props.app.state.user.id)}><img src={this.props.app.state.user.avatar} className="userAvatarNavbar"/> {this.props.app.state.user.profileName}</div>
        </div>
      )
    } else {
      return(
        <div className="navButton" onClick={this.props.app.handleAuth}>Sign In</div>
      )
    }
  }

  render() {
    return (
      <div className="header">
        <div className="headerContainer">
          <div className="headerTitle">
            Mesh Challenges
          </div>
          <div className="headerNav">
            <Link to="/" className="navButton">Home</Link>
            <Link to="/Discover" className="navButton">Discover</Link>
            <Link to="/Ask" className="navButton">Ask</Link>
            <Link to="/Teams" className="navButton">Teams</Link>
            <div className="navSeparator"></div>
            {this.renderAuthMenu()}
          </div>
        </div>
      </div>
    );
  }
}

Header.contextTypes = {
  router: React.PropTypes.object
};
