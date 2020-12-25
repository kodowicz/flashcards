const initState = {
  authError: null
};

export const authReducer = (state = initState, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        authError: null
      };

    case "LOGIN_ERROR":
      return {
        ...state,
        authError: action.error.message
      };

    case "SIGNUP_SUCCESS":
      return {
        ...state,
        authError: null
      };

    case "SIGNUP_ERROR":
      return {
        ...state,
        authError: action.error.message
      };

    case "LOGOUT_NOTIFICATION":
      return {
        ...state,
        authError: "logout"
      };

    case "REMOVE_LOGOUT_NOTIFICATION":
      return {
        ...state,
        authError: ""
      };

    case "LOGOUT_ERROR":
      return {
        ...state,
        authError: "Logout failed"
      };

    case "CHANGE_PASSWORD_ERROR":
      return {
        ...state,
        authError: "The password is invalid"
      };

    case "CLEAN_UP":
      return {
        ...state,
        authError: null
      };

    case "INVALID_DATA":
      return {
        ...state,
        authError: action.message
      };

    default:
      return state;
  }
};
