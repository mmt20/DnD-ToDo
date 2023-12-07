import './style.css';
import { useEffect, useState } from 'react';
import CreateTask from './Components/CreateTask';
import ListTask from './Components/ListTask';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
function App() {
  const [tasks, setTasks] = useState([]);
  console.log('tasks', tasks);
  useEffect(() => {
    setTasks(JSON.parse(localStorage.getItem('tasks')));
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container">
        <CreateTask tasks={tasks} setTasks={setTasks} />
        <ListTask tasks={tasks} setTasks={setTasks} />
      </div>
    </DndProvider>
  );
}

export default App;
