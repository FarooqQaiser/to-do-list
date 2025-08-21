import React from "react";
import { IoMdClose, IoMdCreate } from "react-icons/io";

export default function AddTaskModal({
  setShowAddTask,
  handleSubmit,
  taskName,
  setTaskName,
}) {
  return (
    <div className="bg-black bg-opacity-20 fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full">
      <div className="w-1/3 p-4 bg-white rounded-md shadow-lg">
        <div className="flex justify-end">
          <button
            className="p-2 bg-[#0078F8] text-white rounded-xl hover:bg-white hover:text-[#0078F8] border border-[#0078F8]"
            onClick={() => setShowAddTask(false)}
          >
            <IoMdClose />
          </button>
        </div>
        <form
          className="m-5 grid grid-cols-[3fr_1fr] gap-2"
          onSubmit={handleSubmit}
        >
          <div className="flex items-center gap-3 p-2 border rounded-md shadow-sm">
            <IoMdCreate className="text-[#778899]" />
            <input
              required
              type="text"
              value={taskName}
              placeholder="Task Name"
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full outline-none"
            />
          </div>
          <button className="px-6 py-2 bg-[#0078F8] text-white rounded-md hover:bg-white hover:text-[#0078F8] border border-[#0078F8]">
            Add
          </button>
        </form>
      </div>
    </div>
  );
}
