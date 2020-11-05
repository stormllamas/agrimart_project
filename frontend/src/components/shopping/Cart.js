import React, { Fragment, useEffect, useState } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import { Redirect, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'

import { getAddress } from '../../actions/auth';
import { getCurrentOrder, deleteOrderItem, checkout, changeQuantity } from '../../actions/logistics';

const Cart = ({
  auth: {
    user,
    isAuthenticated,
  },
  siteConfig: {
    siteInfo
  },
  logistics: {
    currentOrderLoading,
    currentOrder,
    quantityLoading,
    deleteLoading,
    checkoutLoading
  },
  getCurrentOrder,
  getAddress,
  deleteOrderItem,
  changeQuantity,
  checkout
}) => {
  const history = useHistory()

  const [address, setAddress] = useState("");
  const [delivery, setDelivery] = useState("");

  const [firstName, setFirstName] = useState(user ? (user.first_name ? user.first_name : '') : '');
  const [lastName, setLastName] = useState(user ? (user.last_name ? user.last_name : '') : '');
  const [contact, setContact] = useState(user ? (user.contact ? user.contact : '') : '');
  const [email, setEmail] = useState(user ? (user.email ? user.email : '') : '');
  const [gender, setGender] = useState(user ? (user.gender ? user.gender : '') : '');

  const [pickupLat, setPickupLat] = useState('');
  const [pickupLng, setPickupLng] = useState('');
  const [pickupAddress, setPickupAddress] = useState("Please set a pickup address");
  const [deliveryLat, setDeliveryLat] = useState('');
  const [deliveryLng, setDeliveryLng] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState("Please set a delivery address");

  const [distanceText, setDistanceText] = useState("");
  const [distanceValue, setDistanceValue] = useState("");
  const [durationText, setDurationText] = useState("");
  const [durationValue, setDurationValue] = useState("");

  const addressSelected = async () => {
    $('.loader').fadeIn();
    let addressInfo;
    try {
      addressInfo = await getAddress(address)
    } catch (error) {
      history.push('/login')
      $('.loader').fadeOut();
    }
    setDeliveryLat(addressInfo.latitude)
    setDeliveryLng(addressInfo.longitude)
    setDeliveryAddress(addressInfo.address)

    const origin = new google.maps.LatLng(pickupLat, pickupLng);
    const destination =  new google.maps.LatLng(addressInfo.latitude, addressInfo.longitude);
  
    try {
      const distanceService = new google.maps.DistanceMatrixService();
      distanceService.getDistanceMatrix({
        origins: [origin],
        destinations: [destination],
        travelMode: 'DRIVING',
        // transitOptions: TransitOptions,
        // drivingOptions: DrivingOptions,
        // unitSystem: UnitSystem,
        // avoidHighways: Boolean,
        // avoidTolls: Boolean,
      }, async (response, status) => {
        if (status === 'OK') {
          const distanceString = response.rows[0].elements[0].distance.text
          const distanceValue = response.rows[0].elements[0].distance.value
          const durationString = response.rows[0].elements[0].duration.text
          const durationValue = response.rows[0].elements[0].duration.value
          setDistanceText(distanceString);
          setDistanceValue(distanceValue);
          setDurationText(durationString);
          setDurationValue(durationValue);
          
          let total = Math.round((parseInt(distanceValue)/1000))*siteInfo.per_km_price
          if (total < 25) total = 25
          setDelivery(total)
        }
      });
    } catch (err) {
      console.log('error', err.data)
    }
    $('.loader').fadeOut();
  }

  const proceedToPayments = async e => {
    e.preventDefault();
    if(pickupLat && pickupLng && pickupAddress &&
      deliveryLat && deliveryLng && deliveryAddress &&
      distanceText && distanceValue &&
      durationText && durationValue &&
      firstName && lastName && contact && email && gender ? true : false) {
      const formData = {
        firstName, lastName, contact, email, gender,
        pickupLat, pickupLng, pickupAddress,
        deliveryLat, deliveryLng, deliveryAddress,
        distanceText, distanceValue, durationText, durationValue,
      }
      await checkout({
        formData,
        history: history,
      })
    }
  }

  useEffect(() => {
    getCurrentOrder({})
  }, [])

  useEffect(() => {
    if (address) {
      addressSelected()
    }
  }, [address]);
  
  useEffect(() => {
    if (!currentOrderLoading && currentOrder !== null) {
      $('.loader').fadeOut();
      $('.middle-content').fadeIn();
      $('select').formSelect();
      $('.collapsible').collapsible({
        accordion: false
      });
      setPickupLat(13.965670)
      setPickupLng(121.655024)
      setPickupAddress('Sitio Fori, Brgy. Talipan, (Agriculture Complex) Pagbilao, Quezon')
      $('.form-notification').attr('style', 'opacity: 1')
      M.updateTextFields();
    } else {
      $('.loader').show();
    }
  }, [currentOrderLoading, currentOrder]);
  
  useEffect(() => {
    if (!quantityLoading && !deleteLoading && !checkoutLoading) {
      $('.loader').fadeOut();
    } else {
      $('.loader').fadeIn();
    }
  }, [quantityLoading, deleteLoading, checkoutLoading]);

  return (
    !currentOrderLoading && (
      <div className="account container row">
        <section className="section section-cart pb-1">
          <div className="container">
            {/* <ul className="breadcrumb row">
              <li className="breadcrumb-item active"><h1>My Cart</h1></li>
            </ul> */}
            {currentOrder.order_items.length > 0 ? (
              <Fragment>
                <h5>Information</h5>
                <ul className="collapsible mb-5 mt-3">
                  <li>
                    <div className="collapsible-header relative">
                      <span className="main-title">Personal Details</span>
                      {!lastName || !firstName || !contact || !email || !gender ? (
                        <i className="material-icons red-text form-notification">error</i>
                      ) : (
                        <i className="material-icons green-text form-notification">check_circle</i>
                      )}
                      <i className="material-icons">keyboard_arrow_down</i>
                    </div>
                    <div className="collapsible-body grey lighten-4">
                      <div className="row">
                        <div className="col s12 m6">
                          <div className="input-field relative">
                            <input type="text" id="first_name" className="validate grey-text text-darken-2" onChange={e => setFirstName(e.target.value)} required value={firstName}/>
                            <label htmlFor="first_name" className="grey-text text-darken-2">First Name</label>
                            <span className="helper-text" data-error="This field is required"></span>
                          </div>
                        </div>
                        <div className="col s12 m6">
                          <div className="input-field relative">
                            <input type="text" id="last_name" className="validate grey-text text-darken-2" value={lastName} onChange={e => setLastName(e.target.value)} required/>
                            <label htmlFor="last_name" className="grey-text text-darken-2">Last Name</label>
                            <span className="helper-text" data-error="This field is required"></span>
                          </div>
                        </div>
                        <div className="col s12 m12 l4">
                          <div className="input-field relative">
                            <input type="text" id="contact" className="validate grey-text text-darken-2" value={contact} onChange={e => setContact(e.target.value)} required/>
                            <label htmlFor="contact" className="grey-text text-darken-2">Contact</label>
                            <span className="helper-text" data-error="This field is required"></span>
                          </div>
                        </div>
                        <div className="col s12 m12 l4">
                          <div className="input-field relative">
                            <input type="text" id="email" className="validate grey-text text-darken-2" value={email} onChange={e => setEmail(e.target.value)} required/>
                            <label htmlFor="email" className="grey-text text-darken-2">Email</label>
                            <span className="helper-text" data-error="This field is required"></span>
                          </div>
                        </div>
                        <div className="col s12 m12 l4">
                          <div className="input-field">
                            <select id="gender" className="text-grey validate grey-text text-darken-2" value={gender} onChange={e => setGender(e.target.value)} required>
                              <option value="" disabled>Select a Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                            </select>
                            <label htmlFor="gender" className="grey-text text-darken-2">Gender</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="active">
                    <div className="collapsible-header relative">
                      <span className="main-title">Delivery Address</span>
                      {!address ? (
                        <i className="material-icons red-text form-notification">error</i>
                      ) : (
                        <i className="material-icons green-text form-notification">check_circle</i>
                      )}
                      <i className="material-icons">keyboard_arrow_down</i>
                    </div>
                    <div className="collapsible-body white p-4">
                      <div className="row">
                        <div className="col s12">
                          <div className="input-field m-0">
                            <select id="address" className="text-grey validate grey-text text-darken-2" value={address} onChange={e => setAddress(e.target.value)} required>
                              <option value="" disabled>Select an address</option>
                              {user && (
                                user.addresses.map(address => (
                                  <option key={address.id} value={address.id}>{address.address}</option>
                                ))
                              )}
                            </select>
                            <Link to="/profile" className="title green-text">Add a new address to your account</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
                <div className="row">
                  <h5>Order</h5>
                  <form className="pb-5">
                    <ul className="collection">
                      {currentOrder !== null && (
                        currentOrder.order_items !== undefined && (
                          currentOrder.order_items.map(orderItem => (
                            <li key={orderItem.id} className={`collection-item avatar pr-5 relative ${orderItem.final_stock < 1 ? 'grey lighten-3 grey-text text-lighten-1' : ''}`}>
                              <div className="grey lighten-2 circle bg-cover" style={{ backgroundImage: `url(${orderItem.thumbnail})` }}></div>
                              <p className="title">{orderItem.product.name} - {orderItem.product_variant.name}</p>

                              <div className="product-quantity flex-row middle">
                                <div
                                  className={`decrease-quantity flex-col center middle ${orderItem.quantity > 1 && orderItem.final_stock > 0 ? '' : 'disabled grey lighten-3 grey-text text-lighten-1'}`}
                                  onClick={orderItem.quantity > 1 && !quantityLoading ? (() => changeQuantity({ orderItemID: orderItem.id, operation: 'subtract' })) : undefined}
                                >
                                  <i className="material-icons fs-15 fw-6">remove</i>
                                </div>
                                <div className="flex-col center middle quantity">{orderItem.quantity}</div>
                                <div
                                  className={`increase-quantity flex-col center middle ${orderItem.quantity < 10 && orderItem.quantity < orderItem.final_stock ? '' : 'disabled grey lighten-3 grey-text text-lighten-1'}`}
                                  onClick={orderItem.quantity < 10 && orderItem.quantity < orderItem.final_stock && !quantityLoading ? (() => changeQuantity({ orderItemID: orderItem.id, operation: 'add' })) : undefined}
                                >
                                  <i className="material-icons fs-15 fw-6">add</i>
                                </div>
                              </div>

                              <p className="fw-4">{orderItem.quantity} x ₱ {orderItem.product_variant.final_price.toFixed(2)}</p>
                              <p className="title">₱ {orderItem.total_price.toFixed(2)}</p>
                              <div className={`secondary-content delete-icon waves-effect ${currentOrder.order_items.length < 2 && 'modal-close'}`} onClick={() => deleteOrderItem({ id:orderItem.id })}>
                                <i className="material-icons red-text">delete_forever</i>
                              </div>
                              {orderItem.final_stock < 1 && (
                                <div className="out-of-stock-overlay flex-col middle center">
                                  <span className="grey-text text-darken-1 fs-22">OUT OF STOCK</span>
                                </div>
                              )}
                            </li>
                          ))
                        )
                      )}
                    </ul>
                    <div className="card transparent summary no-shadow mt-3 mb-0">
                      <div className="card-content">
                        <Link to="/food" className="title green-text">Add more items...</Link>
                      </div>
                    </div>
                    <div className="card transparent summary no-shadow mt-2 mb-0">
                      <div className="card-content">
                        <p className="title">Subtotal</p>
                        <p className="secondary-content grey-text text-darken-2 larger">₱ {currentOrder.subtotal.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="card transparent summary no-shadow">
                      <div className="card-content">
                        <p className="title">Delivery</p>
                        <p className="secondary-content grey-text text-darken-2">{delivery ? `₱ ${delivery.toFixed(2)}` : '-'}</p>
                      </div>
                    </div>
                    <button className="modal-close btn btn-extended btn-large green mt-5 mobile-btn relative"
                      disabled={currentOrder.count < 1 || address === '' || typeof(delivery) === NaN || !lastName || !firstName || !contact || !email || !gender ? true : false}
                      onClick={proceedToPayments}
                    >
                      <span className="btn-float-text">{!currentOrderLoading && address ? `₱${(parseInt(currentOrder.subtotal)+parseInt(delivery)).toFixed(2)}` : ''}</span>
                      {currentOrder.count < 1 ? 'No items to checkout' : (address === '' || typeof(delivery) === NaN || !lastName || !firstName || !contact || !email || !gender ? 'Provide details above' : 'Checkout')}
                    </button>
                  </form>
                </div>
              </Fragment>
            ) : (
              <div className="row mt-5">
                <div className="col s12 center flex-col">
                  <h3 className="text-mute no-item-default col center">You have no items in your cart</h3>
                  <Link to="/shop" className="btn btn-large amber">Go to Store</Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    )
  )
}

Cart.propTypes = {
  getCurrentOrder: PropTypes.func.isRequired,
  getAddress: PropTypes.func.isRequired,
  changeQuantity: PropTypes.func.isRequired,
  checkout: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  logistics: state.logistics,
  siteConfig: state.siteConfig
});

export default connect(mapStateToProps, { getCurrentOrder, deleteOrderItem, checkout, getAddress, changeQuantity })(Cart);