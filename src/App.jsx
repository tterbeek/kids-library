import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import BookPage from "./pages/BookPage";

export default function App() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);

  const navigateToBook = (id) => {
    navigate(`/book/${id}`);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <HomePage
            navigateToBook={navigateToBook}
            setBooks={setBooks}
          />
        }
      />
      <Route
        path="/book/:id"
        element={<BookPage books={books} />}
      />
    </Routes>
  );
}
