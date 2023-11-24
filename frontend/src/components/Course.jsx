const Course = ({ course }) => {
  return (
    <>
      <Header course={course}></Header>
      <Content parts={course.parts}></Content>
      <Total parts={course.parts}></Total>
    </>
  );
};

const Header = ({ course }) => {
  return <h1>{course.name}</h1>;
};
const Part = ({ part }) => {
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  );
};

const Content = ({ parts }) => {
  return parts.map((part) => <Part key={part.id} part={part}></Part>);
};

const Total = ({ parts }) => {
  const sum = parts.reduce((acc, currentNumber) => {
    return acc + currentNumber.exercises;
  }, 0);
  return <b>Total of {sum} exercises</b>;
};

export default Course;
