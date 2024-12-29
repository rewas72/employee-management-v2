import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from 'moment';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/task")
      .then((result) => {
        if (result.data.Status) {
          setTasks(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (taskId) => {
    if(confirm("Silmek İstediğinize Emin Misiniz?")){
    axios.delete('http://localhost:3000/auth/delete_task/' + taskId)
      .then(result => {
        if (result.data.Status) {
          window.location.reload()
        } else {
          alert(result.data.Error)
        }
      })
    }
  }

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Task List</h3>
      </div>
      <Link to={"/dashboard/add_task"} className="btn btn-primary m-2">
        Add Task
      </Link>
      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>Task Id</th>
              <th>Task Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Man Day</th>
              <th>Delay</th>
              <th>Process</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((e,i) => (
              <tr key={i}>
                <td>{e.taskId}</td>
                <td>{e.taskName}</td>
                <td>{moment(e.startDate).format("DD.MM.YYYY")}</td>
                <td>{moment(e.endDate).format("DD.MM.YYYY")}</td>
                <td>{e.manDay}</td>
                <td>{e.delay}</td>
                <td>
                  <Link
                    to={`/dashboard/add_task/` + e.taskId}
                    className="btn btn-info btn-sm me-2"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleDelete(e.taskId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tasks;
