import React, { Fragment, useEffect, useState } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom';

import { connect } from 'react-redux';
import { getSeller, getSellerProducts } from '../../actions/logistics';
import Preloader from '../common/Preloader'
import SellerProduct from './SellerProduct'
import ProductItem from '../shop/products/ProductItem'

const SellerDetails = ({
  logistics: {
    seller,
    sellerLoading,

    sellerProductsLoading,
    sellerProducts,
    moreSellerProductsLoading,
  },
  getSeller, getSellerProducts
}) => {
  const history = useHistory()
  const query = new URLSearchParams(history.location.search);

  useEffect(() => {
    const sellerQuery = query.get('brand')
    getSeller(sellerQuery)
    getSellerProducts({ sellerName: sellerQuery })
  }, []);

  useEffect(() => {
    if (!sellerLoading && !sellerProductsLoading) {
      $('.loader').fadeOut()
      $('.tabs').tabs();
    } else {
      $('.loader').fadeIn()
    }
  }, [sellerLoading, sellerProductsLoading]);

  
  return (
    <Fragment>
      <section className="section section-seller">
        <div className="container">
          {!sellerLoading && !sellerProductsLoading ? (
            !seller !== null ? (
              <Fragment>
                <div className="row">
                  <div className="col s12">
                    <div className="seller-header" style={{background: `url('${ seller.thumbnail }') no-repeat center center/cover`}}></div>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col s12">
                    <ul className="tabs">
                      <li className="tab col s6">
                        <a href="#tab-products">Seller Products</a>
                      </li>
                      <li className="tab col s6">
                        <a href="#tab-details">Seller Details</a>
                      </li>
                    </ul>
                  </div>

                  <div id="tab-products" className="col s12">
                    <h4>{ seller.name }</h4>
                    <div className="row">
                      <div className="col s12">
                        <ul className="product-list">
                          {sellerProducts.results.map((product, index) => <SellerProduct key={product.id} product={product} sellerProducts={sellerProducts} index={index} moreSellerProductsLoading={moreSellerProductsLoading} next={sellerProducts.next} />)}
                          {moreSellerProductsLoading && (
                            <div className="flex-col center relative preloader-wrapper">
                              <Preloader color="green" size="small" adds=""/>
                            </div>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div id="tab-details" className="col s12">
                    <h4>{ seller.name }</h4>
                    <div className="row">
                      <div className="col s12 m6 l6">
                        <h5 className="valign-wrapper"><i className="material-icons mr-2">location_on</i>Store Location</h5>
                        <p>{ seller.address }</p>
                      </div>
                      <div className="col s12 m6 l6">
                        <h5 className="valign-wrapper"><i className="material-icons mr-2">phone</i>Contact</h5>
                        <p>{ seller.contact }</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Fragment>
            ) : (
              <div className="seller-header col middle">
                <h1 className="text-center no-item-default white">Seller Not Found</h1>
              </div>
            )
          ) : undefined}
        </div>
      </section>
    </Fragment>
  )
}

SellerDetails.propTypes = {
  getSeller: PropTypes.func.isRequired,
  getSellerProducts: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  logistics: state.logistics,
});

export default connect(mapStateToProps, { getSeller, getSellerProducts })(SellerDetails);
