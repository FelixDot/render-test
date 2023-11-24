import { useEffect, useState } from "react";
import personsService from "./services/persons";
import Notification from "./components/Notification";

const Filter = ({ onChange, value }) => {
  return (
    <>
      filter Shown with:
      <input onChange={onChange} value={value} />
    </>
  );
};

const PersonFrom = ({
  submit,
  handleNameChange,
  handleNumberChange,
  nameValue,
  numberValue,
}) => {
  return (
    <form onSubmit={submit}>
      <div>
        name:
        <input onChange={handleNameChange} value={nameValue} />
      </div>
      <div>
        number:
        <input onChange={handleNumberChange} value={numberValue} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({ persons, remove }) => {
  return persons.map((person) => (
    <span key={person.id}>
      <PersonDetail
        key={person.id}
        name={person.name}
        number={person.number}
        remove={remove}
      />
      <button onClick={() => remove(person)}>Delete</button>
    </span>
  ));
};

const PersonDetail = ({ name, number }) => {
  return (
    <p>
      {name} {number}
    </p>
  );
};
const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterName, setFilterName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    personsService.getAll().then((response) => setPersons(response));
  }, []);

  const handleInputChange = (event, setValue) => {
    event.preventDefault();
    setValue(event.target.value);
  };

  const handleFilterChange = (event) => {
    handleInputChange(event, setFilterName);
  };

  const addPhone = (event) => {
    event.preventDefault();
    const existingPerson = persons.find((person) => person.name === newName);
    if (existingPerson) {
      if (
        confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const updatedPerson = { ...existingPerson, number: newNumber };
        personsService
          .update(existingPerson.id, updatedPerson)
          .then((response) => {
            setPersons(
              persons.map((person) =>
                person.name === updatedPerson.name ? response : person
              )
            );
            setErrorMessage(`Number is changed`);
            setTimeout(() => {
              setErrorMessage(null);
            }, 2000);
          });
      }
      return;
    }
    const newPerson = {
      name: newName,
      number: newNumber,
    };
    personsService
      .create(newPerson)
      .then((response) => setPersons(persons.concat(response)));
    setErrorMessage(`${newPerson.name} is added`);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
    setNewName("");
    setNewNumber("");
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filterName.toLowerCase())
  );

  const remove = (person) => {
    if (confirm(`Delete ${person.name} ?`)) {
      personsService
        .remove(person.id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== person.id));
        })
        .catch((error) => {
          setErrorMessage(
            `Information of ${person.name} has already been removed from the server`
          );
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        });
    } else return;
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} />
      <Filter onChange={handleFilterChange} value={filterName} />
      <h3>Add a new</h3>
      <PersonFrom
        submit={addPhone}
        handleNameChange={(event) => handleInputChange(event, setNewName)}
        handleNumberChange={(event) => handleInputChange(event, setNewNumber)}
        nameValue={newName}
        numberValue={newNumber}
      />
      <h2>Numbers</h2>
      <Persons persons={filteredPersons} remove={remove} />
    </div>
  );
};

export default App;
