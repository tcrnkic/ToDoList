// TodoList.jsx
import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/database";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");

  const user = firebase.auth().currentUser;

  useEffect(() => {
    if (user) {
      const userTasksRef = firebase.database().ref(`tasks/${user.uid}`);

      userTasksRef.on("value", (snapshot) => {
        const tasksData = snapshot.val();
        if (tasksData) {
          const tasksArray = Object.entries(tasksData).map(([key, value]) => ({
            id: key,
            ...value,
          }));
          setTasks(tasksArray);
        } else {
          setTasks([]);
        }
      });
    }
  }, [user]);

  const addTask = () => {
    if (user) {
      const userTasksRef = firebase.database().ref(`tasks/${user.uid}`);
      const newTaskRef = userTasksRef.push();

      newTaskRef.set({
        task: taskInput,
        completed: false,
      }).then(() => {
        console.log("Task added successfully");
        setTaskInput("");
      }).catch((error) => {
        console.error(error.message);
      });
    }
  };

  const toggleTaskCompletion = (taskId, completed) => {
    if (user) {
      const userTaskRef = firebase.database().ref(`tasks/${user.uid}/${taskId}`);
      userTaskRef.update({
        completed: !completed,
      }).then(() => {
        console.log("Task status updated successfully");
      }).catch((error) => {
        console.error(error.message);
      });
    }
  };

  const deleteTask = (taskId) => {
    if (user) {
      const userTaskRef = firebase.database().ref(`tasks/${user.uid}/${taskId}`);
      userTaskRef.remove()
        .then(() => {
          console.log("Task deleted successfully");
        })
        .catch((error) => {
          console.error(error.message);
        });
    }
  };

  return (
    <div>
    
  <div className="py-4 flex gap-3">
        <textarea
        className="rounded-lg px-2 text-black"
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="Enter task"
        
        />
        <button className="bg-blue-600 px-2 py-1 rounded-lg max-h-[55px]" onClick={addTask}>Add Task</button>
         
  </div>
        <h2 className="text-2xl">Your Tasks</h2>
        <hr className="my-2 opacity-65" />
      <ul className="">
        {tasks.length>0 ? tasks.map((task) => (
          <li className="flex py-1 justify-between items-center " key={task.id}>
            <input
            className="me-3"
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTaskCompletion(task.id, task.completed)}
            />
            <p className="text-xl pe-4 break-words max-w-40 " style={{ textDecoration: task.completed ? "line-through" : "none" }}>
              {task.task}
            </p>
            
            <button className="px-2 text-center text-sm py-1 max-h-8 bg-red-500 rounded-lg" onClick={() => deleteTask(task.id)}>X</button>
          </li>
        )): <p>No current tasks.</p> }
      </ul>
      <hr className="my-2 opacity-65" />
    </div>
  );
};

export default TodoList;
