import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router";

import PrivateRoute from "./routes/PrivateRoute";
import Home from "./pages/Home/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard/Dashboard";
import ResetPassword from "./pages/ResetPassword";
import Session from "./pages/Session/Session";
import Sessions from "./pages/Sessions/Sessions";
import NewSession from "./pages/NewSession/NewSession";
import NewFlashcards from "./pages/NewFlashcards/NewFlashcards";
import Decks from "./pages/Decks/Decks";
import Deck from "./pages/Deck/Deck";
import NewQuiz from "./pages/NewQuiz/NewQuiz";
import NewNote from "./pages/NewNote/NewNote";
import Notes from "./pages/Notes/Notes";
import Quizzes from "./pages/Quizzes/Quizzes";
import Note from "./pages/Note/Note";

function App() {

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // system preference fallback
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      prefersDark
        ? document.documentElement.classList.add('dark')
        : document.documentElement.classList.remove('dark');
    }
  }, []);

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
          <Route path="/notes/:noteId" element={<Note />} />
          <Route path="/new-quiz" element={<NewQuiz />} />
          <Route path="/quizzes" element={<Quizzes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
