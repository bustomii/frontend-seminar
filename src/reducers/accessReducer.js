export default (state, action) => {
  switch (action.type) {
    case "access":
      return {
        access: action.payload
      };
    default:
      return state;
  }
};