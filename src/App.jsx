import { BrowserRouter, Route, Routes } from "react-router";
import PrivateRoute from "./routes/PrivateRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ResetPassword from "./pages/ResetPassword";
import Session from "./pages/Session";
import Sessions from "./pages/Sessions";
import NewSession from "./pages/NewSession";
import NewFlashcards from "./pages/NewFlashcards";
import Decks from "./pages/Decks";
import Deck from "./pages/Deck";
import NewQuiz from "./pages/NewQuiz";
import NewNote from "./pages/NewNote";
import Notes from "./pages/Notes";
import Quizzes from "./pages/Quizzes";
// import setAppHeight from "./utils/setAppHeight";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/new-session" element={<NewSession />} />
          <Route path="/sessions/:sessionId" element={<Session />} />
          <Route path="/new-deck" element={<NewFlashcards/>} />
          <Route path="/decks" element={<Decks />} />
          <Route path="/decks/:deckId" element={<Deck />} />
          <Route path="/new-note" element={<NewNote />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/new-quiz" element={<NewQuiz />} />
          <Route path="/quizzes" element={<Quizzes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
