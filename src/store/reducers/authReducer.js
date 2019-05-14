const initState = {
  authError: null
};

const authReducer = (state = initState, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        authError: null
      }

    case 'LOGIN_ERROR':
      return {
        ...state,
        authError: 'Login failed'
      }

    case 'SIGNUP_SUCCESS':
      return {
        ...state,
        authError: null
      }

    case 'SIGNUP_ERROR':
      return {
        ...state,
        authError: action.error.message
      }

    case 'LOGOUT_SUCCESS':
      return {
        ...state,
        authError: null
      }

    case 'LOGOUT_ERROR':
      return {
        ...state,
        authError: 'Logout failed'
      }

    default:
      return state;
  }
};

export default authReducer;
