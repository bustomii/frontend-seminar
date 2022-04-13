export default (state, action) => {
  switch (action.type) {
    case "access":
      return {...state, 
        access: action.payload
      };
    case "user":
      return {...state, 
        user: action.payload
      };
    default:
      return state;
  }
};