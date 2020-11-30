import React, { Fragment, useEffect, useState } from 'react'
import { HashLink as Link } from 'react-router-hash-link';
import { Redirect, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

import Preloader from '../../components/common/Preloader'

import { getOrderItem, reviewProduct, reviewProductOrder } from '../../actions/logistics'


const ProductReview = ({
  auth: {
    isAuthenticated,
    user
  },
  logistics: {
    orderItemLoading,
    orderItem,
  },
  getOrderItem,
  reviewProduct, reviewProductOrder,
  match
}) => {
  const history = useHistory()

  const [rating, setRating] = useState(5);
  const [ratingSelected, setRatingSelected] = useState(false);
  const [comment, setComment] = useState('');

  const [orderRating, setOrderRating] = useState(5);
  const [orderRatingSelected, setOrderRatingSelected] = useState(false);
  const [orderComment, setOrderComment] = useState('');

  const checkRating = num => {
    if (rating >= num) {
      return 'active'
    } else {
      return ''
    }
  }

  const checkOrderRating = num => {
    if (orderRating >= num) {
      return 'active'
    } else {
      return ''
    }
  }

  const checkText = () => {
    if (rating === 5) {
      return 'Excellent!'
    } else if (rating === 4) {
      return 'Good!'
    } else if (rating === 3) {
      return 'Okay'
    } else if (rating === 2) {
      return 'Poor'
    } else if (rating === 1) {
      return 'Very Poor'
    }
  }

  const setTemporaryRating = num => {
    if (!ratingSelected) {
      setRating(num)
    }
  }

  const setOrderTemporaryRating = num => {
    if (!orderRatingSelected) {
      setOrderRating(num)
    }
  }

  const submitProductReview = e => {
    e.preventDefault();
    reviewProduct({
      order_item: orderItem.id,
      product_variant: orderItem.product_variant.id,
      userID: user.id,
      rating,
      comment,
      history
    })
  }

  const submitOrderReview = e => {
    e.preventDefault();
    reviewProductOrder({
      order: orderItem.order.id,
      userID: user.id,
      rating: orderRating,
      comment: orderComment,
      history
    })
  }

  useEffect(() => {
    isAuthenticated && (
      getOrderItem({
        orderItemID: match.params.order_item_id
      })
    )
  }, []);
  
  useEffect(() => {
    if (!orderItemLoading) {
      $('.loader').fadeOut();
      $('.middle-content').fadeIn();
      $('#comment').characterCounter();
    } else {
      $('.loader').show();
      $('.middle-content').hide();
    }
  }, [orderItemLoading]);

  return (
    isAuthenticated ? (
      !orderItemLoading && (
        <Fragment>
          {orderItem.is_delivered && orderItem.order.user.id === user.id ? (
            <section className="section section-product-review">
                <div className="container">
                  <div className="flex-row middle mb-3 mt-2">
                    <Link to="/orders" className="flex-row middle"><i className="material-icons blue-text mr-2 fs-30">arrow_back</i></Link>
                    <h5 className="m-0">Review a product</h5>
                  </div>
                  {!orderItem.is_reviewed ? (
                    <div className="card mb-2">
                      <ul className="collection no-shadow">
                        <li className="row collection-item">
                          <div className="col s12 p-0 flex-col center">
                            <div className="reviewed-product grey lighten-2 circle bg-cover" style={{ backgroundImage: `url(${orderItem.product.thumbnail})` }}></div>
                            <p className="fw-6 fs-18 mb-0 mt-1 grey-text text-darken-2">How was the {orderItem.product.name}?</p>
                            <p className="grey-text m-0">Order #{orderItem.order.ref_code}</p>
                          </div>
                        </li>
                        <li className="row collection-item">
                          <div className="col s12 p-0 flex-col center">
                            <div className="rating col">
                              <div id="rating-text">
                                <p className="grey-text mb-0 mt-1">{checkText()}</p>
                              </div>
                              <div id="rating-stars" className="stars">
                                <i id="rating_1" className={`material-icons waves-effect ${checkRating(1) === 'active' ? 'yellow-text text-darken-2' : 'grey-text text-lighten-2'}`} onMouseEnter={() => setTemporaryRating(1)} onMouseLeave={() => setTemporaryRating(5)} onClick={() => {setRating(1), setRatingSelected(true)}}>star</i>
                                <i id="rating_2" className={`material-icons waves-effect ${checkRating(2) === 'active' ? 'yellow-text text-darken-2' : 'grey-text text-lighten-2'}`} onMouseEnter={() => setTemporaryRating(2)} onMouseLeave={() => setTemporaryRating(5)} onClick={() => {setRating(2), setRatingSelected(true)}}>star</i>
                                <i id="rating_3" className={`material-icons waves-effect ${checkRating(3) === 'active' ? 'yellow-text text-darken-2' : 'grey-text text-lighten-2'}`} onMouseEnter={() => setTemporaryRating(3)} onMouseLeave={() => setTemporaryRating(5)} onClick={() => {setRating(3), setRatingSelected(true)}}>star</i>
                                <i id="rating_4" className={`material-icons waves-effect ${checkRating(4) === 'active' ? 'yellow-text text-darken-2' : 'grey-text text-lighten-2'}`} onMouseEnter={() => setTemporaryRating(4)} onMouseLeave={() => setTemporaryRating(5)} onClick={() => {setRating(4), setRatingSelected(true)}}>star</i>
                                <i id="rating_5" className={`material-icons waves-effect ${checkRating(5) === 'active' ? 'yellow-text text-darken-2' : 'grey-text text-lighten-2'}`} onMouseEnter={() => setTemporaryRating(5)} onMouseLeave={() => setTemporaryRating(5)} onClick={() => {setRating(5), setRatingSelected(true)}}>star</i>
                              </div>
                            </div>
                          </div>
                          <div className="col s12 p-0 flex-col center">
                            <form method="POST" noValidate="" onSubmit={submitProductReview} className="full-width">
                              <div className="input-field col s12">
                                <textarea id="comment" name="comment" value={comment} data-length="1200" className="materialize-textarea grey-text text-darken-2" cols="40" rows="5" onChange={e => setComment(e.target.value)}></textarea>
                                <label htmlFor="comment">What did you think?</label>
                              </div>
                              <button type="submit" className="btn btn-extended orange mb-2 fw-6">Submit Review</button>
                            </form>
                          </div>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <div className="card mb-2">
                      <ul className="collection no-shadow">
                        <li className="row collection-item">
                          <div className="col s12 p-0 flex-col center">
                            <div className="reviewed-product grey lighten-2 circle bg-cover" style={{ backgroundImage: `url(${orderItem.product.thumbnail})` }}></div>
                            <p className="fw-6 fs-18 mb-0 mt-1 amber-text">Item Reviewed</p>
                            <p className="m-0">{orderItem.product.name} ({orderItem.product_variant.name}) - Order #{orderItem.order.ref_code}</p>
                          </div>
                        </li>
                        <li className="row collection-item grey lighten-4">
                          <div className="col s12 p-0">
                            <div className="rating col">
                              <div id="rating-stars" className="stars flex-row middle">
                                {[...Array(parseInt(orderItem.review.rating)).keys()].map(star => <i key={star} className="material-icons yellow-text text-darken-2">star</i>)}
                                {[...Array(Math.max(5-parseInt(orderItem.review.rating), 0)).keys()].map(star => <i key={star} className="material-icons grey-text text-lighten-2">star</i>)}
                                <small className="ml-1 fs-16 pt-1 grey-text">({orderItem.review.rating} stars)</small>
                              </div>
                            </div>
                          </div>
                          <div className="col s12 p-0">
                            <p className="grey-text p-3 mt-0">{orderItem.review.comment}</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </section>
          ) : (
            <Redirect to="/"/>
          )}
          {orderItem.order.is_delivered && (
            <section className="section section-product-review">
                <div className="container">
                  {!orderItem.order.is_reviewed ? (
                    <div className="card mb-2">
                      <ul className="collection no-shadow">
                        <li className="row collection-item">
                          <div className="col s12 p-0 flex-col center">
                            <p className="fw-6 fs-18 mb-0 mt-1 grey-text text-darken-2">How was the delivery?</p>
                            <p className="grey-text m-0">Order #{orderItem.order.ref_code}</p>
                          </div>
                        </li>
                        <li className="row collection-item">
                          <div className="col s12 p-0 flex-col center">
                            <div className="rating col">
                              <div id="rating-text">
                                <p className="grey-text mb-0 mt-1">{checkText()}</p>
                              </div>
                              <div id="rating-stars" className="stars">
                                <i id="rating_1" className={`material-icons waves-effect ${checkOrderRating(1) === 'active' ? 'yellow-text text-darken-2' : 'grey-text text-lighten-2'}`} onMouseEnter={() => setOrderTemporaryRating(1)} onMouseLeave={() => setOrderTemporaryRating(5)} onClick={() => {setOrderRating(1), setOrderRatingSelected(true)}}>star</i>
                                <i id="rating_2" className={`material-icons waves-effect ${checkOrderRating(2) === 'active' ? 'yellow-text text-darken-2' : 'grey-text text-lighten-2'}`} onMouseEnter={() => setOrderTemporaryRating(2)} onMouseLeave={() => setOrderTemporaryRating(5)} onClick={() => {setOrderRating(2), setOrderRatingSelected(true)}}>star</i>
                                <i id="rating_3" className={`material-icons waves-effect ${checkOrderRating(3) === 'active' ? 'yellow-text text-darken-2' : 'grey-text text-lighten-2'}`} onMouseEnter={() => setOrderTemporaryRating(3)} onMouseLeave={() => setOrderTemporaryRating(5)} onClick={() => {setOrderRating(3), setOrderRatingSelected(true)}}>star</i>
                                <i id="rating_4" className={`material-icons waves-effect ${checkOrderRating(4) === 'active' ? 'yellow-text text-darken-2' : 'grey-text text-lighten-2'}`} onMouseEnter={() => setOrderTemporaryRating(4)} onMouseLeave={() => setOrderTemporaryRating(5)} onClick={() => {setOrderRating(4), setOrderRatingSelected(true)}}>star</i>
                                <i id="rating_5" className={`material-icons waves-effect ${checkOrderRating(5) === 'active' ? 'yellow-text text-darken-2' : 'grey-text text-lighten-2'}`} onMouseEnter={() => setOrderTemporaryRating(5)} onMouseLeave={() => setOrderTemporaryRating(5)} onClick={() => {setOrderRating(5), setOrderRatingSelected(true)}}>star</i>
                              </div>
                            </div>
                          </div>
                          <div className="col s12 p-0 flex-col center">
                            <form method="POST" noValidate="" onSubmit={submitOrderReview} className="full-width">
                              <div className="input-field col s12">
                                <textarea id="comment" name="comment" value={orderComment} data-length="1200" className="materialize-textarea grey-text text-darken-2" cols="40" rows="5" onChange={e => setOrderComment(e.target.value)}></textarea>
                                <label htmlFor="comment">What did you think?</label>
                              </div>
                              <button type="submit" className="btn btn-extended orange mb-2 fw-6">Submit Review</button>
                            </form>
                          </div>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <div className="card mb-2">
                      <ul className="collection no-shadow">
                        <li className="row collection-item">
                          <div className="col s12 p-0 flex-col center">
                            <p className="fw-6 fs-18 mb-0 mt-1 green-text">Delivery Reviewed</p>
                            <p className="grey-text m-0">Order #{orderItem.order.ref_code}</p>
                          </div>
                        </li>
                        <li className="row collection-item">
                          <div className="col s12 p-0">
                            <div className="rating col">
                              <div id="rating-stars"  className="stars flex-row middle">
                                {[...Array(parseInt(orderItem.order.review.rating)).keys()].map(star => <i key={star} className="material-icons yellow-text text-darken-2">star</i>)}
                                {[...Array(Math.max(5-parseInt(orderItem.order.review.rating), 0)).keys()].map(star => <i key={star} className="material-icons grey-text text-lighten-2">star</i>)}
                                <small className="ml-1 fs-16 pt-1 grey-text">({orderItem.order.review.rating} stars)</small>
                              </div>
                            </div>
                          </div>
                          <div className="col s12 p-0">
                            <p className="grey-text p-3 mt-0">{orderItem.order.review.comment}</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </section>
          )}
        </Fragment>
      )
    ) : (
      <Redirect to="/"/>
    )
  )
}

ProductReview.propTypes = {
  getOrderItem: PropTypes.func.isRequired,
  reviewProduct: PropTypes.func.isRequired,
  reviewProductOrder: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  logistics: state.logistics,
});

export default connect(mapStateToProps, { getOrderItem, reviewProduct, reviewProductOrder })(ProductReview);