import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AddTask = () => {
    const [task, setTask] = useState({
        taskName: "",
        startDate: "",
        endDate: "",
        manDay: "",
        status: true,
        delay: "",
    });
    const [currentTask,setCurrentTask] = useState();
    const navigate = useNavigate();
    const {taskId} = useParams();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3000/auth/add_task', task)
            .then(result => {
                if (result.data.Status) {
                    navigate('/dashboard/task');
                } else {
                    alert(result.data.Error);
                }
            })
            .catch(err => console.log(err));
    };

    useEffect(() => {
        if(taskId){
        axios
          .get("http://localhost:3000/auth/task", {
            params: {taskId:taskId},
          })
          .then((result) => {
            if (result.data.Status) {
                setCurrentTask(result.data.Result[0]);
            } else {
              alert(result.data.Error);
            }
          })
          .catch((err) => console.log(err));
        }
      }, [taskId]);

    const handleUpdate = (e) => {
        e.preventDefault()
        axios.put('http://localhost:3000/auth/edit_task/'+taskId, task)
          .then(result => {
            if (result.data.Status) {
              navigate('/dashboard/task')
            } else {
              alert(result.data.Error)
            }
          }).catch(err => console.log(err))
      }


    return (
        <div className="d-flex justify-content-center align-items-center mt-3">
            <div className="p-3 rounded w-50 border">
                <h3 className="text-center">Add task</h3>
                <form className="row g-1" onSubmit={taskId ? handleUpdate : handleSubmit}>
                    <div className="col-12">
                        <label for="inputEmail4" className="form-label">
                            Task Name
                        </label>
                        <input
                            type="text"
                            className="form-control rounded-0"
                            id="inputEmail4"
                            defaultValue={currentTask?.taskName}
                            placeholder="Enter Task Name"
                            autoComplete="off"
                            onChange={(e) =>
                                setTask({ ...task, taskName: e.target.value })
                            }
                        />
                    </div>
                    <div className="col-12">
                        <label for="inputPassword4" className="form-label">
                            Start Date
                        </label>
                        <input
                            type="date"
                            className="form-control rounded-0"
                            id="inputPassword4"
                            defaultValue={currentTask?.startDate}
                            placeholder="Enter Start Date"
                            onChange={(e) =>
                                setTask({ ...task, startDate: e.target.value })
                            }
                        />
                        <label for="inputSalary" className="form-label">
                            End Date
                        </label>
                        <input
                            type="date"
                            className="form-control rounded-0"
                            id="inputSalary"
                            defaultValue={currentTask?.endDate}
                            placeholder="Enter End Date"
                            autoComplete="off"
                            onChange={(e) =>
                                setTask({ ...task, endDate: e.target.value })
                            }
                        />
                    </div>
                    <div className="col-12">
                        <label for="inputEmail4" className="form-label">
                            Man Day
                        </label>
                        <input
                            type="text"
                            className="form-control rounded-0"
                            id="inputEmail4"
                            defaultValue={currentTask?.manDay}
                            placeholder="Enter Man Day"
                            autoComplete="off"
                            onChange={(e) =>
                                setTask({ ...task, manDay: e.target.value })
                            }
                        />
                    </div>
                    <div className="col-12">
                        <label for="inputEmail4" className="form-label">
                            Delay
                        </label>
                        <input
                            type="text"
                            className="form-control rounded-0"
                            id="inputEmail4"
                            defaultValue={currentTask?.delay}
                            placeholder="Enter Delay"
                            autoComplete="off"
                            onChange={(e) =>
                                setTask({ ...task, delay: e.target.value })
                            }
                        />
                    </div>

                    <div className="col-12">
                        {
                            taskId ?
                        <button type="submit" className="btn btn-primary w-100">
                            Update Task
                        </button>
                        :
                        <button type="submit" className="btn btn-primary w-100">
                        Add Task
                        </button>
                        }
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTask;
