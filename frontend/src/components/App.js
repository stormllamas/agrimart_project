import React, { Fragment, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../store';

import AccountsRoute from './common/AccountsRoute';
import PrivateRoute from './common/PrivateRoute';
import PublicRoute from './common/PublicRoute';
import AdminRoute from './common/AdminRoute';

import Preloader from './common/Preloader';
import SiteMessage from './layout/SiteMessage';

import Signup from './accounts/Signup';
import Activate from './accounts/Activate';
import ConfirmEmail from './accounts/ConfirmEmail';
import Login from './accounts/Login';

import PasswordReset from './accounts/passwordReset/PasswordReset';
import PasswordResetPrompt from './accounts/passwordReset/PasswordResetPrompt';
import PasswordResetForm from './accounts/passwordReset/PasswordResetForm';

import Profile from './accounts/Profile';
import ChangePassword from './accounts/ChangePassword';

import Cart from './shopping/Cart';
import Favorites from './shopping/favorites/Favorites';
import Orders from './shopping/orders/Orders';
import Payments from './shopping/Payments';

import ProductReview from './review/ProductReview'
import OrderReview from './review/OrderReview'
import RequestRefund from './shopping/RequestRefund';

// import OrderManager from './manager/OrderManager';
// import RecentlyDelivered from './manager/RecentlyDelivered';
// import RefundRequests from './manager/RefundRequests';
// import ApprovedRefunds from './manager/ApprovedRefunds';
// import ResolvedRefunds from './manager/ResolvedRefunds';
import AdminDashboard from './manager/AdminDashboard'
import Unclaimed from './manager/Unclaimed'
import Claimed from './manager/Claimed'
import Undelivered from './manager/Undelivered'
import Delivered from './manager/Delivered'

import Home from './pages/Home';
import Testimonies from './pages/testimonies/Testimonies';
import Article from './pages/testimonies/Article';
import Events from './pages/Events';
import Services from './pages/Services';
import Contact from './pages/Contact';
import About from './pages/About';
import ShopHighlights from './shop/shophighlights/ShopHighlights';
import Products from './shop/products/Products';
import Product from './shop/products/Product';
import Seller from './seller/Seller';

import Page404 from './common/Page404';

import { loadUser } from '../actions/auth'
import { loadSite } from '../actions/siteConfig'

const App = () => {

  useEffect(() => {
    $('#middle-content').hide();
    $('.loader').show();
    store.dispatch(loadUser());
    store.dispatch(loadSite());
  });

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Switch>
            <AccountsRoute exact path="/login" component={Login} />
            <AccountsRoute exact path="/signup" component={Signup} />
            <PublicRoute exact path="/confirm_email/:email" component={ConfirmEmail} />
            <Route exact path="/activate/:uidb64/:token" component={Activate} />

            <PublicRoute exact path="/" component={Home} />
            <PublicRoute exact path="/testimonies" component={Testimonies} />
            <PublicRoute exact path="/read" component={Article} />
            <PublicRoute exact path="/events" component={Events} />
            <PublicRoute exact path="/services" component={Services} />
            <PrivateRoute exact path="/contact" component={Contact} />
            <PublicRoute exact path="/about" component={About} />

            <PrivateRoute exact path="/profile" component={Profile} />
            <PrivateRoute exact path="/change_password" component={ChangePassword} />

            <PublicRoute exact path="/password_reset" component={PasswordReset} />
            <PublicRoute exact path="/check_email/:email" component={PasswordResetPrompt} />
            <PublicRoute exact path="/password_reset_form/:uidb64/:token" component={PasswordResetForm} />

            <PublicRoute exact path="/shop" component={ShopHighlights} />
            <PublicRoute exact path="/shop/products" component={Products} />
            <PublicRoute exact path="/shop/product" component={Product} />
            <PublicRoute exact path="/seller" component={Seller} />

            <PrivateRoute exact path="/cart" component={Cart} />
            <PrivateRoute exact path="/payments" component={Payments} />
            <PrivateRoute exact path="/favorites" component={Favorites} />
            <PrivateRoute exact path="/orders" component={Orders} />

            <PrivateRoute exact path="/product_review/:order_item_id" component={ProductReview} />
            <PrivateRoute exact path="/order_review/:order_id" component={OrderReview} />

            <PrivateRoute exact path="/request_refund" component={RequestRefund} />

            {/* <PrivateRoute exact path="/manager/order_manager" component={OrderManager} />
            <PrivateRoute exact path="/manager/recently_delivered" component={RecentlyDelivered} />
            <PrivateRoute exact path="/manager/refund_requests" component={RefundRequests} />
            <PrivateRoute exact path="/manager/approved_refunds" component={ApprovedRefunds} />
            <PrivateRoute exact path="/manager/resolved_refunds" component={ResolvedRefunds} /> */}
            <AdminRoute exact path="/order_manager/dashboard" component={AdminDashboard} />
            <AdminRoute exact path="/order_manager/unclaimed" component={Unclaimed} />
            <AdminRoute exact path="/order_manager/claimed" component={Claimed} />
            <AdminRoute exact path="/order_manager/undelivered" component={Undelivered} />
            <AdminRoute exact path="/order_manager/delivered" component={Delivered} />
            <Route component={Page404} />
          </Switch>
        </Fragment>
      </Router>
      <Preloader color="green" size="big" adds="fixed"/>
    </Provider>
  );
}
ReactDOM.render(<App />, document.getElementById('agrimart'))