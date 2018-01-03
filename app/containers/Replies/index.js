/*
 *
 * Replies
 *
 */

import React from 'react';
import Helmet from 'react-helmet';

import Snackbar from 'material-ui/Snackbar';
import FlatButton from 'material-ui/Button';
import Drawer from 'material-ui/Drawer';
import {EditorState, ContentState, convertFromHTML, convertToRaw} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import CommentIcon from 'react-icons/lib/fa/mail-reply';

import Waypoint from 'react-waypoint';

import Header from 'components/Header';

import './style.css';
import './styleM.css';

export default class Replies extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      snack: false,
      msg: "",
      replyOpen:false,
      replyContent:EditorState.createEmpty(),
      question:"",
      replies:[],
      nextPage:1,
      currentPage:0,
      lastPage:1,
      app:this.props.app
    }
  }

  handleRequestClose = () => { this.setState({ snack: false, msg: "" }); };
  showSnack = (msg) => { this.setState({ snack: true, msg: msg }); };

  replyDrawer = () => { this.setState({ replyOpen:!this.state.replyOpen })}

  handleReplyContent = (editorState) => {this.setState({replyContent: editorState, editorState: editorState})};

  componentWillMount() {
    this.getQuestion();
  }

  componentWillReceiveProps(app) {
    this.setState({
      app:app.app
    }, function() {
      this.forceUpdate();
    })
  }

  getQuestion = () => {
    fetch("http://challenges.innovationmesh.com/api/showQuestion/" + this.props.match.params.id, {
      method:'GET'
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      this.setState({
        question:json.question
      })
    }.bind(this))
  }

  getReplies = () => {
    var nextPage = this.state.nextPage;
    var replies = this.state.replies;
    if(this.state.currentPage !== this.state.lastPage)
    {
      fetch("http://challenges.innovationmesh.com/api/getReplies/" + this.props.match.params.id + '?page=' + this.state.nextPage, {
        method:'GET'
      })
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        if(json.replies.current_page !== json.replies.last_page)
        {
           nextPage = nextPage + 1;
        }
        for(var i = 0; i < json.replies.data.length; i++)
        {
          replies.push(json.replies.data[i]);
        }
        this.setState({
          nextPage: nextPage,
          lastPage: json.replies.last_page,
          currentPage: json.replies.current_page,
          replies: replies,
        })
      }.bind(this))
    }
  }

  storeReply = () => {
    let _this = this;
    let data = new FormData();

    data.append('questionID', this.state.question.id);
    data.append('replyContent', draftToHtml(convertToRaw(this.state.replyContent.getCurrentContent())));

    fetch("http://challenges.innovationmesh.com/api/storeReply/", {
      method:'POST',
      body:data,
      headers:{'Authorization':'Bearer ' + this.state.app.state.token}
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      if(json.error) {
        if(json.error === 'token_expired' || json.error === 'token_not_provided') {
          _this.props.app.signOut(0, 'Your session has expired.');
          _this.props.app.handleAuth();
        } else {
          _this.showSnack(json.error);
        }
      }
      else if(json.success) {
        _this.showSnack(json.success);
        _this.replyDrawer();
      }
    }.bind(this))
  }

  renderQuestionReply = () => {
    if(this.state.app.state.token) {
      return(
        <div className="questionTopicButton" onClick={() => this.replyDrawer()}>Reply <CommentIcon style={{marginLeft:'5px'}}/></div>
      )
    } else {
      <div className="questionTopicButton" onClick={() => this.props.app.handleAuth()}>Reply <CommentIcon style={{marginLeft:'5px'}}/></div>
    }
  }


  render() {
    return (
      <div className="container">
        <Helmet title="Replies" meta={[ { name: 'description', content: 'Description of Replies' }]}/>
        <header>
          <Header app={this.state.app}/>
        </header>

        <main>
          <div className="questionTopicContainer">
            <div className="questionTopic">
              <div className="questionTopicAvatar">
                <div style={{maxHeight:'120px', overflow:'hidden', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                  <img className="questionTopicAvatarImg" src={this.state.question.avatar}/>
                </div>
                <div className="questionName">{this.state.question.profileName}</div>
              </div>
              <div className="questionTopicInfo">
                <div className="feedTitle"> {this.state.question.questionTitle} </div>
                <div className="feedContent" dangerouslySetInnerHTML={{ __html: this.state.question.questionContent }}/>
                <div className="questionTopicStats">
                  <div className="detailTopicButtons">
                    {this.renderQuestionReply()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mainContainer">
            <div className="detailReplyContainer">
              {this.state.replies.map((reply, i) => (
                <div className="replyBlockContainer" key={i}>
                  <div className="replyBlock">
                    <div className="replyAvatar">
                      <img className="replyAvatarImg" src={reply.avatar}/>
                    </div>
                    <div className="replyInfo">
                      <div className="replyTop">
                        <div className="replyTopInfo">
                          <span className="replyName">{reply.profileName}</span>
                          <span className="replyDate">{reply.replyDate}</span>
                        </div>
                      </div>
                      <div className="replyContent" dangerouslySetInnerHTML={{ __html: reply.replyContent }} />
                    </div>
                  </div>
                </div>
              ))}
              <Waypoint onEnter={this.getReplies}/>
            </div>
          </div>
        </main>
        <footer>
          <Drawer anchor="bottom" open={this.state.replyOpen} onRequestClose={this.replyDrawer}>
            <div className="drawerContainer">
              <div className="replyEditor">
                <Editor
                  editorState={this.state.replyContent}
                  toolbarClassName="home-toolbar"
                  wrapperClassName="home-wrapper"
                  editorClassName="rdw-editor-main"
                  onEditorStateChange={this.handleReplyContent}
                  placeholder="Type your Reply Here..."
                  toolbar={{
                    inline: { inDropdown: true },
                    fontSize:{ className: "toolbarHidden",},
                    fontFamily:{className: "toolbarHidden",},
                    list: { inDropdown: true, options: ['unordered', 'ordered'] },
                    textAlign: { inDropdown: true,  options: ['left', 'center', 'right'] },
                    link: { inDropdown: true },
                    remove:{className: "toolbarHidden",},
                    emoji: {className: "toolbarHidden",},
                    history: {className: "toolbarHidden",},
                  }}
                />
                </div>
                <div className="replyDrawerOptions">
                  <FlatButton style={{width:"100%", maxWidth:'75%', backgroundColor:"#32b6b6", color:"#FFFFFF"}} onClick={this.storeReply}>Submit Reply</FlatButton>
                  <FlatButton style={{width:"100%", maxWidth:'50%', marginTop:'20px', color:"#FFFFFF", backgroundColor:"#CCCCCC"}} onClick={this.replyDrawer}>Close</FlatButton>
                </div>
              </div>
          </Drawer>
        </footer>
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

Replies.contextTypes = {
  router: React.PropTypes.object
};
