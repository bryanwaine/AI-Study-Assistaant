import AuthContextProvider  from "../context/AuthProvider";

const ContextLayout = ({ children }) => {
  return <AuthContextProvider>{children}</AuthContextProvider>;
};

export default ContextLayout;
