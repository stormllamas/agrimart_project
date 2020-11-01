import React, { Fragment, useEffect, useState } from 'react'
import { HashLink as Link } from 'react-router-hash-link';
import { Redirect, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

import Preloader from '../../components/common/Preloader'

import { getOrder, reviewOrder } from '../../actions/logistics'


const OrderReview = ({
  auth: {
    isAuthenticated,
    user
  },
  logistics: {
    orderLoading,
    order,
  },
  getOrder,
  reviewOrder,
  match
}) => {
  const history = useHistory()

  const [rating, setRating] = useState(5);
  const [ratingSelected, setRatingSelected] = useState(false);
  const [comment, setComment] = useState('');

  const checkRating = num => {
    if (rating >= num) {
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

  const submitOrderReview = e => {
    e.preventDefault();
    reviewOrder({
      order: order.id,
      userID: user.id,
      rating: rating,
      comment: comment,
      history
    })
  }

  useEffect(() => {
    isAuthenticated && (
      getOrder({
        orderID: match.params.order_id
      })
    )
  }, []);
  
  useEffect(() => {
    if (!orderLoading) {
      $('.loader').fadeOut();
      $('.middle-content').fadeIn();
      $('#comment').characterCounter();
    } else {
      $('.loader').show();
      $('.middle-content').hide();
    }
  }, [orderLoading]);

  return (
    isAuthenticated ? (
      !orderLoading && (
        order.is_delivered && order.user.id === user.id ? (
          <section className="section section-product-review">
              <div className="container">
              <div className="flex-row middle mb-3 mt-2">
                <Link to="/bookings" className="flex-row middle"><i className="material-icons blue-text mr-2 fs-30">arrow_back</i></Link>
                <h5 className="m-0">Review Delivery</h5>
              </div>
              {!order.is_reviewed ? (
                <div className="card mb-2">
                  <ul className="collection no-shadow">
                    <li className="row collection-item">
                      <div className="col s12 p-0 flex-col center">
                        <p className="fw-6 fs-18 mb-0 mt-1 grey-text text-darken-2">How was the delivery?</p>
                        <p className="grey-text m-0">Order #{order.ref_code}</p>
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
                        <form method="POST" noValidate="" onSubmit={submitOrderReview} className="full-width">
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
                        <p className="fw-6 fs-18 mb-0 mt-1 green-text">Delivery Reviewed</p>
                        <p className="grey-text m-0">Order #{order.ref_code}</p>
                      </div>
                    </li>
                    <li className="row collection-item">
                      <div className="col s12 p-0">
                        <div className="rating col">
                          <div id="rating-stars"  className="stars flex-row middle">
                            {[...Array(parseInt(order.review.rating)).keys()].map(star => <i key={star} className="material-icons yellow-text text-darken-2">star</i>)}
                            {[...Array(Math.max(5-parseInt(order.review.rating), 0)).keys()].map(star => <i key={star} className="material-icons grey-text text-lighten-2">star</i>)}
                            <small className="ml-1 fs-16 pt-1 grey-text">({order.review.rating} stars)</small>
                          </div>
                        </div>
                      </div>
                      <div className="col s12 p-0">
                        <p className="grey-text p-3 mt-0">{order.review.comment}</p>
                      </div>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </section>
        ): (
          <Redirect to="/"/>
        )
      )
    ) : (
      <Redirect to="/"/>
    )
  )
}

OrderReview.propTypes = {
  getOrder: PropTypes.func.isRequired,
  reviewOrder: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  logistics: state.logistics,
});

export default connect(mapStateToProps, { getOrder, reviewOrder })(OrderReview);