/*
 *
 * Challenges
 *
 */

import React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

import Header from 'components/Header';
import SideNav from 'components/SideNav';
import RightBar from 'components/RightBar';

import TextField from 'material-ui/TextField';

import Waypoint from 'react-waypoint';

import './style.css';
import './styleM.css';

export default class Ask extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      questions:[],
      nextPage:1,
      currentPage:0,
      lastPage:1,
      searchContent:"",
      app:this.props.app
    }
  }

  componentWillMount() {
    //this.getQuestions();
  }

  componentWillReceiveProps(app) {
    this.setState({
      app:app.app
    }, function() {
      this.forceUpdate();
    })
  }

  handleSearch = (event) => {
    this.setState({
      searchContent:event.target.value
    }, function() {
      if(this.state.searchContent.length >= 3) {
        this.search();
      }
    })
  }

  getQuestions = () => {
    var nextPage = this.state.nextPage;
    var questions = this.state.questions;
    if(this.state.currentPage !== this.state.lastPage)
    {
      fetch("http://challenges.innovationmesh.com/api/getQuestions/30?page=" + this.state.nextPage, {
        method:'GET',
      })
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        if(json.questions.current_page !== json.questions.last_page)
        {
           nextPage = nextPage + 1;
        }
        for(var i = 0; i < json.questions.data.length; i++)
        {
          questions.push(json.questions.data[i]);
        }
        this.setState({
          nextPage: nextPage,
          lastPage: json.questions.last_page,
          currentPage: json.questions.current_page,
          questions: questions,
        })
      }.bind(this))
    }
  }

  search = () => {
    let _this = this;
    let data = new FormData();

    data.append('searchContent', this.state.searchContent);

    fetch("http://challenges.innovationmesh.com/api/searchQuestions", {
      method:'POST',
      body:data
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      this.setState({
        nextPage:1,
        currentPage:0,
        lastPage:1,
        questions: json.questions,
      })
    }.bind(this))
  }

  renderWaypoint = () => {
    if(this.state.searchContent < 3)
    {
      return(
        <Waypoint onEnter={this.getQuestions} />
      )
    }
  }

  render() {
    return (
      <div className="container">
        <Helmet title="Discover" meta={[ { name: 'description', content: 'Description of Discover' }]}/>

        <header>
          <Header app={this.state.app}/>
        </header>

        <main className="mainContainer">

          <div className="contentContainer">
            <div className="categoryContainer">
              <SideNav app={this.state.app}/>
            </div>
            <div className="challengeFeed">
              <TextField value={this.state.searchContent} onChange={this.handleSearch} fullWidth placeholder="Search For Questions" style={{marginBottom:'15px'}}/>
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
                  {this.renderWaypoint()}
                </div>
              </div>
            </div>
            <div className="sideBar">
              <RightBar app={this.state.app}/>
            </div>
          </div>

        </main>

        <footer>

        </footer>
      </div>
    );
  }
}

Ask.contextTypes = {
  router: React.PropTypes.object
};
