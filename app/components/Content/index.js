/**
*
* Content
*
*/

import React from 'react';
import { Link } from 'react-router-dom';

import './style.css';
import './styleM.css';

export default class Content extends React.PureComponent {
  render() {
    return (
      <div className="feedContainer">
        <div className="feedHeader">Challenges</div>
        <div className="feedList">
          {this.props.data.map((u, i) => (
            <Link to={'/challenge/' + u.challengeSlug} className="feedBlock" key={i}>
              <img className="feedImage" src={u.challengeImage}/>
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
        </div>
      </div>
    );
  }
}

Content.contextTypes = {
  router: React.PropTypes.object
};
