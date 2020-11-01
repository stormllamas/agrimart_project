import React, { Fragment, useEffect, useState } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import { Redirect } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types'

import Preloader from '../layout/Preloader';
import AccountNav from '../layout/AccountNav';

import { connect } from 'react-redux';
import { setOrderItem, createReview } from '../../actions/logistics';

const Review = ({
  auth: { isAuthenticated, userLoading, user },
  logistics: { orderItem, orderItemLoading },
  setOrderItem, createReview
}) => {
  const history = useHistory()

  const [rating, setRating] = useState(5);
  const [ratingSelected, setRatingSelected] = useState(false);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const query = new URLSearchParams(history.location.search);
    const orderItemQuery = query.get('p')
    setOrderItem(orderItemQuery);
  // eslint-disable-next-line
  }, [history.location.key]);

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

  const onSubmit = e => {
    e.preventDefault();
    createReview(orderItem.product, user.id, rating, comment, history)
  }

  if (!userLoading && !isAuthenticated) {
    return(<Redirect to='/' />)
  } else if (!orderItemLoading && orderItem.reviewed) {
    return(<Redirect to='/orders' />)
  } else {
    return (
      <Fragment>
        {orderItemLoading ? <Preloader /> : undefined}
        <div className="account container row">
          <AccountNav />
          {!orderItemLoading && (
            <section id="review-page" className="account-content">
              <ul className="breadcrumb row">
                <li className="breadcrumb-item"><Link to="/orders"><h1>My Orders</h1></Link></li>
                <li className="breadcrumb-item active"><h1>Write Review</h1></li>
              </ul>
              <div className="account-body row">
                <div className="review-card card bordered col">
                  <div className="order-header row">
                    <div className="pic-desc row">
                      <Link to={`shop/product?p=${orderItem.pid}`} className="item-image" style={{background: `url('${ orderItem.thumbnail }') no-repeat center center/cover`}}></Link>
                      <div className="item-description col">
                        <Link to={`shop/product?p=${orderItem.pid}`}><h5>{ orderItem.name }</h5></Link>
                        <Link to={`shop/seller?brand=${orderItem.seller_id}`}><small>{ orderItem.seller_name }</small></Link>
                      </div>
                    </div>
                    <div className="rating col">
                      <div id="rating-text">
                        <small>{checkText()}</small>
                      </div>
                      <div id="rating-stars" className="stars">
                        <i id="rating_1" className={`fas fa-star ${checkRating(1)}`} onMouseEnter={() => setTemporaryRating(1)} onMouseLeave={() => setTemporaryRating(5)} onClick={() => {setRating(1), setRatingSelected(true)}} ></i>
                        <i id="rating_2" className={`fas fa-star ${checkRating(2)}`} onMouseEnter={() => setTemporaryRating(2)} onMouseLeave={() => setTemporaryRating(5)} onClick={() => {setRating(2), setRatingSelected(true)}} ></i>
                        <i id="rating_3" className={`fas fa-star ${checkRating(3)}`} onMouseEnter={() => setTemporaryRating(3)} onMouseLeave={() => setTemporaryRating(5)} onClick={() => {setRating(3), setRatingSelected(true)}} ></i>
                        <i id="rating_4" className={`fas fa-star ${checkRating(4)}`} onMouseEnter={() => setTemporaryRating(4)} onMouseLeave={() => setTemporaryRating(5)} onClick={() => {setRating(4), setRatingSelected(true)}} ></i>
                        <i id="rating_5" className={`fas fa-star ${checkRating(5)}`} onMouseEnter={() => setTemporaryRating(5)} onMouseLeave={() => setTemporaryRating(5)} onClick={() => {setRating(5), setRatingSelected(true)}} ></i>
                      </div>
                    </div>
                  </div>
                  <div className="order-body">
                    <form method="POST" noValidate="" className="col" onSubmit={onSubmit}>
                      <textarea name="comment" cols="40" rows="5" value={comment} placeholder="What did you think?" maxLength="4000" className="comment col" id="id_comment" onChange={e => setComment(e.target.value)} ></textarea>
                      <small className="form-text text-muted">4000 characters allowed</small>
                      <button type="submit" className="btn-green">Submit</button>
                    </form>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </Fragment>
    )
  }
}

Review.propTypes = {
  setOrderItem: PropTypes.func.isRequired,
  createReview: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  logistics: state.logistics,
});

export default connect(mapStateToProps, { setOrderItem, createReview })(Review);