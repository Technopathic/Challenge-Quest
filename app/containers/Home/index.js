/*
 *
 * Home
 *
 */

import React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

import FlatButton from 'material-ui/Button';

import Header from 'components/Header';
import Banner from 'components/Banner';
import SideNav from 'components/SideNav';
import RightBar from 'components/RightBar';
import Content from 'components/Content';

import './style.css';
import './styleM.css';

export default class Home extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      challenges:[],
      questions:[],
      teams:[],
      app:this.props.app
    }
  }

  componentWillMount() {
    this.getChallenges();
    this.getQuestions();
    this.getTeams();
  }

  componentWillReceiveProps(app) {
    this.setState({
      app:app.app
    }, function() {
      this.forceUpdate();
    })
  }

  getChallenges = () => {
    fetch("http://challenges.innovationmesh.com/api/getChallenges/5", {
      method:'GET',
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      this.setState({
        challenges:json.challenges.data
      })
    }.bind(this))
  }

  getQuestions = () => {
    fetch("http://challenges.innovationmesh.com/api/getQuestions/5", {
      method:'GET',
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      this.setState({
        questions:json.questions.data
      })
    }.bind(this))
  }

  getTeams = () => {
    fetch("http://challenges.innovationmesh.com/api/getTeams/5", {
      method:'GET',
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      this.setState({
        teams:json.teams.data
      })
    }.bind(this))
  }

  render() {
    return (
      <div className="container">
        <Helmet title="Home" meta={[ { name: 'description', content: 'Description of Home' }]}/>

        <header>
          <Header app={this.state.app}/>
        </header>

        <main className="mainContainer">
          <Banner app={this.state.app}/>

          <div className="contentContainer">
            <div className="categoryContainer">
              <SideNav app={this.state.app}/>
            </div>
            <div className="challengeFeed">
              <Content data={this.state.challenges} title="Challenges"/>

              <div className="feedContainer">
                <div className="feedHeader">Questions</div>
                <div className="questionContainer">
                  {this.state.questions.map((q, i) => (
                    <Link to={'/Ask/' + q.questionSlug} className="questionBlock" key={i}>
                      <div className="questionHeader">
                        <div className="questionAvatar">
                          <img className="questionAvatarImg" src={q.avatar} />
                        </div>
                        <div className="questionName">{q.profileName}</div>
                        <div className="questionWho">{q.profileTitle}</div>
                      </div>
                      <div className="feedInfo">
                        <div className="feedTitle">{q.questionTitle}</div>
                        <div className="feedContent" dangerouslySetInnerHTML={{ __html: q.questionContent }} />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="feedContainer">
                <div className="feedHeader">Teams</div>
                {this.state.teams.map((t, i) => (
                  <Link to={'/team/' + t.id} className="feedBlock" key={i}>
                    <div className="feedImageContainer">
                      <img className="feedImage" src={t.teamImage}/>
                    </div>
                    <div className="feedInfo">
                      <div className="feedTitle">{t.teamName}</div>
                      <div className="feedContent" dangerouslySetInnerHTML={{ __html: t.teamContent }} />
                      {t.members.map((m, j) => (
                        <img className="memberAvatar" key={j} src={m.avatar}/>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>

            </div>
            <div className="sideBar">
              <RightBar app={this.state.app}/>
            </div>
          </div>
        </main>

        <footer></footer>

      </div>
    );
  }
}

Home.contextTypes = {
  router: React.PropTypes.object
};
