import React from 'react'
import { HashLink as Link } from 'react-router-hash-link';

const HighlightItem = ({ highlightitem }) => {
  return (
    <li className="best-seller-product col">
      <Link to={`/shop/product?p=${highlightitem.id}`}>
        <div className="best-seller-product-thumbnail" style={{ background: `url('${highlightitem.thumbnail}') no-repeat center center/cover` }} >
        </div>
      </Link>
      <div className="best-seller-product-info">
        <Link to={`/shop/product?p=${highlightitem.id}`} className="best-seller-product-name"><h5>{ highlightitem.name }</h5></Link>
        <small className="best-seller-product-seller">by <Link to={`/shop/seller?brand=${highlightitem.sid}`}>{ highlightitem.seller_name.slice(0, 12) }</Link></small>
        <p className="price">₱ { highlightitem.price }</p>
      </div>
    </li>
  )
}

export default HighlightItem;