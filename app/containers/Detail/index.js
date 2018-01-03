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

import './style.css';
import './styleM.css';

export default class Detail extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      challenge:"",
      categories:[],
      uploads:[],
      teams:[],
      participant:false,
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
    fetch("http://challenges.innovationmesh.com/api/showChallenge/"+this.props.match.params.id, {
      method:'GET'
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      this.setState({
        challenge:json.challenge,
        categories:json.challenge.categories,
        uploads:json.uploads,
        teams:json.teams,
        participant:json.participant
      })
    }.bind(this))
  }

  joinChallenge = () => {
    fetch("http://challenges.innovationmesh.com/api/joinChallenge/" + this.state.challenge.id, {
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
        <FlatButton onClick={this.joinChallenge} style={{background:'#32b6b6', color:'#FFFFFF', marginBottom:'15px', width:'100%'}}>Join Challenge</FlatButton>
      )
    }
    else {
      <FlatButton onClick={this.props.app.handleAuth} style={{background:'#32b6b6', color:'#FFFFFF', marginBottom:'15px', width:'100%'}}>Join Challenge</FlatButton>
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
                  <img className="detailAvatar" src={this.state.challenge.avatar}/>
                </div>
                <div className="detailInfo">
                  <div className="detailTitle">{this.state.challenge.challengeTitle}</div>

                  <div className="feedTags">
                    {this.state.categories.map((c, j) => (
                      <div className="tagBlock" key={j}>{c.categoryName}</div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="detailImageContainer">
                <img className="detailImage" src={this.state.challenge.challengeImage} />
              </div>
              <div className="detailContent" dangerouslySetInnerHTML={{ __html: this.state.challenge.challengeContent }} />
            </div>
            <div className="detailColumnTwo">
              {this.renderJoinButton()}
              <div className="detailSideBlock">
                <div className="categoryTitle">Uploads</div>
                {this.state.uploads.map((u, i) => (
                  <Link to={u.filePath} className="uploadBlock">{u.fileName}</Link>
                ))}
              </div>
              <div className="detailSideBlock">
                <div className="categoryTitle">Participants</div>
                {this.state.teams.map((t, i) => (
                  <div className="participantBlock">
                    <img className="participantImage" src={t.teamImage}/>
                    <div className="participantName">{t.teamName}</div>
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

Detail.contextTypes = {
  router: React.PropTypes.object
};
