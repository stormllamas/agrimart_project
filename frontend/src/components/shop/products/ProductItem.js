import React, { useRef, useCallback, Fragment } from 'react';
import { HashLink as Link } from 'react-router-hash-link';

import { connect } from 'react-redux';
import { getProducts } from '../../../actions/logistics';

const ProductItem = ({ moreProductsLoading, next, product, products, index, getProducts }) => {
  const observer = useRef();
  const lastProductElement = useCallback(el => {
    if (moreProductsLoading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && next !== null && !moreProductsLoading ) {
        getProducts({ getMore: true });
      }
    })
    if (el) observer.current.observe(el)
  }, [moreProductsLoading, next]);

  return (
    <Fragment>
      <div className="col s6 m6 l4" ref={products.results.length === index + 1 ? lastProductElement : undefined }>
        <div className="card small">
          <div className="card-image valign-wrapper">
            <Link to={`/shop/product?p=${product.name_to_url}&b=${product.seller.name_to_url}`}><img src={product.thumbnail}/></Link>
          </div>
          <div className="card-content">
          <p className="fs-16 lh-4"><Link to={`/shop/product?p=${product.name_to_url}&b=${product.seller.name_to_url}`}>{ product.name.slice(0, 35) }</Link></p>
          </div>
          <div className="card-action">
            <div className="col s12 m6 l6 p-0 mb-2">
              {product.review_count > 0 ? [...Array(product.total_rating).keys()].map(star => <i key={star} className="fas fa-star amber-text"></i>) : <p className="m-0">No Rating</p>}
              {product.review_count > 0 && [...Array(Math.max(5-product.total_rating, 0)).keys()].map(star => <i key={star} className="fas fa-star grey-text text-lighten-3"></i>)}
            </div>
            <div  className="col s12 m6 l6 p-0 flex-col end">
              {product.cheapest_variant.sale_price_active && (
                <div className="flex-row middle grey-text">
                  <p className="sale mr-1 m-0 fs-13 lh-2">₱ { product.cheapest_variant.price } </p>
                  <p className="lh-2 m-0">-{ product.cheapest_variant.percent_off }%</p>
                </div>
              )}
              <p className="m-0">
                ₱ { product.cheapest_variant.final_price.toFixed(2) }
              </p>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default connect(null, { getProducts })(ProductItem);