import {
  GET_HIGHLIGHTS,
  
  GET_FILTER_DETAILS,

  SELLER_LOADING, 
  GET_SELLER,
  SELLER_ERROR,

  SELLER_PRODUCTS_LOADING, 
  GET_SELLER_PRODUCTS,
  SELLER_PRODUCTS_ERROR,
  MORE_SELLER_PRODUCTS_LOADING,
  GET_MORE_SELLER_PRODUCTS,
  SELLER_PRODUCTS_PAGE,
  
  PRODUCTS_LOADING,
  GET_PRODUCTS,
  PRODUCTS_ERROR,
  
  MORE_PRODUCTS_LOADING,
  GET_MORE_PRODUCTS,
  PRODUCTS_PAGE,
  
  PRODUCT_LOADING,
  GET_PRODUCT, PRODUCT_ERROR,
  
  FILTER_KEYWORDS, CLEAR_KEYWORDS,
  FILTER_CATEGORY, REMOVE_CATEGORY, CLEAR_CATEGORY,
  FILTER_SELLER, REMOVE_SELLER, CLEAR_SELLER,
  
  CURRENT_ORDER_LOADING, GET_CURRENT_ORDER,
  CURRENT_ORDER_ERROR,

  ORDERS_LOADING, MORE_ORDERS_LOADING,
  GET_ORDERS, ORDERS_ERROR,
  GET_MORE_ORDERS, SET_ORDERS_PAGE,
  FILTER_CURRENT_ONLY,

  ORDER_LOADING,
  GET_ORDER,
  ORDER_ERROR,
  REVIEW_ORDER,

  ORDER_ITEM_LOADING, GET_ORDER_ITEM,
  ORDER_ITEM_ERROR,
  REVIEW_PRODUCT,
  REVIEW_PRODUCT_ORDER,

  QUANTITY_LOADING,
  QUANTITY_CHANGED,
  QUANTITY_CHANGE_ERROR,
  
  DELETE_LOADING,
  DELETE_ORDER_ITEM,
  DELETE_ERROR,

  CHECKOUT_LOADING,
  CHECKOUT_SUCCESS,
  CHECKOUT_FAILED,

  COMPLETE_ORDER_LOADING,
  COMPLETE_ORDER_SUCCESS,
  COMPLETE_ORDER_FAILED,

  FAVORITES_LOADING, GET_FAVORITES, DELETE_FAVORITE,

} from '../actions/types'

const initialState = {
  highlightsLoading: true,
  highlights: [],

  filterDetailsLoading: true,
  categoryGroups: [],
  sellers: [],
  categories: [],

  sellerLoading: true,
  seller: null,
  sellerProductsLoading: true,
  sellerProducts: {results:[]},
  moreSellerProductsLoading: true,
  sellerProductsPage: 1,
  
  productsLoading: true,
  products: {results:[]},
  moreProductsLoading: true,
  productsPage: 1,
  categoryFilter: [],
  sellerFilter: [],
  keywordsFilter: '',
  
  productLoading: true,
  product: null,
  similarProducts: [],
  
  currentOrderLoading: true,
  currentOrder: null,

  ordersLoading: true,
  moreOrdersLoading: false,
  orders: {results:[]},
  ordersCurrentPage: 1,
  currentOnly: true,
  orderLoading: true,
  order: null,
  
  orderItemLoading: true,
  orderItem: null,

  quantityLoading: false,
  deleteLoading: false,

  checkoutLoading: false,
  completeOrderLoading: false,

  favoritesLoading: true,
  favorites: [],
}

export default (state = initialState, action) => {
  switch(action.type) {

    case GET_HIGHLIGHTS:
      return {
        ...state,
        highlights: action.payload,
        highlightsLoading: false,
      }


    case GET_FILTER_DETAILS:
      return {
        ...state,
        sellers: action.payload.sellers,
        categoryGroups: action.payload.category_groups,
        filterDetailsLoading: false,
      }


    case PRODUCTS_LOADING:
      return {
        ...state,
        productsLoading: true,
      }
    case GET_PRODUCTS:
      return {
        ...state,
        products: action.payload,
        productsLoading: false,
        moreProductsLoading: false,
      }
    case PRODUCTS_ERROR:
      return {
        ...state,
        products: null,
        productsLoading: false,
      }
    case MORE_PRODUCTS_LOADING:
      return {
        ...state,
        moreProductsLoading: true,
      }
    case GET_MORE_PRODUCTS:
      return {
        ...state,
        products: {
          ...action.payload,
          count: state.products.count + action.payload.count,
          results: [
            ...state.products.results,
            ...action.payload.results
          ],
        },
        moreProductsLoading: false,
      }
    case PRODUCTS_PAGE:
      return {
        ...state,
        productsPage: action.payload,
      }
    case FILTER_CATEGORY:
      return {
        ...state,
        categoryFilter: [
          ...state.categoryFilter,
          action.payload
        ],
        productsPage: 1
      }
    case REMOVE_CATEGORY:
      return {
        ...state,
        categoryFilter: state.categoryFilter.filter(category => category !== action.payload),
      }
    case CLEAR_CATEGORY:
      return {
        ...state,
        categoryFilter: [],
      }
    case FILTER_SELLER:
      return {
        ...state,
        sellerFilter: [
          ...state.sellerFilter,
          action.payload
        ],
        productsPage: 1
      }
    case REMOVE_SELLER:
      return {
        ...state,
        sellerFilter: state.sellerFilter.filter(seller => seller !== action.payload),
      }
    case CLEAR_SELLER:
      return {
        ...state,
        sellerFilter: [],
      }
    case FILTER_KEYWORDS:
      return {
        ...state,
        keywordsFilter: action.payload,
        productsPage: 1
      }
    case CLEAR_KEYWORDS:
      return {
        ...state,
        keywordsFilter: '',
      }


    case PRODUCT_LOADING:
      return {
        ...state,
        productLoading: true,
      }
    case GET_PRODUCT:
      return {
        ...state,
        product: action.payload,
        similarProducts: action.similar,
        productLoading: false,
        error: null,
      }
    case PRODUCT_ERROR:
      return {
        ...state,
        error: action.payload,
        productLoading: false,
      }


    case SELLER_LOADING:
      return {
        ...state,
        sellerLoading: true,
      }
    case GET_SELLER:
      return {
        ...state,
        seller: action.payload,
        sellerLoading: false
      }
    case SELLER_ERROR:
      return {
        ...state,
        seller: null,
        sellerLoading: false
      }
      

    case SELLER_PRODUCTS_LOADING:
      return {
        ...state,
        sellerProductsLoading: true,
      }
    case GET_SELLER_PRODUCTS:
      return {
        ...state,
        sellerProducts: action.payload,
        sellerProductsLoading: false,
        moreSellerProductsLoading: false,
      }
    case SELLER_PRODUCTS_ERROR:
      return {
        ...state,
        sellerProducts: null,
        sellerProductsLoading: false
      }
    case MORE_SELLER_PRODUCTS_LOADING:
      return {
        ...state,
        moreSellerProductsLoading: true,
      }
    case GET_MORE_SELLER_PRODUCTS:
      return {
        ...state,
        sellerProducts: {
          ...action.payload,
          count: state.sellerProducts.count + action.payload.count,
          results: [
            ...state.sellerProducts.results,
            ...action.payload.results
          ],
        },
        moreSellerProductsLoading: false,
      }
    case SELLER_PRODUCTS_PAGE:
      return {
        ...state,
        sellerProductsPage: action.payload,
      }


    case CURRENT_ORDER_LOADING:
      return {
        ...state,
        currentOrderLoading: true,
      }
    case GET_CURRENT_ORDER:
      return {
        ...state,
        currentOrder: action.payload,
        currentOrderLoading: false,
      }
    case CURRENT_ORDER_ERROR:
      return {
        ...state,
        currentOrderLoading: false,
        currentOrder: null
      }

    case ORDER_LOADING:
      return {
        ...state,
        orderLoading: true,
      }
    case GET_ORDER:
      return {
        ...state,
        orderLoading: false,
        order: action.payload
      }

    case ORDER_ERROR:
      return {
        ...state,
        orderLoading: false,
        order: null
      }


    case CHECKOUT_LOADING:
      return {
        ...state,
        checkoutLoading: true,
      }
    case CHECKOUT_SUCCESS:
      return {
        ...state,
        checkoutLoading: false,
        currentOrderLoading: true
      }

    case CHECKOUT_FAILED:
      return {
        ...state,
        checkoutLoading: false,
      }


    case COMPLETE_ORDER_LOADING:
      return {
        ...state,
        completeOrderLoading: true,
      }
    case COMPLETE_ORDER_SUCCESS:
      return {
        ...state,
        completeOrderLoading: false,
        currentOrderLoading: false
      }
    case COMPLETE_ORDER_FAILED:
      return {
        ...state,
        completeOrderLoading: false,
        currentOrderLoading: false
      }
      

    case QUANTITY_LOADING:
      return {
        ...state,
        quantityLoading: true,
      }
    case QUANTITY_CHANGED:
    case QUANTITY_CHANGE_ERROR:
      return {
        ...state,
        quantityLoading: false,
      }
    

    case DELETE_LOADING:
      return {
        ...state,
        deleteLoading: true,
      }
    case DELETE_ORDER_ITEM:
    case DELETE_ERROR:
      return {
        ...state,
        deleteLoading: false,
      }


    case FAVORITES_LOADING:
      return {
        ...state,
        favoritesLoading: true,
      }

    case ORDERS_LOADING:
      return {
        ...state,
        ordersLoading: true,
      }
      
    case GET_FAVORITES:
      return {
        ...state,
        favorites: action.payload,
        favoritesLoading: false,
      }
      
    case GET_ORDERS:
      return {
        ...state,
        orders: action.payload,
        ordersLoading: false,
      }
      
    case DELETE_FAVORITE:
      return {
        ...state,
        favorites: state.favorites.filter(favorite => favorite.pid !== action.payload),
        favoritesLoading: false,
      }
    
    case ORDER_ERROR:
      return {
        ...state,
        currentOrderLoading: false,
      }

    case ORDERS_LOADING:
      return {
        ...state,
        ordersLoading: true,
        ordersCurrentPage: 1
      }

    case FILTER_CURRENT_ONLY:
      return {
        ...state,
        currentOnly: action.payload,
      }

    case MORE_ORDERS_LOADING:
      return {
        ...state,
        moreOrdersLoading: true,
      }

    case GET_ORDERS:
      return {
        ...state,
        ordersLoading: false,
        orders: action.payload
      }

    case GET_MORE_ORDERS:
      return {
        ...state,
        orders: {
          ...action.payload,
          count: state.orders.count + action.payload.count,
          results: [
            ...state.orders.results,
            ...action.payload.results
          ],
        },
        moreOrdersLoading: false,
      }

    case SET_ORDERS_PAGE:
      return {
        ...state,
        ordersCurrentPage: action.payload
      }

    case ORDERS_ERROR:
      return {
        ...state,
        ordersLoading: false,
        moreOrdersLoading: false,
        orders: null
      }

    case ORDER_ITEM_LOADING:
      return {
        ...state,
        orderItemLoading: true,
      }

    case GET_ORDER_ITEM:
      return {
        ...state,
        orderItemLoading: false,
        orderItem: action.payload
      }

    case ORDER_ITEM_ERROR:
      return {
        ...state,
        orderItemLoading: false,
        orderItem: null
      }

    case REVIEW_PRODUCT:
      return {
        ...state,
        orderItem: {
          ...state.orderItem,
          is_reviewed: true,
          review: {
            id: action.payload.data.id,
            rating: action.payload.data.rating,
            comment: action.payload.data.comment
          }
        }
      }

    case REVIEW_PRODUCT_ORDER:
      return {
        ...state,
        orderItem: {
          ...state.orderItem,
          order: {
            ...state.orderItem.order,
            is_reviewed: true,
            review: {
              id: action.payload.data.id,
              rating: action.payload.data.rating,
              comment: action.payload.data.comment
            }
          }
        }
      }

    case REVIEW_ORDER:
      return {
        ...state,
        order: {
          ...state.order,
          is_reviewed: true,
          review: {
            id: action.payload.data.id,
            rating: action.payload.data.rating,
            comment: action.payload.data.comment
          }
        }
      }
    
    default:
      return state
  }
}