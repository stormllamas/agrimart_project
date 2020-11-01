import React, { Fragment, useEffect, useState } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import { Redirect } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types'

import Preloader from '../layout/Preloader';
import AccountNav from '../layout/AccountNav';

import { connect } from 'react-redux';
import { setOrderItem, requestRefund } from '../../actions/logistics';

const RequestRefund = ({
  auth: { isAuthenticated, userLoading, user },
  logistics: { orderItem, orderItemLoading },
  setOrderItem, requestRefund
}) => {
  const history = useHistory()

  const [reason, setReason] = useState('');

  useEffect(() => {
    const query = new URLSearchParams(history.location.search);
    const orderItemQuery = query.get('p')
    setOrderItem(orderItemQuery);
  // eslint-disable-next-line
  }, [history.location.key]);

  const onSubmit = e => {
    e.preventDefault();
    requestRefund(orderItem.id, reason, history)
  }

  if (!userLoading && !isAuthenticated) {
    return(<Redirect to='/' />)
  } else if (!orderItemLoading && !orderItem.refund_valid || !orderItemLoading && orderItem.refund_requested) {
    return(<Redirect to='/orders' />)
  } else if (!userLoading && !orderItemLoading && orderItem.user !== user.id) {
    return(<Redirect to='/orders' />)
  } else {
    return (
      <Fragment>
        {orderItemLoading ? <Preloader /> : undefined}
        <div className="account container row">
          <AccountNav />
          {!orderItemLoading ? (
            <section id="review-page" className="account-content">
              <ul className="breadcrumb row">
                <li className="breadcrumb-item"><Link to="/orders"><h1>My Orders</h1></Link></li>
                <li className="breadcrumb-item active"><h1>Request a refund</h1></li>
              </ul>
              <div className="account-body row">
                <div className="refund-card card bordered col">
                  <div className="order-header row">
                    <div className="pic-desc row">
                      <Link to={`shop/product?p=${orderItem.pid}`} className="item-image" style={{background: `url('${ orderItem.thumbnail }') no-repeat center center/cover`}}></Link>
                      <div className="item-description col">
                        <Link to={`shop/product?p=${orderItem.pid}`}><h5>{ orderItem.name }</h5></Link>
                        <Link to={`shop/seller?brand=${orderItem.seller_id}`}><small>{ orderItem.seller_name }</small></Link>
                      </div>
                    </div>
                    <div className="refund-prompt col middle center">
                      <h2>Request a Refund</h2>
                    </div>
                  </div>
                  <div className="order-body">
                  <form method="POST" noValidate="" className="col" onSubmit={onSubmit}>
                    <textarea name="refund_reason" cols="40" rows="5" value={reason} placeholder="Please give a reason" maxLength="4000" className="comment col" id="id_comment" onChange={e => setReason(e.target.value)} ></textarea>
                    <small className="form-text text-muted">4000 characters allowed</small>
                    <button type="submit" className="btn-green">Request Refund</button>
                  </form>
                  </div>
                </div>
              </div>
            </section>
          ): undefined}
        </div>
      </Fragment>
    )
  }
}

RequestRefund.propTypes = {
  setOrderItem: PropTypes.func.isRequired,
  requestRefund: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  logistics: state.logistics,
});

export default connect(mapStateToProps, { setOrderItem, requestRefund })(RequestRefund);