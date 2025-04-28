import Layout from "../components/Layout";
import useAuth from "../hooks/useAuth";

const NewQuiz = () => {
  const { user } = useAuth();
  const userName = user?.displayName || location.state?.userName;
  return (
    <>
      <Layout userName={userName} />
      <h1 style={{ textAlign: "center", marginTop: "6rem" }}>Coming soon 😎</h1>
    </>
  );
};

export default NewQuiz;
