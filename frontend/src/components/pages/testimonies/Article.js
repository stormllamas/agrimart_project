import React, { useEffect, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import Moment from 'react-moment';
import PropTypes from 'prop-types'

import Preloader from '../../layout/Preloader';

import { connect } from 'react-redux';
import { getArticle } from '../../../actions/pages';

const Article = ({ auth: { userLoading }, articles: { article, error, articleLoading }, getArticle }) => {
  const history = useHistory()

  useEffect(() => {
    const query = new URLSearchParams(history.location.search);
    const articleQuery = query.get('a')
    getArticle(articleQuery);
  // eslint-disable-next-line
  }, [history.location.key]);
  
  return (
    <section className="section-article">
      <div className="container">
        {!articleLoading && (
          !error ? (
            <Fragment>
              <div className="row mt-2">
                <div className="col s12 m6">
                  <div className="row mb-1">
                    <div className="col s12">
                      <img src={ article.thumbnail } className="responsive-img"/>
                    </div>
                  </div>
                  <div className="row mb-0">
                    {article.photo_1 && (
                      <div className="col s2">
                        <a href={ article.photo_1 }>
                          <img src={ article.photo_1 } alt="" className="responsive-img"/>
                        </a>
                      </div>
                    )}
                    {article.photo_2 && (
                      <div className="col s2">
                        <a href={ article.photo_2 }>
                          <img src={ article.photo_2 } alt="" className="responsive-img"/>
                        </a>
                      </div>
                    )}
                    {article.photo_3 && (
                      <div className="col s2">
                        <a href={ article.photo_3 }>
                          <img src={ article.photo_3 } alt="" className="responsive-img"/>
                        </a>
                      </div>
                    )}
                    {article.photo_4 && (
                      <div className="col s2">
                        <a href={ article.photo_4 }>
                          <img src={ article.photo_4 } alt="" className="responsive-img"/>
                        </a>
                      </div>
                    )}
                    {article.photo_5 && (
                      <div className="col s2">
                        <a href={ article.photo_5 }>
                          <img src={ article.photo_5 } alt="" className="responsive-img"/>
                        </a>
                      </div>
                    )}
                    {article.photo_6 && (
                      <div className="col s2">
                        <a href={ article.photo_6 }>
                          <img src={ article.photo_6 } alt="" className="responsive-img"/>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col s12 m6">
                  <h4>{ article.title }</h4>
                  <p className="fs-18"><Moment format='MMMM Do YYYY'>{ article.date_published }</Moment> - { article.views } views </p>
                  {article.link && <a href={ article.link } className='btn-green text-center'>{article.custom_button ? article.custom_button : 'read more'}</a>}
                </div>
              </div>
              <div className="row">
                <div className="col s12">
                  <div className="article-thumbnail" style={{ background: `url('${ article.thumbnail }') no-repeat center center/cover` }} ></div>
                  <p className="linebreak">{ article.summary }</p>
                </div>
              </div>
            </Fragment>
          ) : (
            <div className="card container-short row">
              <div className="col-1">
              <div className="article-thumbnail col center middle">
                <h1 className="text-center no-item-default white">Article Not Found</h1>
              </div>
              <p></p>
              </div>
              <div className="col-2">
                <div className="article-details">
                  <h2></h2>
                  <p></p>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  )
}

Article.propTypes = {
  getArticle: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  articles: state.articles,
  auth: state.auth
});

export default connect(mapStateToProps, { getArticle })(Article);