import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";
import CardList from "./components/CardList";

function App() {
  const [flashcards, setflashcards] = useState([]);

  const [categories, setcategories] = useState([]);

  const [landingTitle, setlandingTitle] = useState(
    'Select category of your choice from the list and click "Generate" to enjoy your flashcard quiz.'
  );

  const categoryEl = useRef();
  const amountEl = useRef();

  useEffect(() => {
    axios.get("https://opentdb.com/api_category.php").then((res) => {
      setcategories(res.data.trivia_categories);
    });
  }, []);

  const decodeString = (str) => {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = str;
    return textarea.value;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setlandingTitle("");

    axios
      .get("https://opentdb.com/api.php", {
        params: {
          amount: amountEl.current.value,
          category: categoryEl.current.value,
        },
      })
      .then((res) => {
        setflashcards(
          res.data.results.map((questionItem, index) => {
            const answer = decodeString(questionItem.correct_answer);
            const options = [
              ...questionItem.incorrect_answers.map((a) => decodeString(a)),
              answer,
            ];
            return {
              id: `${index}-${Date.now()}`,
              question: decodeString(questionItem.question),
              answer: answer,
              options: options.sort(() => Math.random() - 0.5),
            };
          })
        );
      })
      .catch((error) =>
        setlandingTitle(
          "Oops! Seems you're disconnected. Connect and try again."
        )
      );
  };

  return (
    <>
      <header className="header">
        <div className="header__left">
          <span>Flash-cardz & me.</span>
          <br />
          <p>
            Brace the competitiveness of these quizzes and <br />
            get ready for a rollercoaster ride of knowledge.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="header__right">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select id="category" ref={categoryEl}>
              {categories.map((category) => {
                return (
                  <option value={category.id} key={category.id}>
                    {category.name}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="amount">Number of questions</label>
            <input
              type="number"
              id="amount"
              min="1"
              step="1"
              defaultValue={10}
              ref={amountEl}
            />
          </div>
          <div className="form-group">
            <button className="button" type="submit">
              Generate
            </button>
          </div>
        </form>
      </header>

      <div className="container">
        <div className="landing__title">
          <p>{landingTitle}</p>
        </div>
        <CardList flashcard={flashcards} />
      </div>
    </>
  );
}

export default App;
