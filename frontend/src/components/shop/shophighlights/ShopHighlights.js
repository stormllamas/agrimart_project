import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types'
import { HashLink as Link } from 'react-router-hash-link';
import { useHistory } from 'react-router-dom';

import Preloader from '../../layout/Preloader';

import { connect } from 'react-redux';
import { getHighlightsData, getFilterDetails } from '../../../actions/logistics';
import HighlightItem from './HighlightItem';

const ShopHighlights = ({
  logistics: { highlightsLoading, highlights, categoryGroups, sellers },
  siteConfig: { siteInfoLoading, siteInfo },
  getHighlightsData, getFilterDetails
}) => {
  const history = useHistory()
  let timer;

  useEffect(() => {
    getHighlightsData();
    getFilterDetails();
  // eslint-disable-next-line
  }, []); // This retriggers if same link is clicked
  
  return (
    <Fragment>
      <section className="section section-shop-highlights">
        <div className="row list-slider">
          <div className="container">
            <h5 className="center uppercase fw-6 mb-2">Best Selling Products</h5>
            <div className="divider mb-3"></div>
            <div className="flex-row">
              {!highlightsLoading ? (
                highlights.best_sellers.map(highlight => (
                  <Link key={highlight.id} to={`/shop/product?p=${highlight.name_to_url}`}>
                    <div className={`flex-col center mb-2 waves-effect waves-grey rad-2`}>
                      <div to="/" className="list-img bg-cover rad-2 grey" style={{ backgroundImage: `url(${highlight.thumbnail})` }}></div>
                      <div to="/" className={`grey-text mt-1`}>{highlight.name}</div>
                    </div>
                  </Link>
                ))
              ) : undefined}
            </div>
          </div>
        </div>
        <div className="container">
          <div className="highlight-banner">
            <div className="row mt-5">
              <div className="col s12 highlight-banner p-0 pt-2 pb-2" style={{
                backgroundImage: `url("/static/frontend/img/OPA_Banner.jpg")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
                backgroundSize: 'cover'
              }}>
                <div className="full-width full-height relative">
                  <div className="banner-overlay flex-col center middle">
                    <Link to="/shop/products"className="btn btn-large">
                      Shop Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {!siteInfoLoading ? (
            <Fragment>
              {siteInfo.highlight_1 && siteInfo.highlight_2 || siteInfo.highlight_3 && siteInfo.highlight_4 || siteInfo.highlight_5 && siteInfo.highlight_6 ? (
                <div className="row-3">
                  <div className="month-highlights-title col center middle">
                    <h2>This Months Highlights</h2>
                  </div>
                  <div className="month-highlights">
                    {siteInfo.highlight_1 && siteInfo.highlight_2 ? (
                      <Fragment>
                        <div className="month-highlight-thumbnail" style={{background: `url('${ siteInfo.highlight_1 }') no-repeat center center/cover`}}>
                        </div>
                        <div className="month-highlight-thumbnail" style={{background: `url('${ siteInfo.highlight_2 }') no-repeat center center/cover`}}>
                        </div>
                      </Fragment>
                    ): undefined}
                    {siteInfo.highlight_3 && siteInfo.highlight_4 ? (
                      <Fragment>
                        <div className="month-highlight-thumbnail" style={{background: `url('${ siteInfo.highlight_3 }') no-repeat center center/cover`}}>
                        </div>
                        <div className="month-highlight-thumbnail" style={{background: `url('${ siteInfo.highlight_4 }') no-repeat center center/cover`}}>
                        </div>
                      </Fragment>
                    ): undefined}
                    {siteInfo.highlight_5 && siteInfo.highlight_6 ? (
                      <Fragment>
                        <div className="month-highlight-thumbnail" style={{background: `url('${ siteInfo.highlight_5 }') no-repeat center center/cover`}}>
                        </div>
                        <div className="month-highlight-thumbnail" style={{background: `url('${ siteInfo.highlight_6 }') no-repeat center center/cover`}}>
                        </div>
                      </Fragment>
                    ): undefined}
                  </div>
                </div>
              ): undefined}

              <div className="row center">
                <div className="col s12 p-4">
                  <h4>{ siteInfo.shop_spiel_title }</h4>
                  <p className="linebreak fw-2">{ siteInfo.shop_spiel_text }</p>
                </div>
              </div>

              <div className="row">
                <div className="col s12 m12 l6">
                  <h5>Our Brands</h5>
                  <ul className="row">
                    {sellers.map(seller => (
                      <div key={seller.id} className="col s6 pt-1 pb-1">
                        <li>
                          <Link to={`/shop/products?&brand=${seller.name}`}>{ seller.name }</Link>
                        </li>
                      </div>
                    ))}
                  </ul>
                </div>
                <div className="col s12 m12 l6">
                  <h5 className="top-categories-title">Top Categories/Commodity Bases</h5>
                  <ul className="top-categories-list">
                    {categoryGroups.map(categoryGroup => (
                      categoryGroup.categories.map(category => (
                        <div key={category.id} className="col s6 m4 l4 pt-1 pb-1">
                          <li><Link to={`/shop/products?&commodity=${category.name}`}>{ category.name }</Link></li>
                        </div>
                      ))
                    ))}
                    {/* {commodities.map(commodity => (
                      <li key={commodity.id}><Link to={`/shop/products?&commodity=${commodity.name}`}>{ commodity.name }</Link></li>
                    ))}
                    {categories.map(category => (
                      <li key={category.id}><Link to={`/shop/products?&category=${category.name}`}>{ category.name }</Link></li>
                    ))} */}
                  </ul>
                </div>
              </div>
            </Fragment>
          ) : undefined}
        </div>
      </section>
    </Fragment>
  )
}

ShopHighlights.propTypes = {
  getHighlightsData: PropTypes.func.isRequired,
  getFilterDetails: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  logistics: state.logistics,
  siteConfig: state.siteConfig,
});

export default connect(mapStateToProps, { getHighlightsData, getFilterDetails })(ShopHighlights);
