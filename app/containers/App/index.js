/*
 *
 * App
 *
 */

import React, {Component} from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from 'containers/Home';
import Discover from 'containers/Discover';
import Ask from 'containers/Ask';
import Replies from 'containers/Replies';
import Detail from 'containers/Detail';
import Teams from 'containers/Teams';
import Team from 'containers/Team';
import NotFound from 'containers/NotFound';

import Snackbar from 'material-ui/Snackbar';
import Dialog from 'material-ui/Dialog';
import Tabs, { Tab } from 'material-ui/Tabs';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/Button';

import './style.css';
import './styleM.css';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      token:localStorage.getItem('token'),
      user:JSON.parse(localStorage.getItem('user')),
      snack: false,
      msg: "",
      email:"",
      username:"",
      password:"",
      authOpen:false,
      profileOpen:false,
      activeTab:0,
    };
  }

  handleRequestClose = () => { this.setState({ snack: false, msg: "" }) };
  showSnack = (msg) => { this.setState({ snack: true, msg: msg }) };

  handleUsername = (event) => {this.setState({username:event.target.value})}
  handleEmail = (event) => {this.setState({email:event.target.value})}
  handlePassword = (event) => {this.setState({password:event.target.value})}

  handleProfileName = (event) => {
    let profile = this.state.profile;
    profile.profileName = event.target.value;
    this.setState({profile:profile})
  }

  handleAvatar = (event) => {
    event.preventDefault();
    let profile = this.state.profile;
    let reader = new FileReader();
    let file = event.target.files[0];

    reader.onloadend = () => {
      profile.avatar = reader.result;
      this.setState({
        avatar: file,
        profile:profile
      }, function() {
        this.updateProfile();
        this.forceUpdate();
      })
    }
    reader.readAsDataURL(file);
  }

  handleAuth = () => { this.setState({authOpen:!this.state.authOpen})}
  handleTab = (event, value) => { this.setState({activeTab:value})}

  signIn = () => {
    let _this = this;
    let data = new FormData();
    data.append('email', this.state.email);
    data.append('password', this.state.password);

    fetch('http://challenges.innovationmesh.com/api/signIn', {
      method:'POST',
      body:data
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      if(json.error)
      {
        _this.showSnack(json.error);
      }
      else if(json.token)
      {
        localStorage.setItem('token', json.token);
        this.setState({
          token:json.token
        })
        fetch('http://challenges.innovationmesh.com/api/getUser', {
          method:'GET',
          headers: {'Authorization' : 'Bearer ' + json.token}
        })
        .then(function(response) {
          return response.json();
        })
        .then(function(json) {
          localStorage.setItem('user', JSON.stringify(json.user));
          _this.setState({
            user:json.user
          })
          _this.showSnack("Welcome " + json.user.profileName);
          _this.handleAuth();
        })
      }
    }.bind(this));
  };

  signUp = () => {
    let _this = this;
    let data = new FormData();
    data.append('email', this.state.email);
    data.append('name', this.state.username);
    data.append('password', this.state.password);

    fetch('http://challenges.innovationmesh.com/api/signUp', {
      method:'POST',
      body:data
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      if(json.error)
      {
        _this.showSnack(json.error);
      }
      else if(json.success)
      {
        _this.signIn();
      }
    }.bind(this));
  };

  signOut = (redirect = 0, msg) => {
    let _this = this;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.showSnack(msg);
    this.setState({
      token:"",
      user:"",
    }, function() {
      if(redirect === 1) {
        setTimeout(function(){_this.context.router.history.push('/')}, 2000);
      }
    })
  };

  getProfile = (id = 0) => {
    if(id === 0) {
      this.setState({profileOpen:!this.state.profileOpen})
    }
    else {
      fetch('http://challenges.innovationmesh.com/api/getProfile/' + id, {
        method:'GET'
      })
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        this.setState({
          profile:json.profile
        }, function() {
          this.setState({profileOpen:!this.state.profileOpen})
        })
      }.bind(this))
    }
  }

  updateProfile = () => {
    let _this = this;
    let data = new FormData();

    data.append('profileName', this.state.profile.profileName);
    data.append('avatar', this.state.avatar);

    fetch("http://challenges.innovationmesh.com/api/updateProfile", {
      method:'POST',
      body:'data',
      headers: {'Authorization':'Bearer ' + this.state.token}
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      if(json.error) {
        if(json.error === 'token_expired') {
          _this.signOut(0, 'Your session has expired.');
          _this.handleAuth();
        } else {
          _this.showSnack(json.error);
        }
      }
      else if(json.success){
        _this.showSnack(json.success);
      }
    })
  }

  renderProfileButtons = () => {
    if(this.state.user && this.state.profile) {
      if(this.state.profile.userID === this.state.user.id)
      {
        return(
          <div className="profileDialogButtons">
            <FlatButton onClick={() => this.signOut(1, 'Good-Bye')} style={{background:'#b63232', color:'#FFFFFF', width:'100%', marginBottom:'10px'}}>Sign Out</FlatButton>
          </div>
        )
      }
    }
  }

  render() {
    return (
      <div>
        <Switch>
          <Route exact path='/' render={() => <Home app={this}/> } />
          <Route path='/Discover' render={() => <Discover app={this}/> } />
          <Route path='/Discover/:id' render={(props) => <Discover {...props} app={this}/> } />
          <Route path='/Challenge/:id' render={(props) => <Detail {...props} app={this}/> } />
          <Route path='/Ask/:id' render={(props) => <Replies {...props} app={this}/> } />
          <Route path='/Ask' render={() => <Ask app={this}/> } />
          <Route path='/Teams' render={() => <Teams app={this}/> } />
          <Route path='/Team/:id' render={(props) => <Team {...props} app={this}/> } />
          <Route path='*' render={() => <NotFound />}/>
        </Switch>
        <Dialog onRequestClose={this.handleAuth} open={this.state.authOpen}>
          <Tabs value={this.state.activeTab} onChange={this.handleTab} fullWidth style={{background:"#32b6b6", color:"#FFFFFF"}}>
            <Tab label="Sign In" />
            <Tab label="Sign Up" />
          </Tabs>
          {this.state.activeTab === 0 &&
            <div style={{padding:'30px'}}>
              <TextField label="E-mail" margin='normal'  fullWidth={true} onChange={this.handleEmail} value={this.state.email} />
              <TextField label="Password" margin='normal'  fullWidth={true} onChange={this.handlePassword} value={this.state.password} type="password"/>
              <FlatButton style={{marginTop:'15px', color:"#FFFFFF", background:"#32b6b6", width:"100%"}} onClick={this.signIn}>Sign In</FlatButton>
            </div>
          }
          {this.state.activeTab === 1 &&
            <div style={{padding:'30px'}}>
              <TextField label="Username" margin='normal'  fullWidth={true} onChange={this.handleUsername} value={this.state.username}/>
              <TextField label="E-Mail" margin='normal' fullWidth={true} onChange={this.handleEmail} value={this.state.email}/>
              <TextField label="Password" margin='normal'  fullWidth={true} onChange={this.handlePassword} value={this.state.password} type="password"/>
              <FlatButton style={{marginTop:'15px', color:"#FFFFFF", background:"#32b6b6", width:"100%"}} onClick={this.signUp}>Sign Up</FlatButton>
            </div>
          }
        </Dialog>

        <Dialog onRequestClose={() => this.getProfile(0)} open={this.state.profileOpen}>
          <div className="profileContainer">
            <div className="profileDialogAvatar">
              <img className="profileDialogAvatarImg" src={this.state.user.avatar}/>
            </div>
            <div className="profileDialogUser">@{this.state.user.name}</div>
            {this.renderProfileButtons()}
          </div>
        </Dialog>

        <Snackbar
          open={this.state.snack}
          message={this.state.msg}
          autoHideDuration={3000}
          onRequestClose={this.handleRequestClose}
        />
      </div>
    );
  }
};

App.contextTypes = {
  router: React.PropTypes.object
};
