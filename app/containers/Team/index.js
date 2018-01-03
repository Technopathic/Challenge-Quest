/*
 *
 * Detail
 *
 */

import React from 'react';
import Helmet from 'react-helmet';
import Header from 'components/Header';

import FlatButton from 'material-ui/Button';
import Snackbar from 'material-ui/Snackbar';

import Content from 'components/Content';

import './style.css';
import './styleM.css';

export default class Team extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      team:"",
      members:[],
      challenges:[],
      snack: false,
      msg: "",
      app:this.props.app
    }
  }

  handleRequestClose = () => { this.setState({ snack: false, msg: "" }); };
  showSnack = (msg) => { this.setState({ snack: true, msg: msg }); };

  componentWillMount() {
    this.getDetail();
  }

  componentWillReceiveProps(app) {
    this.setState({
      app:app.app
    }, function() {
      this.forceUpdate();
    })
  }

  getDetail = () => {
    fetch("http://challenges.innovationmesh.com/api/showTeam/"+this.props.match.params.id, {
      method:'GET'
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      this.setState({
        team:json.team,
        members:json.members
      })
    }.bind(this))
  }

  joinTeam = () => {
    fetch("http://challenges.innovationmesh.com/api/joinTeam/" + this.state.team.id, {
      method:'GET',
      headers: {'Authorization':'Bearer ' + this.state.app.state.token}
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      if(json.error) {
        _this.showSnack(json.error);
      }
      else {
        _this.showSnack(json.success);
      }
    })
  }

  renderJoinButton = () => {
    if(this.state.app.state.token)
    {
      return(
        <FlatButton onClick={this.joinTeam} style={{background:'#32b6b6', color:'#FFFFFF', marginBottom:'15px', width:'100%'}}>Join Team</FlatButton>
      )
    }
    else {
      <FlatButton onClick={this.props.app.handleAuth} style={{background:'#32b6b6', color:'#FFFFFF', marginBottom:'15px', width:'100%'}}>Join Team</FlatButton>
    }
  }

  render() {
    return (
      <div className="container">
        <Helmet title="Detail" meta={[ { name: 'description', content: 'Description of Detail' }]}/>

        <header>
          <Header app={this.state.app}/>
        </header>

        <main className="mainContainer">
          <div className="contentContainer">
            <div className="detailColumnOne">
              <div className="detailBlock">
                <div className="detailAvatarContainer">
                  <img className="detailAvatar" src={this.state.team.teamImage}/>
                </div>
                <div className="detailInfo" style={{justifyContent:'center'}}>
                  <div className="detailTitle">{this.state.team.teamName}</div>
                  <div className="tagBlock" style={{background:'#FFFFFF', border:'none'}}>{this.state.team.teamLocation}</div>
                </div>
              </div>
              <div className="detailContent" dangerouslySetInnerHTML={{ __html: this.state.team.teamContent }} />
              <div style={{width:'100%', marginTop:'15px'}}>
                <Content data={this.state.challenges}/>
              </div>
            </div>
            <div className="detailColumnTwo">
              {this.renderJoinButton()}
              <div className="detailSideBlock">
                <div className="categoryTitle">Members</div>
                {this.state.members.map((m, i) => (
                  <div className="participantBlock" key={i}>
                    <img className="participantImage" src={m.avatar} />
                    <div className="participantName">{m.profileName}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        <Snackbar
          open={this.state.snack}
          message={this.state.msg}
          autoHideDuration={3000}
          onRequestClose={this.handleRequestClose}
        />
      </div>
    );
  }
}

Team.contextTypes = {
  router: React.PropTypes.object
};
