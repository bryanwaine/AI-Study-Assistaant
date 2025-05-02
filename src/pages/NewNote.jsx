import FileUploadProcessor from "../components/FileUploadProcessor/FileUploadProcessor";
import Layout from "../components/Layout";
import useAuth from "../hooks/useAuth";

const NewNote = () => {
  const { user } = useAuth();
  const userName = user?.displayName || location.state?.userName;
  return (
    <>
      <Layout userName={userName} />
      <div className="notes-wrapper">
        <FileUploadProcessor onExtractedText={(text) => console.log(text)}/>
        <div className="notes-container">
          
        </div>
      </div>
    </>
  );
};

export default NewNote;
