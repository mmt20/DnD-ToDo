import { useEffect, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { toast } from 'react-toastify';

const ListTask = ({ tasks, setTasks }) => {
  const [todos, setTodos] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [closed, setClosed] = useState([]);

  useEffect(() => {
    if (tasks) {
      const fTodos = tasks.filter((task) => task.status === 'todo');
      const fInProgress = tasks.filter((task) => task.status === 'inProgress');
      const fClosed = tasks.filter((task) => task.status === 'closed');

      setTodos(fTodos);
      setInProgress(fInProgress);
      setClosed(fClosed);
    }
  }, [tasks]);
  const statuses = ['todo', 'inProgress', 'closed'];
  return (
    <div className="down">
      {statuses.map((status, index) => (
        <Section
          key={index}
          status={status}
          tasks={tasks}
          setTasks={setTasks}
          todos={todos}
          inProgress={inProgress}
          closed={closed}
        />
      ))}
    </div>
  );
};

export default ListTask;

const Section = ({ status, tasks, setTasks, todos, inProgress, closed }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item) => addItemToSection(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  let text = 'Todo';
  let bg = '#64748a';
  let tasksToMap = todos;
  if (status === 'inProgress') {
    text = 'In Progress';
    bg = '#a854f0';
    tasksToMap = inProgress;
  }
  if (status === 'closed') {
    text = 'Closed';
    bg = '#22c561';
    tasksToMap = closed;
  }
  const addItemToSection = (id) => {
    setTasks((prev) => {
      const mTasks = prev.map((t) => {
        if (t.id === id) {
          return { ...t, status: status };
        }
        return t;
      });
      localStorage.setItem('tasks', JSON.stringify(mTasks));
      toast.success('😯 Task Status Changed', {
        position: 'top-center',
        hideProgressBar: true,
        autoClose: 1000,
      });
      return mTasks;
    });
  };
  return (
    <div
      ref={drop}
      className="section"
      style={{
        backgroundColor: isOver ? '#eee' : null,
      }}
    >
      <Header text={text} bg={bg} count={tasksToMap.length} />
      {tasksToMap.length > 0 &&
        tasksToMap.map((task) => (
          <Task key={task.id} task={task} tasks={tasks} setTasks={setTasks} />
        ))}
    </div>
  );
};
const Header = ({ text, bg, count }) => {
  return (
    <div className="header" style={{ backgroundColor: bg }}>
      {text}
      <div className="count">{count}</div>
    </div>
  );
};
const Task = ({ task, tasks, setTasks }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  console.log(isDragging);

  const handelRemove = (id) => {
    console.log(id);
    const fTasks = tasks.filter((t) => t.id !== id);
    setTasks(fTasks);
    localStorage.setItem('tasks', JSON.stringify(fTasks));
    toast.info(' 💀 Task Removed', {
      position: 'top-center',
      hideProgressBar: true,
      autoClose: 1000,
    });
  };
  return (
    <div
      ref={drag}
      className="task"
      style={{
        opacity: isDragging ? 0.25 : 1,
      }}
    >
      <p>{task.name}</p>
      <button className="close-btn" onClick={() => handelRemove(task.id)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
    </div>
  );
};
