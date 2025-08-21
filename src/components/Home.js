import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import EditTasksModal from "./EditTasksModal";
import AddTaskModal from "./AddTaskModal";
import TaskTable from "./TaskTable";
import DeleteTaskModal from "./DeleteTaskModal";
import ClearAllDataModal from "./ClearAllDataModal";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [editedTaskName, setEditedTaskName] = useState("");
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [deleteTaskIndex, setDeleteTaskIndex] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showClearAllDataModal, setShowClearAllDataModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/tasks");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setTasks(result);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [showAddTask, showEditTaskModal, showDeleteModal, showClearAllDataModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tasks.includes(taskName)) {
      toast.warning("Task Already Exists!");
    } else {
      try {
        const response = await fetch("http://localhost:8000/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ task: taskName, id: `${tasks.length}` }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Success: ", data);
        setTaskName("");
        setShowAddTask(false);
        toast.success("Task Added Successfully!");
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleEditTaskSubmit = async (e) => {
    e.preventDefault();
    if (tasks.includes(editedTaskName) && tasks[editIndex] !== editedTaskName) {
      toast.warning("Task Already Exists!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/tasks/${editIndex}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task: editedTaskName }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      console.log(result);
      setEditedTaskName("");
      setEditIndex(null);
      setShowEditTaskModal(false);
      toast.success("Task Edited Successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async () => {
    const response = await fetch(
      `http://localhost:8000/tasks/${deleteTaskIndex}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    console.log(result);
    setShowDeleteModal(false);
    toast.success("Task Deleted Successfully!");
  };

  const handleClearAll = async () => {
    try {
      await Promise.all(
        tasks.map((task) =>
          fetch(`http://localhost:8000/tasks/${task.id}`, {
            method: "DELETE",
          })
        )
      );

      setTasks([]);
      setShowClearAllDataModal(false);
      toast.info("All Tasks Cleared!");
    } catch (err) {
      console.error("Error clearing tasks:", err);
    }
  };

  return (
    <>
      {showAddTask && (
        <AddTaskModal
          setShowAddTask={setShowAddTask}
          handleSubmit={handleSubmit}
          taskName={taskName}
          setTaskName={setTaskName}
        />
      )}

      {showEditTaskModal && (
        <EditTasksModal
          setShowEditTaskModal={setShowEditTaskModal}
          handleEditTaskSubmit={handleEditTaskSubmit}
          editedTaskName={editedTaskName}
          setEditedTaskName={setEditedTaskName}
        />
      )}

      {showDeleteModal && (
        <DeleteTaskModal
          handleDeleteTask={handleDeleteTask}
          setShowDeleteModal={setShowDeleteModal}
        />
      )}

      {showClearAllDataModal && (
        <ClearAllDataModal
          setShowClearAllDataModal={setShowClearAllDataModal}
          handleClearAll={handleClearAll}
        />
      )}

      <div className="w-full mt-20 flex flex-col items-center gap-10">
        <h1 className="text-4xl font-bold text-gray-800">To Do List Project</h1>

        <div className="overflow-x-auto w-3/4 flex flex-col gap-10">
          <div className="w-full flex justify-center gap-4">
            <button
              className="px-7 py-2 bg-[#0078F8] text-white rounded-md hover:bg-white hover:text-[#0078F8] border border-[#0078F8]"
              onClick={() => {
                setTaskName("");
                setEditedTaskName("");
                setShowAddTask(true);
              }}
            >
              Add Task
            </button>

            <button
              className="px-7 py-2 bg-red-500 text-white rounded-md hover:bg-white hover:text-red-500 border border-red-500"
              onClick={() => setShowClearAllDataModal(true)}
            >
              Clear All
            </button>
          </div>

          <TaskTable
            tasks={tasks}
            setEditedTaskName={setEditedTaskName}
            setEditIndex={setEditIndex}
            setShowEditTaskModal={setShowEditTaskModal}
            handleDeleteTask={handleDeleteTask}
            setShowDeleteModal={setShowDeleteModal}
            setDeleteTaskIndex={setDeleteTaskIndex}
          />
        </div>
      </div>
    </>
  );
}
