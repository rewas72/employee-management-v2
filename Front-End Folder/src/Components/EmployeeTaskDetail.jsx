import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import moment from 'moment'

const EmployeeTaskDetail = () => {
    const [currentEmployee, setCurrentEmployee] = useState([]);
    const [project, setProject] = useState([]);
    const [tasks, setTasks] = useState([]);
    const {userId} = useParams()

    useEffect(() => {
        if(userId){
        axios
            .get("http://localhost:3000/auth/employee", {
              params: {employeeId:userId},
            })
            .then((result) => {
                if (result.data.Status) {
                    setCurrentEmployee(result.data.Result[0]?.fullname);
                } else {
                    alert(result.data.Error);
                }
            })
            .catch((err) => console.log(err));
          }
      }, [userId]);

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
      }, []);

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

const getProjectName = () => {
        let list = [];
        if(project?.length && userId){
            project.forEach(element => {
              !!element.taskData && JSON.parse(element.taskData)?.forEach(item => {
                    if(Number(item.employeeId) === Number(userId)){
                      item.projectName = element.projectName;
                      item.startDate = element.startDate;
                      item.endDate = element.endDate;
                      list.push(item);
                    }
                });
      });
    }
    return list;
}

const totalProjectStatus = () => {
  let continueProject = 0;
  let willBeCompleted = 0;
  let closedProject = 0;
  if(getProjectName()?.length){
    getProjectName().forEach(element => {
      if(element?.taskStatus === "Tamamlanacak"){
        willBeCompleted+=1;
      }
      if(element?.taskStatus === "Devam Ediyor"){
        continueProject+=1;
      }
      if(element?.taskStatus === "Bitti"){
        closedProject+=1;
      }
    });
  }
  return [continueProject,willBeCompleted,closedProject]
}
const getTaskName = (taskId) => {
  let res;
  if(tasks?.length && taskId){
    tasks.forEach(element => {
      if(element.taskId === Number(taskId)){
        res = element.taskName;
      }
    });
  }
  return res;
}
  return (
    <div className="px-5 mt-3">
    <div className="d-flex justify-content-center">
        <h3>{currentEmployee+" - "} Project - Task List</h3>
      </div>
      <div className='p-3 d-flex justify-content-around mt-3'>
      <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
          <div className='text-center pb-1'>
            <h4>Devam Eden Projeler</h4>
          </div>
          <hr />
          <div className='d-flex justify-content-between'>
            <h5>Total:</h5>
             <h5>{totalProjectStatus()[0]}</h5> 
          </div>
        </div>
        <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
          <div className='text-center pb-1'>
            <h4>Tamamlanacak Projeler</h4>
          </div>
          <hr />
          <div className='d-flex justify-content-between'>
            <h5>Total:</h5>
            <h5>{totalProjectStatus()[1]}</h5>
          </div>
        </div>
        <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
          <div className='text-center pb-1'>
            <h4>Biten Projeler</h4>
          </div>
          <hr />
          <div className='d-flex justify-content-between'>
            <h5>Total:</h5>
           <h5>{totalProjectStatus()[2]}</h5>
          </div>
        </div>
      </div>  
      <div className="mt-5">
      <table className="table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Task</th>
              <th>Proje Başlangıç</th>
              <th>Proje Bitiş</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {getProjectName()?.map((e,i) => (
              <tr key={i}>
              <td>{e.projectName}</td>
              <td>{getTaskName(e.taskId)}</td>
                <td>{moment(e.startDate).format("DD.MM.YYYY")}</td>
                <td>{moment(e.endDate).format("DD.MM.YYYY")}</td>
                <td>{e.taskStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
    </div>
  )
}

export default EmployeeTaskDetail