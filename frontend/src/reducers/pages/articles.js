import { ARTICLES_LOADING, ARTICLE_PAGE, ARTICLE_LOADING, GET_ARTICLES, GET_ARTICLE, ARTICLE_ERROR } from '../../actions/types'

const initialState = {
  articlesLoading: true,
  articleLoading: true,

  articles: {results:[]},
  article: null,
  currentPage: 1,

  error: null
}

export default (state = initialState, action) => {
  switch(action.type) {
    case ARTICLES_LOADING:
      return {
        ...state,
        articlesLoading:true
      }

    case ARTICLE_LOADING:
      return {
        ...state,
        articleLoading:true
      }

    case GET_ARTICLES:
      return {
        ...state,
        articles: action.payload,
        articlesLoading: false,
      }

    case GET_ARTICLE:
      return {
        ...state,
        article: action.payload,
        articleLoading: false,
        error: null,
      }

    case ARTICLE_ERROR:
      console.error('Article', action.payload);
      return {
        ...state,
        error: action.payload,
        articleLoading: false,
      }

    case ARTICLE_PAGE:
      return {
        ...state,
        currentPage: action.payload,
      }
    
    default:
      return state
  }
}