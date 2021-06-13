import React, { useRef, useCallback, Fragment } from 'react';
import { HashLink as Link } from 'react-router-hash-link';

import { connect } from 'react-redux';
import { getOrders } from '../../../actions/logistics';

const BookingItem = ({ ordersLoading, order, orders, index, getOrders, setOrder }) => {
  const observer = useRef();
  const lastProductElement = useCallback(el => {
    if (ordersLoading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && orders.next !== null && !ordersLoading) {
        getOrders({
          getMore: true
        });
      }
    })
    if (el) observer.current.observe(el)
  }, [ordersLoading, orders.next]);
  
  return (
    <Fragment>
      <li className="card mb-2" ref={orders.results.length === index + 1 ? lastProductElement : undefined }>
        <ul className="collection no-shadow">
          <li className="row collection-item">
            <div className="col s9 p-0">
              <p className="fw-6 fs-18 mb-0 mt-1 grey-text text-darken-2">Order #{order.ref_code}</p>
            </div>
            <div className="col s3 flex-col end p-0">
              {!order.is_delivered ? (
                // <button data-target="ordermodal" className="modal-trigger btn fw-6 light-green pulse" onClick={() => setOrder(order)}>Status</button>
                !order.is_processed ? (
                  <p className="m-0 p-2 fs-16 rad-2 grey lighten-2 grey-text text-darken-1">Processing Order</p>
                ) : (
                  !order.is_prepared ? (
                    <p className="m-0 p-2 fs-16 rad-2 grey lighten-2 grey-text text-darken-1">Preparing Order</p>
                  ) : (
                    <p className="m-0 p-2 fs-16 rad-2 grey lighten-2 grey-text text-darken-1">Delivering Order</p>
                  )
                )
              ) : (
                !order.is_reviewed ? (
                  <Link to={`/order_review/${order.id}`} className="chip amber white-text right waves-effect waves-orange">REVIEW</Link>
                ) : (
                  <div className="chip grey lighten-2 white-text right"><i>Reviewed</i></div>
                )
              )}
            </div>
          </li>
          {order.order_items && (
            order.order_items.map(orderItem => (
              <li key={orderItem.id} className="collection-item avatar">
                <div className="grey lighten-2 circle bg-cover" style={{ backgroundImage: `url(${orderItem.product_variant.thumbnail})` }}></div>
                <p className="title">{orderItem.product.name} - {orderItem.product_variant.name}</p>
                {orderItem.is_delivered && (
                  orderItem.is_reviewed ? (
                    <div className="chip grey lighten-2 white-text right"><i>Reviewed</i></div>
                  ) : (
                    <Link to={`/product_review/${orderItem.id}`} className="chip amber white-text right waves-effect waves-orange">REVIEW</Link>
                  )
                )}
                <p className="grey-text">{orderItem.quantity} x ₱ {orderItem.ordered_price.toFixed(2)}</p>
                <p className="title">₱ {(orderItem.quantity*orderItem.ordered_price).toFixed(2)}</p>
              </li>
            ))
          )}
          <li className="collection-item grey lighten-4">
            <Fragment>
              <div className="row m-0">
                <div className="col s12 p-0">
                  <p className="left m-0 fw-6">Delivery Address: <i className="fw-5 fs-14">{order.loc2_address}</i></p>
                </div>
              </div>
            </Fragment>
          </li>
          <li className="collection-item grey lighten-4">
            <Fragment>
              <div className="row m-0">
                <div className="col s6 p-0">
                  <p className="left m-0">Subtotal</p>
                </div>
                <div className="col s6 flex-col end p-0">
                  <p className="left m-0">{order.promo_code && (order.promo_code.order_discount && <span className="sale">₱ {order.subtotal.toFixed(2)}</span>)} ₱ {order.ordered_subtotal.toFixed(2)}</p>
                </div>
              </div>
              <div className="row m-0">
                <div className="col s6 p-0">
                  <p className="left m-0">Shipping</p>
                </div>
                <div className="col s6 flex-col end p-0">
                  <p className="left m-0">{order.promo_code && (order.promo_code.delivery_discount && <span className="sale">₱ {order.initial_shipping.toFixed(2)}</span>)} ₱ {order.shipping.toFixed(2)}</p>
                </div>
              </div>
            </Fragment>
            <div className="row m-0 mt-1">
              <div className="col s6 p-0">
                <p className="fw-6 fs-17 m-0">Total</p>
              </div>
              <div className="col s6 flex-col end p-0">
                <p className="fw-6 fs-17 m-0">₱ {(order.total).toFixed(2)}</p>
              </div>
            </div>
          </li>
        </ul>
      </li>
    </Fragment>
  )
}

export default connect(null, { getOrders })(BookingItem);