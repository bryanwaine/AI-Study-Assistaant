import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import StyleOutlinedIcon from "@mui/icons-material/StyleOutlined";
import HistoryIcon from "@mui/icons-material/History";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import "./EmptyState.css";

const EmptyState = ({page}) => {
  const currentPage = () => {
    if (page === "notes") {
      return <DescriptionOutlinedIcon />;
    }

    if (page === "flashcards") {
      return <StyleOutlinedIcon />;
    }

    if (page === "sessions") {
      return <HistoryIcon />;
    }
      
    if (page === "quizzes") {
      return <QuizOutlinedIcon />;
    }
  };

  return (
    <div className="empty-placeholder">
      {currentPage()}
      <h2>{`You don't have any ${page} yet`}</h2>
      <p>When you do, they will show up here.</p>
    </div>
  );
};

export default EmptyState;
