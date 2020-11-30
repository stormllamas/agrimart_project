import React, { Fragment, useEffect, useState } from 'react'
import { HashLink as Link } from 'react-router-hash-link';
import { Redirect, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import moment from 'moment'

import Preloader from '../common/Preloader'
import Pagination from '../common/Pagination'
import ManagerBreadcrumbs from './ManagerBreadcrumbs'

import { processOrder, getOrders, getOrder } from '../../actions/manager'

const Unprocessed = ({
  manager: {
    ordersLoading,
    orders,
    orderLoading,
    order
  },
  getOrders,
  getOrder,
  processOrder,
  setCurLocation
}) => {
  const history = useHistory()
  const query = new URLSearchParams(history.location.search);

  const [keywords, setKeywords] = useState('')
  const [page, setPage] = useState(1)

  const [currentMap, setCurrentMap] = useState('');
  const [pickupMarker, setPickupMarker] = useState('');
  const [deliveryMarker, setDeliveryMarker] = useState('');

  const [addressFocus, setAddressFocus] = useState('');

  const onSubmit = () => {
    const checkedBoxes = $('.check:checked:not([disabled])')
    checkedBoxes.each((index, checkedBox) => {
      // const IDs = checkedBox.value.split('-')
      // const body = {
      //   order: IDs[1],
      //   product_variant: IDs[2]
      // }
      processOrder({
        id: checkedBox.value,
      })
    })
  }
  
  const showGoogleMaps = () => {
    const centerLatLng = new google.maps.LatLng(13.938080242321387, 121.61336104698454)

    const LUCENA_BOUNDS = {
      north: 13.990870,
      south: 13.889484,
      west: 121.554958,
      east: 121.709314,
    }
    // Map options
    const mapOptions = {
      zoom: 14,
      restriction: {
        latLngBounds: LUCENA_BOUNDS,
        strictBounds: false
      },
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.LEFT_BOTTOM
      },
      fullscreenControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM
      },
      streetViewControl: false,
      scaleControl: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      center: centerLatLng
    }

    // Create and set map
    const map = new google.maps.Map(document.getElementById('googlemap'), mapOptions)
    setCurrentMap(map);

    // Display a caption in the map with user location
    const infoWindow = new google.maps.InfoWindow;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        let pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        infoWindow.setPosition(pos);
        infoWindow.setContent('You');
        infoWindow.open(map);
        // map.setCenter(pos);
      }, function() {
      });
    }
  };

  let pickupMarkerDown;
  let deliveryMarkerDown;

  const addMarkers = ({
    pickupLat, 
    pickupLng,
    deliveryLat,
    deliverLng,
    focus
  }) => {
    // Deletes previous marker from both confirmed and current sessions
    pickupMarker !== '' && pickupMarker.setMap(null)
    deliveryMarker !== '' && deliveryMarker.setMap(null)
    pickupMarkerDown && pickupMarkerDown.setMap(null)
    deliveryMarkerDown && deliveryMarkerDown.setMap(null)
    
    const pickupLatLng = {lat: parseFloat(pickupLat), lng: parseFloat(pickupLng)}
    const deliveryLatLng = {lat: parseFloat(deliveryLat), lng: parseFloat(deliverLng)}

    const newPickupMarker = new google.maps.Marker({
      position: pickupLatLng,
      map: currentMap,
      icon: {
        url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
      },
      draggable: false,
      animation: google.maps.Animation.DROP
    });

    const newDeliveryMarker = new google.maps.Marker({
      position: deliveryLatLng,
      icon: {
        url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
      },
      map: currentMap,
      draggable: false,
      animation: google.maps.Animation.DROP
    });

    setPickupMarker(newPickupMarker);
    pickupMarkerDown = newPickupMarker
    newPickupMarker.setMap(currentMap)

    setDeliveryMarker(newDeliveryMarker);
    deliveryMarkerDown = newDeliveryMarker
    newDeliveryMarker.setMap(currentMap)

    if (focus === 'pickup') {
      currentMap.setCenter(newPickupMarker.getPosition());
    } else if (focus === 'delivery') {
      currentMap.setCenter(newDeliveryMarker.getPosition());
    }
  }
  
  useEffect(() => {
    setCurLocation(history.location)
  }, [history]);
  
  useEffect(() => {
    if (!ordersLoading) {
      $('.loader').fadeOut();
      $('.middle-content').fadeIn();
  
      $('.modal').modal({
        dismissible: true,
        inDuration: 300,
        outDuration: 200,
      });
      showGoogleMaps();
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
          processed: false,
          prepared: false,
          delivered: false,
          keywords: keywords,
        })
      }
    } else {
      setPage(1)
      getOrders({
        page: 1,
        processed: false,
        prepared: false,
        delivered: false,
        keywords: keywords
      })
    }
  }, [keywords, page]);
  
  useEffect(() => {
    if (order !== null && currentMap !== '') {
      addMarkers({
        pickupLat: order.loc1_latitude, 
        pickupLng: order.loc1_longitude,
        deliveryLat: order.loc2_latitude,
        deliverLng: order.loc2_longitude,
        focus: addressFocus
      })
    }
  }, [order]);
  
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
        <ManagerBreadcrumbs/>
        <section className="section section-unprocessed admin">
          <div className="container widen">
            <div className="row mt-3">
              <div className="col flex-row middle s12">
                <a href="#" data-target="mobile-nav" className="sidenav-trigger grey-text text-darken-1 show-on-small-and-up mr-4 ml-2 pt-1">
                  <i className="material-icons">menu</i>
                </a>
                <h4 className="m-0 flex-row middle flow"><i className="material-icons fs-38 mr-2">pending</i>Unprocessed Orders</h4>
              </div>
            </div>
            <div className="row table-row">
              <div className="col s12">
                <div className="card-panel white rad-4 no-shadow">
                  <div className="row m-0 flex middle mb-2">
                    <div className="col s12 m6 l6">
                      {!ordersLoading && orders.count > 50 ? <Pagination data={orders} setPage={setPage} pageSize={50} currentPage={page}/> : undefined}
                    </div>
                    <div className="col s12 m6 l6 flex-row right-middle">
                      <button className="btn green right" onClick={onSubmit}>Claim Order</button>
                    </div>
                  </div>
                  <div className="row m-0 overflow-scroll">
                    <table className="bordered highlight">
                      <thead>
                        <tr className="grey lighten-3">
                          <th>Status</th>
                          <th>Date Ordered</th>
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
                        {orders.results.length > 0 ? (
                          orders.results.map(order => (
                            <tr key={order.id}>
                              <td className="mw-small manager-checklist flex-col middle center pr-2">
                                <div className="checklist-item flex-col middle center">
                                  <input id={`${order.ref_code}-${order.id}`} type="checkbox" className="check" name={`${order.ref_code}-${order.id}`} value={order.id} />
                                  <label className="btn-check text-center" htmlFor={`${order.ref_code}-${order.id}`}><i className="fas fa-check"></i></label>
                                </div>
                              </td>
                              <td className="mw-medium">{moment(order.date_ordered).format('lll')}</td>
                              <td><a href="" data-target="ordermodal" className="mw-small modal-trigger fw-6 blue-text text-lighten-2" onClick={() => getOrder({ id:order.id })}>{order.ref_code}</a></td>
                              <td className={`fw-6 ${order.payment_type === 1 ? 'orange-text' : 'green-text'}`}>{order.payment_type === 1 ? 'COD' : 'Card'}</td>
                              <td className="mw-large"><a href="" data-target="addressmodal" className="mw-small modal-trigger fw-6 green-text text-lighten-1" onClick={() => {getOrder({ id:order.id }), setAddressFocus('pickup')}}>{order.loc1_address}</a></td>
                              <td className="mw-large"><a href="" data-target="addressmodal" className="mw-small modal-trigger fw-6 blue-text text-lighten-1" onClick={() => {getOrder({ id:order.id }), setAddressFocus('delivery')}}>{order.loc2_address}</a></td>
                              <td className="mw-medium">{order.count} items</td>
                              <td className="mw-medium">₱ {order.total.toFixed(2)}</td>
                              <td className="mw-medium">₱ {order.subtotal.toFixed(2)}</td>
                              <td className="mw-medium">₱ {order.shipping.toFixed(2)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="12" className="grey-text center fs-20 pt-5 pb-5 full-height uppercase">No more orders</td>
                          </tr>
                        )}
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
                    <h5 className="mt-0 mb-2">Order Summary <small>({order.ref_code})</small></h5>
                    <ul className="collection transparent no-shadow">
                      {order.order_items.map(orderItem => (
                        <li key={orderItem.id} className="collection-item avatar transparent">
                          <div className="grey lighten-2 circle bg-cover" style={{ backgroundImage: `url(${orderItem.product_variant.thumbnail})` }}></div>
                          <p className="title">{orderItem.product.name} - {orderItem.product_variant.name}</p>
                          <p className="grey-text">{orderItem.quantity} x ₱ {orderItem.ordered_price.toFixed(2)}</p>
                          <p className="title">₱ {(orderItem.quantity*orderItem.ordered_price).toFixed(2)}</p>
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
            <div id="addressmodal" className="modal supermodal">
              <div id="googlemap"></div>
              <div className="modal-footer">
                <a className="modal-action modal-close cancel-fixed"><i className="material-icons grey-text">close</i></a>
              </div>
            </div>
          </div>
        </section>
      </Fragment>
    )
  )
}

Unprocessed.propTypes = {
  getOrders: PropTypes.func.isRequired,
  getOrder: PropTypes.func.isRequired,
  processOrder: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  manager: state.manager,
});

export default connect(mapStateToProps, { getOrders, getOrder, processOrder })(Unprocessed);