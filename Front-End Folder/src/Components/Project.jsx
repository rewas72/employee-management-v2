import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid2';

const Project = () => {
  const [project, setProject] = useState([]);
  const [task, setTask] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProjectName, setSelectedProjectName] = useState();
  const [employee, setEmployee] = useState([]);
  const [projectId, setProjectId] = useState();
  const [tasks, setTasks] = useState([]);
  const [taskData, setTaskData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [userId, setUserId] = useState();
  const [indexId, setIndexId] = useState();
  const statuses = ["Tamamlanacak", "Devam Ediyor", "Bitti"];
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/employee")
      .then((result) => {
        console.log(result.data)
        if (result.data.Status) {
          setEmployee(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/project")
      .then((result) => {
        if (result.data.Status) {
          setProject(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, [loader]);
  const handleDelete = (projectId) => {
    axios.delete('http://localhost:3000/auth/delete_project/' + projectId)
      .then(result => {
        if (result.data.Status) {
          window.location.reload()
        } else {
          alert(result.data.Error)
        }

      })
  }

  const handleDeleteTask = (taskId) => {
    axios.delete('http://localhost:3000/auth/delete_task/' + taskId).then(result => {
      if (result.data.Status) {
        window.location.reload()
      } else {
        alert(result.data.Error)
      }
    })
  }


  /* 
    const handleViewTasks = (projectId, projectName) => {
      axios
        .get(`http://localhost:3000/auth/task/${projectId}`)
        .then((result) => {
          console.log("API Response:", result.data);
          if (result.data.Status) {
            const tasks = Array.isArray(result.data.Result) ? result.data.Result : [];
            setTask(tasks); // Doğru veri yapısını ayarla
            setSelectedProjectName(projectName);
            setModalVisible(true);
          } else {
            alert(result.data.Error);
          }
        })
        .catch((err) => console.log(err));
    }; */

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
  }, [loader]);

  const openModal = (projectId, projectName, taskData) => {
    if (!!taskData) {
      setTaskData(JSON.parse(taskData));
    }
    setProjectId(projectId);
    setSelectedProjectName(projectName);
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
    setTask([]);
    setUserId(null);
    setSelectedProjectName("");
  };

  const handleTaskUserAssignment = () => {
    axios.post('http://localhost:3000/auth/add_project_data/' + projectId, task)
      .then(result => {
        if (result.data.Status) {
          //navigate('/dashboard/task');
          setLoader(!loader);
        } else {
          alert(result.data.Error);
        }
      })
      .catch(err => console.log(err));
  };

  const getTaskName = (taskId) => {
    let res;
    if (tasks?.length && taskId) {
      tasks.forEach(element => {
        if (element.taskId === Number(taskId)) {
          res = element.taskName;
        }
      });
    }
    return res;
  }

  const getEmployeeName = (userId) => {
    let res;
    if (employee?.length && userId) {
      employee.forEach(element => {
        if (element.employeeId === Number(userId)) {
          res = element.fullname;
        }
      });
    }
    return res;
  }

  const handleStatusUpdate = (e) => {
    e.preventDefault()
    let data = {
      taskStatus: e.target.value,
      indexId: indexId
    }
    axios.put('http://localhost:3000/auth/update_task_status/' + projectId, data)
      .then(result => {
        if (result.data.Status) {
          setIndexId(null);
          navigate("/dashboard/employee-task-detail/" + userId);
          setLoader(!loader);
        } else {
          alert(result.data.Error)
        }
      }).catch(err => console.log(err))
  }

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Project List</h3>
      </div>
      <Link to="/dashboard/add_project" className="btn btn-success">
        Add Project
      </Link>
      {/*    <Link to={"/dashboard/add_task"} className="btn btn-primary m-2">
        Add Task
      </Link> */}
      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>ProjectId</th>
              <th>ProjectName</th>
              <th>StartDate</th>
              <th>EndDate</th>
              <th>Process</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>342</td>
              <td>deneme projesi 12</td>
              <td>22.12.2024</td>
              <td>24.12.2024</td>
              
              <td>
                  <Link
                  
                    className="btn btn-info btn-sm me-2"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-warning btn-sm"
                    
                  >
                    Delete
                  </button>

                  <button
                    className="btn btn-primary btn-sm m-1 "
                    
                  >
                    Görev-Kişi Ata
                  </button>
                </td>
                <td style={{color:"red"}}>Bu proje 1 gün gecikti</td>
            </tr>
            {project.map((e, x) => (
              <tr key={x}>
                <td>{e.projectId}</td>
                <td>{e.projectName}</td>
                <td>{moment(e.startDate).format("DD.MM.YYYY")}</td>
                <td>{moment(e.endDate).format("DD.MM.YYYY")}</td>
                <td>
                  <Link
                    to={`/dashboard/add_project/` + e.projectId}
                    className="btn btn-info btn-sm me-2"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleDelete(e.projectId)}
                  >
                    Delete
                  </button>

                  <button
                    className="btn btn-primary btn-sm m-1 "
                    onClick={() => openModal(e.projectId, e.projectName, e.taskData)}//handleViewTasks(e.projectId, e.projectName)
                  >
                    Görev-Kişi Ata
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modalVisible && (
        <div className="modal d-block modal-xl " style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog ">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {selectedProjectName} - Projesi Görev ve Kişi Atama
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <Grid container spacing={2} mb={6}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <label for="category" className="form-label">
                      Task
                    </label>
                    <select
                      name="taskId"
                      id="taskId"
                      className="form-select"
                      onChange={(e) => setTask({ ...task, taskId: e.target.value })}
                    >
                      <option value="">
                        Görev Seçin
                      </option>
                      {tasks.map((p) => (
                        <option key={p.taskId} value={p.taskId}>
                          {p.taskName}
                        </option>
                      ))}
                    </select>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <label for="inputName" className="form-label">
                      Employee
                    </label>
                    <select
                      name="employeeId"
                      id="employeeId"
                      className="form-select"
                      onChange={(e) => setTask({ ...task, employeeId: e.target.value })}
                    >
                      <option value="">
                        Kişi Seçin
                      </option>
                      {employee.map((m) => (
                        <option key={m.employeeId} value={m.employeeId}>
                          {m.fullname}
                        </option>
                      ))}
                    </select>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <label for="inputName" className="form-label">
                      Durum
                    </label>
                    <select
                      name="employeeId"
                      id="employeeId"
                      className="form-select"
                      onChange={(e) => setTask({ ...task, taskStatus: e.target.value })}
                    >
                      <option value="">
                        Durum Seçin
                      </option>
                      {statuses.map((item, index) => (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ float: "right" }}
                      onClick={() => handleTaskUserAssignment()}
                    >
                      Kaydet
                    </button>
                  </Grid>
                </Grid>
                {taskData?.length > 0 ? (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Task Name</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Status</th>
                        <th>Employee</th>
                        <th>Process</th>
                      </tr>
                    </thead>
                    <tbody>

                      {taskData?.map((task, t) => (
                        <tr key={t}>
                          <td>{getTaskName(task.taskId)}</td>
                          <td>{moment(task.startDate).format("DD.MM.YYYY")}</td>
                          <td>{moment(task.endDate).format("DD.MM.YYYY")}</td>
                          <td>
                            {
                              Number(indexId) === Number(t) ?
                                <select onChange={handleStatusUpdate} defaultValue={task.taskStatus}>
                                  {statuses.map((item, index) => (
                                    <option key={index} value={item}>
                                      {item}
                                    </option>
                                  ))}
                                </select>
                                :
                                task.taskStatus
                            }
                          </td>
                          <td>{task.employeeId ? getEmployeeName(task.employeeId) : "No Employee"}</td> {/* assignedEmployee */}
                          <td>
                            <button type="submit" className="btn btn-sm btn-success" onClick={() => { setIndexId(Number(t)); setUserId(task.employeeId) }}>
                              Update
                            </button>
                            <Link onClick={() => handleDeleteTask(task.taskId)} className="btn btn-warning btn-sm m-1 ">
                              Delete
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>Bu projeye ait görev bulunmamaktadır.</p>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Project;
