import Note from "./components/Note";
import { useState, useEffect } from "react";

import Notification from "./components/Notification";
import noteService from "./services/notes";
import Footer from "./components/Footer";



const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("a new note...");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState("some error happened...");

  //get-Request
  // If the second parameter is an empty array [],
  //then the effect will run on every render of the component
  useEffect(() => {
    noteService.getAll().then((response) => {
      setNotes(response);
    });
  }, []);

  //adding new note
  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
      id: notes.length + 1,
    };
    //post new note into db.json
    noteService.create(noteObject).then((response) => {
      setNotes(notes.concat(response));
      setNewNote("");
    });
  };

  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  };

  //update importance of a note
  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };

    //update notes; setze den note mit gleicher id geupdateten note ein
    noteService
      .update(id, changedNote)
      .then((response) => {
        setNotes(notes.map((note) => (note.id === id ? response : note)));
      })
      .catch((error) => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        //nimm alle notes außer die note mit id von der fehlerhaft getogglet wurde
        setNotes(notes.filter((n) => n.id !== id));
      });
  };

  const notesToShow = showAll
    ? notes
    : notes.filter((note) => note.important === true);

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  );
};

export default App;

/*
import Course from "./components/Course";

const App = () => {
  const courses = [
    {
      name: "Half Stack application development",
      id: 1,
      parts: [
        {
          name: "Fundamentals of React",
          exercises: 10,
          id: 1,
        },
        {
          name: "Using props to pass data",
          exercises: 7,
          id: 2,
        },
        {
          name: "State of a component",
          exercises: 14,
          id: 3,
        },
        {
          name: "Redux",
          exercises: 11,
          id: 4,
        },
      ],
    },
    {
      name: "Node.js",
      id: 2,
      parts: [
        {
          name: "Routing",
          exercises: 3,
          id: 1,
        },
        {
          name: "Middlewares",
          exercises: 7,
          id: 2,
        },
      ],
    },
  ];

  return courses.map((course) => <Course key={course.id} course={course} />);
};

export default App;
*/

/*
import { useState } from "react";
const Button = ({ eventHandler, text }) => {
  return <button onClick={eventHandler}>{text}</button>;
};

const App = () => {
  const [selected, setSelected] = useState(0);

  const [ary, setAry] = useState(new Uint8Array(8));
  // increment the value in position 2 by one

  const randomIntFromInterval = () => {
    const select = Math.floor(Math.random() * 8);
    setSelected(select);

  };

  const vote = () => {
    const copy = [...ary];
    copy[selected] += 1;
    setAry(copy);
    console.log(ary);
  };

  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  return (
    <>
      <h1>Anecdote of the day</h1>
      <div>{anecdotes[selected]}</div>
      <p>has {ary[selected]} votes</p>
      <Button eventHandler={vote} text={"vote"}></Button>
      <Button
        eventHandler={randomIntFromInterval}
        text={"next anecdotes"}
      ></Button>
      <h1>Anecdote with most votes</h1>
      <p>{anecdotes[ary.indexOf(Math.max(...ary))]}</p>
    </>
  );
};

export default App;
*/

/*
import { useState } from "react";

const Button = ({ eventHandler, text }) => {
  return <button onClick={eventHandler}>{text}</button>;
};
const StatisticLine = ({ text, value }) => {
  return (
    <table>
      <tbody>
        <tr>
          <td>{text}</td>
          <td>{value}</td>
        </tr>
      </tbody>
    </table>
  );
};
const Statistics = ({ total, avg, percentage, good, bad, neutral }) => {
  console.log(total);
  if (total === 0) {
    return (
      <>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </>
    );
  } else {
    return (
      <>
        <h1>statistics</h1>
        <StatisticLine text={"good"} value={good} />
        <StatisticLine text={"neutral"} value={neutral} />
        <StatisticLine text={"bad"} value={bad} />

        <StatisticLine text={"all"} value={total} />
        <StatisticLine text={"average"} value={avg} />
        <StatisticLine text={"positive"} value={percentage} />
      </>
    );
  }
};
const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [total, setTotal] = useState(0);
  const [avg, setAvg] = useState(0);
  const [percentage, setPercentage] = useState(0);

  const giveFeedback = (feedback) => {
    let updatedTotal;
    if (feedback === "good") {
      const updatedGood = good + 1;
      updatedTotal = good + 1 + bad + neutral;
      setGood(updatedGood);
      setTotal(updatedTotal);
      setPercentage((updatedGood / updatedTotal) * 100);

      setAvg((updatedGood - bad) / updatedTotal);
    } else if (feedback === "neutral") {
      const updatedNeutral = neutral + 1;
      updatedTotal = good + bad + updatedNeutral;
      setNeutral(updatedNeutral);
      setTotal(updatedTotal);
      setPercentage((good / updatedTotal) * 100);
      setAvg((good - bad) / updatedTotal);
    } else if (feedback === "bad") {
      const updatedBad = bad + 1;
      updatedTotal = good + updatedBad + neutral;
      setBad(bad + 1);
      setTotal(updatedTotal);
      setPercentage((good / updatedTotal) * 100);
      setAvg((good - updatedBad) / updatedTotal);
    }
  };

  return (
    <div>
      <h1>give feedback</h1>
      <Button eventHandler={() => giveFeedback("good")} text="good"></Button>
      <Button
        eventHandler={() => giveFeedback("neutral")}
        text="Neutral"
      ></Button>
      <Button eventHandler={() => giveFeedback("bad")} text="Bad"></Button>

      <Statistics
        total={total}
        avg={avg}
        percentage={percentage}
        good={good}
        bad={bad}
        neutral={neutral}
      ></Statistics>
    </div>
  );
};

export default App;

*/
