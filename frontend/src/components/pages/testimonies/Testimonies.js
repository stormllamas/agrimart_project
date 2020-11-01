import React, { Fragment, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import Moment from 'react-moment';

import Pagination from '../../common/Pagination';

import { getArticles, updateQuery, setPage } from '../../../actions/pages';

const Testimonies = ({
  articles: { articles, articlesLoading, currentPage },
  getArticles, updateQuery
}) => {
  const history = useHistory()

  const [keywords, setKeywords] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const query = new URLSearchParams(history.location.search);
    const pageQuery = query.get('page')

    if (pageQuery) {
      setPage(pageQuery)
    } else {
      setPage(1)
    }
    getArticles({ page });
  // eslint-disable-next-line
  }, [page])

  useEffect(() => {
    if (!articlesLoading) {
      $('.carousel-slider').carousel({
        fullWidth: true,
        indicators: true,
        swipeable: true
      });
    }
  // eslint-disable-next-line
  }, [articlesLoading])

  
  return (
    <Fragment>
      <section className="section-testimonies">
          {!articlesLoading && (
            <Fragment>
              <div className="row">
                <div className="col s12 p-0">
                  {articles.highlights.length < 1 ? (
                    <h2 className="text-mute no-item-default">No news yet. Stay tuned!</h2>
                  ): (
                    <div className="carousel carousel-slider">
                      {articles.highlights.map((article, index) => (
                        index < 4 && (
                          <div key={article.id} className="carousel-item white-text" style={{ 
                            backgroundImage: `url('${article.thumbnail}')`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center center',
                            backgroundSize: 'cover'
                          }}>
                            <div className="row m-0 primary-overlay dim-1" style={{ height: 'unset' }}>
                              <div className="col s12">
                                <h6 className="mt-2 mb-0 mb-2 fs-20 fw-6">{article.title}<span className="fs-16 fw-1 hide-on-small-only mb-2 pr-4"> - {article.summary.slice(0, 120)}...</span></h6>
                              </div>
                            </div>
                            <div className="carousel-fixed-item center">
                              <Link to={`/read?a=${article.id}`} className="btn teal darken-1 waves-effect">Read More</Link>
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="container">
                <div className="row">
                  {/* <div className="col s12 m6">
                    <div className="card-title">
                      <h4 className="m-0">Articles</h4>
                    </div>
                  </div> */}
                  <div className="col s12">
                    {articles.count > 5 && <Pagination data={articles} setPage={setPage} pageSize={10} currentPage={page} updateQuery={updateQuery}/> }
                  </div>
                </div>
                <div className="row flex">
                  {articles.results.map((article, index) => (
                    <div key={article.id} className="col s12 m6">
                      <div className="card">
                        <div id="main-article">
                          <div className="card-image">
                            <Link to={`/read?a=${article.id}`}>
                              <img src={article.thumbnail} alt=""/>
                            </Link>
                            {/* <div className="main-article-img" style={{background: `url('${ article.thumbnail }') no-repeat center center/cover` }}>
                            </div> */}
                          </div>
                          <div className="card-stacked">
                            <div className="card-content">
                              <div className="card-title">
                                <h6 className="fw-6 fs-18 m-0 truncate"><Link to={`/read?a=${article.id}`}>{article.title}</Link></h6>
                                <p className="fs-14 lh-6"><Moment format='MMMM Do, YYYY'>{article.date_published}</Moment></p>
                              </div>
                              <p>{article.summary.slice(0, 135)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Fragment>
          )}
      </section>
    </Fragment>
  )
}

Testimonies.propTypes = {
  getArticles: PropTypes.func.isRequired,
  updateQuery: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  articles: state.articles,
});

export default connect(mapStateToProps, { getArticles, updateQuery, setPage })(Testimonies);
