import {
  DASHBOARD_LOADING,
  GET_DASHBOARD_DATA,
  DASHBOARD_DATA_ERROR,

  GET_MANAGER_ORDER_ITEMS,
  MANAGER_ORDER_ITEMS_ERROR,

  GET_MANAGER_ORDERS,
  MANAGER_ORDERS_ERROR,

  MANAGER_ORDER_LOADING,
  GET_MANAGER_ORDER,
  MANAGER_ORDER_ERROR,

  PROCESS_ORDER,
  MONITOR_CANCEL_ORDER,

  DELIVER_ORDER_ITEM,
  DELIVER_ORDER,

  PREPARE_ORDER_ITEM,
  PREPARE_ORDER,
} from '../actions/types'

const initialState = {
  dashboardLoading: true,
  dashboardData: null,
  ordersLoading: true,
  orders: null,
  orderLoading: true,
  order: null,
}

export default (state = initialState, action) => {
  switch(action.type) {
    case DASHBOARD_LOADING:
      return {
        ...state,
        dashboardLoading: true,
      }

    case GET_DASHBOARD_DATA:
      return {
        ...state,
        dashboardLoading: false,
        dashboardData: action.payload
      }

    case DASHBOARD_DATA_ERROR:
      return {
        ...state,
        dashboardLoading: false,
        dashboardData: null
      }

    case GET_MANAGER_ORDER_ITEMS:
      return {
        ...state,
        orderItemsLoading: false,
        orderItems: action.payload
      }

    case MANAGER_ORDER_ITEMS_ERROR:
      return {
        ...state,
        orderItemsLoading: false,
        orderItems: null
      }

    case GET_MANAGER_ORDERS:
      return {
        ...state,
        ordersLoading: false,
        orders: action.payload
      }

    case MANAGER_ORDERS_ERROR:
      return {
        ...state,
        ordersLoading: false,
        orders: null
      }

    case MANAGER_ORDER_LOADING:
      return {
        ...state,
        orderLoading: true,
      }

    case GET_MANAGER_ORDER:
      return {
        ...state,
        orderLoading: false,
        order: action.payload
      }

    case MANAGER_ORDER_ERROR:
      return {
        ...state,
        orderLoading: false,
        order: null
      }

    case PROCESS_ORDER:
    case DELIVER_ORDER:
    case PREPARE_ORDER:
    case MONITOR_CANCEL_ORDER:
      return {
        ...state,
        orders: {
          count: state.orders.count,
          results: state.orders.results.filter(order => order.id != action.payload.id)
        }
      }

    case DELIVER_ORDER_ITEM:
      const newOrderItems = state.order.order_items.map(orderItem => {
        if (orderItem.id === action.payload.id) {
          orderItem.is_delivered = true
        }
        return orderItem
      })
      return {
        ...state,
        order: {
          ...state.order,
          order_items: newOrderItems,
        }
      }

    case PREPARE_ORDER_ITEM:
      const newPickedupItems = state.order.order_items.map(orderItem => {
        if (orderItem.id === action.payload.id) {
          orderItem.is_delivered = true
        }
        return orderItem
      })
      return {
        ...state,
        order: {
          ...state.order,
          order_items: newPickedupItems,
        }
      }
    
    default:
      return state
  }
}