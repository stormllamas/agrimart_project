import React, { Fragment, useEffect } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types'

import Preloader from '../../layout/Preloader';
import AccountNav from '../../layout/AccountNav';
import FavoriteItem from './FavoriteItem';

import { connect } from 'react-redux';
import { getFavorites } from '../../../actions/logistics';

const Favorites = ({
  location,
  auth: { isAuthenticated, userLoading }, getFavorites,
  logistics: { favoritesLoading, favorites }
}) => {

  useEffect(() => {
    !userLoading && getFavorites();
  }, [userLoading, location.key]);

  if (!userLoading && !isAuthenticated) {
    return(<Redirect to='/' />)
  } else {

    return (
      <Fragment>
        {favoritesLoading ? <Preloader /> : undefined}
        <div className="account container row">
          <AccountNav />
            <section id="favorites" className="account-content">
              <ul className="breadcrumb row">
                <li className="breadcrumb-item active"><h1>Favorites</h1></li>
              </ul>
              <div className={`account-body ${favorites.length < 1 ? 'col middle' : ''}`}>
                {!favoritesLoading && (
                  <ul id="favorites-list">
                    {
                      favorites.length < 1 ? (
                        <h2 className="text-mute no-item-default col center">You have no Favorites
                          <Link to="/shop" id="go-to-store" className=" btn-gray-outline">Go to Store</Link>
                        </h2>
                      ) : (
                        favorites.map(favorite => <FavoriteItem key={favorite.id} favorite={favorite} />)
                      )
                    }
                  </ul>
                )}
              </div>
            </section>
        </div>
      </Fragment>
    )
  }
}

Favorites.propTypes = {
  getFavorites: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  logistics: state.logistics,
});

export default connect(mapStateToProps, { getFavorites })(Favorites);