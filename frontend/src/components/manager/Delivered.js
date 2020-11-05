import React, { Fragment, useEffect, useState } from 'react'
import { HashLink as Link } from 'react-router-hash-link';
import { Redirect, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import moment from 'moment'

import Preloader from '../common/Preloader'
import Pagination from '../common/Pagination'

import { getOrders, getOrder } from '../../actions/manager'

const Delivered = ({
  manager: {
    ordersLoading,
    orders,
    orderLoading,
    order
  },
  getOrders,
  getOrder,
  deliverOrderItem, deliverOrder
}) => {
  const history = useHistory()
  const query = new URLSearchParams(history.location.search);

  const [keywords, setKeywords] = useState('')
  const [page, setPage] = useState(1)
  
  useEffect(() => {
    if (!ordersLoading) {
      $('.loader').fadeOut();
      $('.middle-content').fadeIn();
  
      $('.modal').modal({
        dismissible: true,
        inDuration: 300,
        outDuration: 200,
      });
    } else {
      $('.loader').show();
      $('.middle-content').hide();
    }
  }, [ordersLoading]);

  useEffect(() => {
    const pageQuery = query.get('page')
    if (pageQuery) {
      if (pageQuery != page) {
        setPage(pageQuery)
      } else {
        getOrders({
          page: page,
          claimed: true,
          delivered: true,
          keywords: keywords
        })
      }
    } else {
      setPage(1)
      getOrders({
        page: 1,
        claimed: true,
        delivered: true,
        keywords: keywords
      })
    }
  }, [keywords, page]);
  
  return (
    !ordersLoading && (
      <Fragment>
        <div className="navbar-fixed">
          <nav id="admin-search" className="green">
            <div className="nav-wrapper">
              <form>
                <div className="input-field">
                  <input type="search" id="search" name="manager-search" placeholder="Search for a Reference Number" required onChange={e => setKeywords(e.target.value)}/>
                  <label htmlFor="manager-search" className="label-icon">
                    <i className="material-icons">search</i>
                  </label>
                  <i className="material-icons">close</i>
                </div>
              </form>
            </div>
          </nav>
        </div>
        <section className="section section-delivered admin">
          <div className="container widen">
            <div className="row mt-3">
              <div className="col flex-row middle s12">
                <a href="#" data-target="mobile-nav" className="sidenav-trigger grey-text text-darken-1 show-on-small-and-up mr-4 ml-2 pt-1">
                  <i className="material-icons">menu</i>
                </a>
                <h4 className="m-0 flex-row middle flow"><i className="material-icons fs-38 mr-2">pending_actions</i>Delivered Orders</h4>
              </div>
            </div>
            <div className="row table-row">
              <div className="col s12">
                <div className="card-panel white rad-4 no-shadow">
                  <div className="row m-0 mb-2">
                    <div className="col s12 m6 l6">
                      {!ordersLoading && orders.count > 50 ? <Pagination data={orders} setPage={setPage} pageSize={50} currentPage={page}/> : undefined}
                    </div>
                  </div>
                  <div className="row m-0 overflow-scroll">
                    <table className="bordered highlight">
                      <thead>
                        <tr className="grey lighten-3">
                          <th>Date Ordered</th>
                          <th>Date Delivered</th>
                          <th>Ref Code</th>
                          <th>Payment</th>
                          <th>Pickup Address</th>
                          <th>Delivery Address</th>
                          <th>Items</th>
                          <th>Order Total</th>
                          <th>Subtotal</th>
                          <th>Shipping</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.results.map(order => (
                          <tr key={order.id}>
                            <td className="mw-medium">{moment(order.date_ordered).format('lll')}</td>
                            <td className="mw-medium">{moment(order.date_delivered).format('lll')}</td>
                            <td><a href="" data-target="ordermodal" className="mw-small modal-trigger fw-6 blue-text text-lighten-2" onClick={() => getOrder({ id:order.id })}>{order.ref_code}</a></td>
                            <td className={`fw-6 ${order.payment_type === 1 ? 'orange-text' : 'green-text'}`}>{order.payment_type === 1 ? 'COD' : 'Card'}</td>
                            <td className="mw-large pr-2">{order.loc1_address}</td>
                            <td className="mw-large pr-2">{order.loc2_address}</td>
                            <td className="mw-medium">{order.count} items</td>
                            <td className="mw-medium">₱ {order.total}</td>
                            <td className="mw-medium">₱ {order.ordered_price}</td>
                            <td className="mw-medium">₱ {order.shipping}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div id="ordermodal" className="modal modal-fixed-footer supermodal">
              {orderLoading ? (
                <div className="flex-col full-height middle center relative preloader-wrapper pb-5">
                  <Preloader color="green" size="big" adds="visible"/>
                </div>
              ) : (
                <Fragment>
                  <div className="modal-content">
                    <div className="row m-0">
                      <div className="col s12">
                        <h5 className="mt-0 mb-2">Order Summary <small>({order.ref_code})</small></h5>
                      </div>
                    </div>
                    <ul className="collection transparent no-shadow rad-3">
                      {order.order_items.map(orderItem => (
                        <li key={orderItem.id} className="collection-item flex-row middle">
                          <div className="mw-small manager-checklist flex-col middle center pr-2">
                            <div className="checklist-item flex-col middle center">
                              <input id={`${order.ref_code}-${orderItem.id}`} type="checkbox" className="check" name={`${order.ref_code}-${orderItem.id}`} value={orderItem.id} defaultChecked={orderItem.is_delivered === true ? true : false} disabled={orderItem.is_delivered === true ? true : false}/>
                              <label className="btn-check text-center" htmlFor={`${order.ref_code}-${orderItem.id}`}><i className="fas fa-check"></i></label>
                            </div>
                          </div>
                          <div className="collection-item avatar transparent">
                            <div className="grey lighten-2 circle bg-cover" style={{ backgroundImage: `url(${orderItem.product_variant.thumbnail})` }}></div>
                            <p className="title">{orderItem.product.name} - {orderItem.product_variant.name}</p>
                            <p className="grey-text">{orderItem.quantity} x ₱ {orderItem.ordered_price.toFixed(2)}</p>
                            <p className="title">₱ {(orderItem.quantity*orderItem.ordered_price).toFixed(2)}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <p className="fs-16 m-0 ml-2">Subtotal: <span className="fw-4 fs-16 ml-2">₱ {order.subtotal.toFixed(2)}</span></p>
                    <p className="fs-16 m-0 ml-2">Delivery: <span className="fw-4 fs-16 ml-2">₱ {order.shipping.toFixed(2)}</span></p>
                    <p className="fw-6 fs-22 m-0 ml-2">Total: <span className="fw-4 fs-18 ml-2">₱ {(order.subtotal+order.shipping).toFixed(2)}</span></p>
                  </div>
                </Fragment>
              )}
            <div className="modal-footer">
              <a className="modal-close cancel-fixed"><i className="material-icons grey-text">close</i></a>
            </div>
            </div>
          </div>
        </section>
      </Fragment>
    )
  )
}

Delivered.propTypes = {
  getOrders: PropTypes.func.isRequired,
  getOrder: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  manager: state.manager,
});

export default connect(mapStateToProps, { getOrders, getOrder })(Delivered);