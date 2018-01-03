/*
 *
 * Challenges
 *
 */

import React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

import Header from 'components/Header';
import Banner from 'components/Banner';
import SideNav from 'components/SideNav';
import RightBar from 'components/RightBar';

import TextField from 'material-ui/TextField';

import Waypoint from 'react-waypoint';

import './style.css';
import './styleM.css';

export default class Discover extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      challenges:[],
      nextPage:1,
      currentPage:0,
      lastPage:1,
      searchContent:"",
      app:this.props.app
    }
  }

  componentWillMount() {
    //this.getChallenges();
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

  getChallenges = () => {
    var nextPage = this.state.nextPage;
    var challenges = this.state.challenges;

    if(this.state.currentPage !== this.state.lastPage)
    {
      fetch("http://challenges.innovationmesh.com/api/getChallenges/30?page="+this.state.nextPage , {
        method:'GET',
      })
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        if(json.challenges.current_page !== json.challenges.last_page)
        {
           nextPage = nextPage + 1;
        }
        for(var i = 0; i < json.challenges.data.length; i++)
        {
          challenges.push(json.challenges.data[i]);
        }
        this.setState({
          nextPage: nextPage,
          lastPage: json.challenges.last_page,
          currentPage: json.challenges.current_page,
          challenges: challenges,
        })
      }.bind(this))
    }
  }

  search = () => {
    let _this = this;
    let data = new FormData();

    data.append('searchContent', this.state.searchContent);

    fetch("http://challenges.innovationmesh.com/api/searchChallenges", {
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
        challenges: json.challenges,
      })
    }.bind(this))
  }

  renderWaypoint = () => {
    if(this.state.searchContent < 3)
    {
      return(
        <Waypoint onEnter={this.getChallenges} />
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
              <TextField value={this.state.searchContent} onChange={this.handleSearch} fullWidth placeholder="Search For Challenges" style={{marginBottom:'15px'}}/>
              <div className="feedContainer">
                <div className="feedHeader">Challenges</div>
                <div className="feedList">
                  {this.state.challenges.map((u, i) => (
                    <Link to={'/challenge/' + u.challengeSlug} className="feedBlock" key={i}>
                      <div className="feedImageContainer">
                        <img className="feedImage" src={u.challengeImage}/>
                      </div>
                      <div className="feedInfo">
                        <div className="feedTitle">{u.challengeTitle}</div>
                        <div className="feedContent" dangerouslySetInnerHTML={{ __html: u.challengeContent }} />
                        <div className="feedTags">
                          {u.categories.map((c, j) => (
                            <div className="tagBlock" key={j}>{c.categoryName}</div>
                          ))}
                        </div>
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

Discover.contextTypes = {
  router: React.PropTypes.object
};
