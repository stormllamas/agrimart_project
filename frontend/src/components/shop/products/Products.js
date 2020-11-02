import React, { Fragment, useEffect, useState } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';

import { setProductsPage, clearCategory, clearSeller, updateQuery, getProducts, setCategory, setSeller, setKeywords, clearKeywords } from '../../../actions/logistics';
import { getFilterDetails } from '../../../actions/logistics';
import Preloader from '../../common/Preloader'
import ProductItem from './ProductItem'

const Products = ({ 
  logistics: {
    filterDetailsLoading,
    categoryGroups, sellers,

    productsLoading, moreProductsLoading,
    products,

    categoryFilter, sellerFilter, keywordsFilter
  },
  getProducts, getFilterDetails, 

  setProductsPage, updateQuery,
  clearCategory, setCategory,
  clearSeller, setSeller,
  clearKeywords, setKeywords,
}) => {
  const history = useHistory()
  const query = new URLSearchParams(history.location.search);

  const [search, setSearch] = useState('');

  const [categoryToggled, setCategoryToggled] = useState(false);
  const [sellerToggled, setSellerToggled] = useState(false);


  useEffect(() => {
    if (!filterDetailsLoading) {
      $('.collapsible').collapsible({
        accordion: false
      });
    }
  }, [filterDetailsLoading]);

  useEffect(() => {
    const keywordsQuery = query.get('keywords')
    const categoryQuery = query.get('category')
    const brandQuery = query.get('brand')
    const setQuery = (query, filter, set) => {
      query.split('--').forEach(q => {
        if (!filter.includes(q)) {
          set(q, true);
        }
      })
    }

    if (keywordsQuery) {
      setSearch(keywordsQuery)
      setKeywords(keywordsQuery)
    } else {
      clearKeywords();
    }
    if (categoryQuery) {
      categoryToggled === false && setCategoryToggled(true);
      setQuery(categoryQuery, categoryFilter, setCategory)
    } else {
      categoryToggled === true && setCategoryToggled(false);
      clearCategory();
    }
    if (brandQuery) {
      sellerToggled === false && setSellerToggled(true);
      setQuery(brandQuery, sellerFilter, setSeller)
    } else {
      sellerToggled === true && setSellerToggled(false);
      clearSeller();
    }
    getFilterDetails();
  }, []);

  useEffect(() => {
    getProducts({ getMore: false });
  }, [categoryFilter, sellerFilter, keywordsFilter]);

  
  useEffect(() => {
    if (!productsLoading) {
      $('.loader').fadeOut();
    } else {
      $('.loader').fadeIn();
    }
  }, [productsLoading]);

  const onSubmit = e => {
    e.preventDefault();
    setKeywords(search),
    setProductsPage(1),
    updateQuery(history);
  }
  
  return (
    <Fragment>
      <section className="section section-products">
        <div className="container">
          <div className="row">
            <div className="col l3 hide-on-med-and-down">
              {!productsLoading ? (
                <h5 className="mb-3">Results({products.count})</h5>
              ) : (
                <h5 className="mb-3">Results(0)</h5>
              )}
              <h6>Filter Results</h6>
              <ul className="collapsible">
                {!filterDetailsLoading && (
                  <Fragment>
                    {categoryGroups.map(categoryGroup => (
                      <li key={categoryGroup.id} className="active">
                        <div className="collapsible-header relative">
                          <span className="main-title uppercase">{ categoryGroup.name }</span>
                          <i className="material-icons">keyboard_arrow_down</i>
                        </div>
                        <div className="collapsible-body grey lighten-4">
                          {categoryGroup.categories.map(category => (
                            <p key={category.id} className="mb-1">
                              <label>
                                <input type="checkbox" id={ category.name } name={`${ category.name }`} className="filled-in" 
                                  onChange={e => {
                                    setCategory(category.name, e.target.checked),
                                    updateQuery(history)
                                  }}
                                  checked={categoryFilter.includes(category.name) && true}
                                />
                                  <span>{ category.name }</span>
                              </label>
                            </p>
                          ))}
                        </div>
                      </li>
                    ))}
                  
                    <li>
                      <div className="collapsible-header relative">
                        <span className="main-title">Brands</span>
                        <i className="material-icons">keyboard_arrow_down</i>
                      </div>
                      <div className="collapsible-body grey lighten-4">
                        {sellers.map(seller => (
                          <p key={seller.id} className="mb-1">
                            <label>
                              <input type="checkbox" id={ seller.name } name={`${ seller.name }`} className="filled-in" 
                                onChange={e => {
                                  setSeller(seller.name, e.target.checked),
                                  setProductsPage(1),
                                  updateQuery(history)
                                }}
                                checked={sellerFilter.includes(seller.name) && true}
                              />
                              <span>{ seller.name }</span>
                            </label>
                          </p>
                        ))}
                      </div>
                    </li>
                  </Fragment>
                )}
              </ul>
            </div>
            <div className="col s12 m12 l9">
              <div className="row m-0 valign-wrapper">
                <div className="col s11 m11 l6 p-0">
                  <form noValidate onSubmit={onSubmit}>
                    <div className="input-field grey-text m-0">
                      <i className="material-icons prefix">search</i>
                      <input type="text" name="keywords" rows="1" placeholder="Search" value={search} maxLength="150" id="id_keywords" onChange={e => setSearch(e.target.value)} required/>
                    </div>
                  </form>
                </div>
                <div className="col s1 m1 l6 p-0 flex-row right-middle full-height">
                  <a href="#" data-target="product-filter-nav" className="sidenav-trigger show-on-medium-and-down grey-text m-3">
                    <i className="material-icons">filter_alt</i>
                  </a>
                </div>
              </div>
              <div className="row">
                {!productsLoading ? (
                  products.count > 0 ? (
                    <ul className="product-list">
                      {products.results.map((product, index) => <ProductItem key={product.id} product={product} products={products} index={index} moreProductsLoading={moreProductsLoading} next={products.next} />)}
                      {moreProductsLoading && (
                        <div className="flex-col center relative preloader-wrapper">
                          <Preloader color="green" size="small" adds=""/>
                        </div>
                      )}
                    </ul>
                  ):(
                    <div className="col middle center full-width">
                      <h3 className="text-mute no-item-default grey-text">No Results</h3>
                    </div>
                  )
                ) : undefined}
              </div>
            </div>
          </div>
          <ul id="product-filter-nav" className="sidenav p-5">
            <ul className="collapsible">
              {!filterDetailsLoading && (
                <Fragment>
                  {categoryGroups.map(categoryGroup => (
                    <li key={categoryGroup.id} className="active white">
                      <div className="collapsible-header relative">
                        <span className="main-title uppercase">{ categoryGroup.name }</span>
                        <i className="material-icons">keyboard_arrow_down</i>
                      </div>
                      <div className="collapsible-body white">
                        {categoryGroup.categories.map(category => (
                          <p key={category.id} className="mb-1">
                            <label>
                              <input type="checkbox" id={ category.name } name={`${ category.name }`} className="filled-in" 
                                onChange={e => {
                                  setCategory(category.name, e.target.checked),
                                  updateQuery(history)
                                }}
                                checked={categoryFilter.includes(category.name) && true}
                              />
                                <span>{ category.name }</span>
                            </label>
                          </p>
                        ))}
                      </div>
                    </li>
                  ))}
                
                  <li className="active white">
                    <div className="collapsible-header relative">
                      <span className="main-title">Brands</span>
                      <i className="material-icons">keyboard_arrow_down</i>
                    </div>
                    <div className="collapsible-body white">
                      {sellers.map(seller => (
                        <p key={seller.id} className="mb-1">
                          <label>
                            <input type="checkbox" id={ seller.name } name={`${ seller.name }`} className="filled-in" 
                              onChange={e => {
                                setSeller(seller.name, e.target.checked),
                                setProductsPage(1),
                                updateQuery(history)
                              }}
                              checked={sellerFilter.includes(seller.name) && true}
                            />
                            <span>{ seller.name }</span>
                          </label>
                        </p>
                      ))}
                    </div>
                  </li>
                </Fragment>
              )}
            </ul>
          </ul>
        </div>
      </section>
    </Fragment>
  )
}

Products.propTypes = {
  getFilterDetails: PropTypes.func.isRequired,
  getProducts: PropTypes.func.isRequired,

  setProductsPage: PropTypes.func.isRequired,
  clearCategory: PropTypes.func.isRequired,
  clearSeller: PropTypes.func.isRequired,
  updateQuery: PropTypes.func.isRequired,
  setCategory: PropTypes.func.isRequired,
  setSeller: PropTypes.func.isRequired,
  setKeywords: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  products: state.products,
  logistics: state.logistics,
});

export default connect(mapStateToProps, { getFilterDetails, setProductsPage, clearCategory, clearSeller, clearKeywords, updateQuery, getProducts, setCategory, setSeller, setKeywords })(Products);
