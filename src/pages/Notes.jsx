import Layout from "../components/Layout";
import useAuth from "../hooks/useAuth";

const Notes = () => {
  const { user } = useAuth();
  const userName = user?.displayName || location.state?.userName;
  return (
    <>
      <Layout userName={userName} />
      <h1 style={{ textAlign: "center", marginTop: "6rem" }}>Coming soon 😎</h1>
    </>
  );
};

export default Notes;
