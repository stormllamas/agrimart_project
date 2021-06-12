import React, { Fragment, useEffect, useState } from 'react'
import { HashLink as Link } from 'react-router-hash-link';
import { Redirect, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

import { getProduct, toggleFavorite, addOrderItem } from '../../../actions/logistics';

const Products = ({
  logistics: {
    productLoading,
    product,
    currentOrderLoading,
  },
  auth: { isAuthenticated, userLoading },
  getProduct,
  toggleFavorite, addOrderItem
}) => {
  const history = useHistory()
  const query = new URLSearchParams(history.location.search);

  const [selectedVariant, setSelectedVariant] = useState('')

  const addToOrder = (e) => {
    e.preventDefault();
    if (selectedVariant !== '') {
      addOrderItem({
        productId: selectedVariant,
      })
    } else {
      M.toast({
        html: 'Please select a product',
        displayLength: 3500,
        classes: 'red'
      });
    }
  }
  
  useEffect(() => {
    const productQuery = query.get('p')
    const sellerQuery = query.get('b')
    getProduct({
      productQuery,
      sellerQuery
    })
  }, []);

  useEffect(() => {
    if (!productLoading) {
      $('.loader').fadeOut();
      $('.middle-content').fadeIn();
      $('.materialboxed').materialbox();
      $('.modal').modal({
        dismissible: true,
        inDuration: 300,
        outDuration: 200,
      });
    } else {
      $('.loader').show();
    }
  }, [productLoading]);

  return (
    <Fragment>
      <section className="section section-product mb-5">
        <div className="container">
          {!productLoading ? (
            product !== null ? (
              <Fragment>
                <div className="row">
                  <div className="col s12 m12 l7">
                    <div className="row">
                      <div className="col s12">
                        <img className="responsive-img" src={product.thumbnail}/>
                      </div>
                    </div>
                    <div className="row">
                      {product.photo_1 && (
                        <div className="materialboxed col s3">
                          <img className="responsive-img" src={product.photo_1}/>
                        </div>
                      )}
                      {product.photo_2 && (
                        <div className="materialboxed col s3">
                          <img className="responsive-img" src={product.photo_2}/>
                        </div>
                      )}
                      {product.photo_3 && (
                        <div className="materialboxed col s3">
                          <img className="responsive-img" src={product.photo_3}/>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col s12 m12 l5">
                    <div className="pt-2">
                      <h5>{product.name}</h5>
                      <p className="mt-1"><Link to={`/seller?brand=${product.seller.name_to_url}`} className="grey-text text-darken-1">by {product.seller.name}</Link></p>
                      <div className="mb-5">
                        {product.review_count > 0 ? [...Array(product.total_rating).keys()].map(star => <i key={star} className="fas fa-star amber-text fs-22 mr-1"></i>) : <span className="m-0 grey lighten-2 rad-2 p-2">No Rating</span>}
                        {product.review_count > 0 && [...Array(Math.max(5-product.total_rating, 0)).keys()].map(star => <i key={star} className="fas fa-star grey-text text-lighten-3 fs-24 mr-1"></i>)}
                      </div>
                      {isAuthenticated ? (
                        product.variants.length > 0 && !currentOrderLoading && (
                          <form method="POST" className="mt-2">
                            {product.variants.map((variant, index) => (
                              <Fragment key={variant.id}>
                                <p className="flex-row separate">
                                  <label>
                                    <input className="with-gap green-text" name="group1" type="radio" value={variant.id} onChange={e => setSelectedVariant(e.target.value)} required/>
                                    <span className="grey-text text-darken-2">{variant.name}</span>
                                  </label>
                                  {variant.sale_price_active ? (
                                    <span className="grey-text text-darken-2 right no-white-space ml-2"><span className="grey-text">₱ { variant.price }</span><span className="grey-text">-{ variant.percent_off }%</span><span className="ml-1 fs-16">₱ {variant.final_price.toFixed(2)}</span></span>
                                  ) : (
                                    <span className="grey-text text-darken-2 right no-white-space ml-2">₱ {variant.final_price}</span>
                                  )}
                                </p>
                                <div className="divider"></div>
                              </Fragment>
                            ))}
                            <button className="btn btn-full btn-large light-green darken-2 mt-5" onClick={e => addToOrder(e)}>
                              Add To Order
                            </button>
                          </form>
                        )
                      ) : (
                        <div className="full-width center">
                          <Link to="/login" className="btn btn-large light-green darken-2 mt-5">Log in to Order</Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="divider"></div>
                </div>
                <div className="row">
                  <div className="col s12">
                    <h5>Description</h5>
                    <p className="linebreak">{product.description}</p>
                  </div>
                </div>
                {/* {similarProducts.length > 0 && (
                  <div className="similar-products col center middle">
                    <div className="similar-products-title col center middle">
                      <h2>Similar Products</h2>
                      <hr/>
                    </div>
                    <ul className="similar-products-list row">
                      {similarProducts.map(sim => (
                        <div key={sim.id} className="similar-product-item col">
                          <Link to={`/shop/product?p=${sim.id}`} >
                            <div className="similar-product-thumbnail" style={{background: `url('${ sim.thumbnail }') no-repeat center center/cover`}} ></div>
                          </Link>
                          <div className="similar-product-info">
                            <h5><Link to={`/shop/product?p=${sim.id}`}>{ sim.name }</Link></h5>
                            <small>by <Link to={`/shop/seller?brand=${sim.sid}`}>{ sim.seller_name.slice(0,18) }</Link></small>
                            <p className="price">₱ { sim.price }</p>
                          </div>
                        </div>
                      ))}
                    </ul>
                  </div>
                )} */}
              </Fragment>
            ) : (
              <div className="product row">
                <div className="product-visuals">
                  <div className="product-thumbnail col middle"><h1 className="text-center no-item-default white">Product Not Found</h1></div>
                </div>
              </div>
            )
          ): undefined}
        </div>
      </section>
    </Fragment>
  )
}

Products.propTypes = {
  getProduct: PropTypes.func.isRequired,
  toggleFavorite: PropTypes.func.isRequired,
  addOrderItem: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  logistics: state.logistics,
  auth: state.auth,
});

export default connect(mapStateToProps, { getProduct, toggleFavorite, addOrderItem })(Products);
