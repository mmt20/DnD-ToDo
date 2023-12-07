import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../style.css';
const CreateTask = ({ tasks, setTasks }) => {
  const [task, setTask] = useState({
    id: '',
    name: '',
    status: 'todo',
  });
  // console.log(task);
  const handelSubmit = (e) => {
    e.preventDefault();
    if (task.name.length < 3) {
      toast.error('🤬 Tasks need 4+ characters', {
        position: 'top-center',
        autoClose: 1500,
      });
      return;
    }
    if (task.name.length > 100) {
      toast.error('🤯 Limit task to 100 chars', {
        position: 'top-center',
        autoClose: 1000,
      });
      return;
    }
    setTasks((prev) => {
      if (!Array.isArray(prev)) return [task];
      const list = [...prev, task];
      localStorage.setItem('tasks', JSON.stringify(list));
      return list;
    });
    toast.success('😉 Task Created', {
      position: 'top-center',
    });
    setTask({ id: '', name: '', status: 'todo' });
  };
  return (
    <form onSubmit={handelSubmit}>
      <input
        type="text"
        value={task.name}
        onChange={(e) =>
          setTask({ ...task, id: uuidv4(), name: e.target.value })
        }
      />

      <button className="create-btn">Create Task</button>
      <ToastContainer />
    </form>
  );
};

export default CreateTask;
