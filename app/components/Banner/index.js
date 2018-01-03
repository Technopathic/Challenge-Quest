/**
*
* Banner
*
*/

import React from 'react';

import './style.css';
import './styleM.css';

import FlatButton from 'material-ui/Button';

export default class Banner extends React.PureComponent {
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

  renderJoinButton = () => {
    if(!this.state.app.state.token)
    {
      return(
        <FlatButton style={{background:'#32b6b6', color:'#FFFFFF', width:'100%', maxWidth:'200px'}} onClick={this.props.app.handleAuth}>Sign Up</FlatButton>
      )
    }
  }
  render() {
    return (
      <div className="bannerContainer">
        <div className="bannerWrapper">
          <div className="bannerInfo">
            <div className="bannerTitle">Discover your next favorite project.</div>
            <div className="bannerContent">
              Challenge Quest focuses on the best new challenges, every day. It is a place for impact-loving enthusiasts to innovate and make a difference in their local or global ecosystems.
            </div>
            {this.renderJoinButton()}
          </div>
          <div className="bannerGraphic">
            <img className="bannerImg" src="http://challenges.innovationmesh.com/assets/bunlogo.png"/>
          </div>
        </div>
      </div>
    );
  }
}

Banner.contextTypes = {
  router: React.PropTypes.object
};
