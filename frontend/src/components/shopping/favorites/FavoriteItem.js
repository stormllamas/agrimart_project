import React from 'react'
import { HashLink as Link } from 'react-router-hash-link';
import PropTypes from 'prop-types'

import { connect } from 'react-redux';
import { addOrderItem, deleteFavorite } from '../../../actions/logistics';

const FavoriteItem = ({ favorite, addOrderItem, deleteFavorite }) => {

  return (
    <li className={`card bordered row ${favorite.stock < 1 && 'out-of-stock'}`}>
      <div className="pic-desc row">
        <Link to={`/shop/product?p=${favorite.pid}`}>
          <div className="item-image" style={{ background: `url('${ favorite.thumbnail }') no-repeat center center/cover`}}>
            {favorite.stock < 11 && favorite.stock > 0 && <div className="stocks-alert bdg bdg-small bdg-alert">{ favorite.stock } items left!</div>}
          </div>
        </Link>
        <div className="item-description col">
          <h3><Link to={`/shop/product?p=${favorite.pid}`}>{ favorite.name }</Link></h3>
          <small>by <Link to={`/shop/seller?s=${favorite.seller_id}`}>{ favorite.seller_name }</Link></small>
          <p>{ favorite.description.substring(0,200) }</p>
          <div className="item-price-mobile">
            {favorite.sale_price_active === true && (
              <div className="sale row middle">
                <small>₱ { favorite.price.toFixed(2) }</small>
                <p>-{ favorite.percent_off }%</p>
              </div>
            )}
            <h2>₱ { favorite.final_price.toFixed(2) }</h2>
          </div>
        </div>
      </div>
      <div className="item-price col middle center">
        {favorite.sale_price_active === true && (
          <div className="sale row middle">
            <small>₱ { favorite.price.toFixed(2) }</small>
            <p>-{ favorite.percent_off }%</p>
          </div>
        )}
        <h2>₱ { favorite.final_price.toFixed(2) }</h2>
      </div>
      <div className="item-add-cart col center middle">
        {favorite.stock > 0 && (
          <button className="btn-green text-center row center middle">
            <i className="fas fa-plus"></i>
            <i className="fas fa-shopping-cart"></i>
            <div className="add-to-cart" onClick={() => addOrderItem(favorite.pid, 1)}></div>
          </button>
        )}
      </div>
      <button className="delete-order-item fas fa-trash" onClick={() => deleteFavorite(favorite.pid)}></button>
    </li>
  )
}

FavoriteItem.propTypes = {
  favorite: PropTypes.object.isRequired,
  addOrderItem: PropTypes.func.isRequired,
  deleteFavorite: PropTypes.func.isRequired,
}

export default connect(null, { addOrderItem, deleteFavorite })(FavoriteItem);