import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AddProject = () => {
  const [project, setProject] = useState({
    projectName: "",
    startDate: "",
    endDate: "",
    taskData: null
  });
  const [selectproject,setSelectProject] = useState();
  const navigate = useNavigate();
  const {projectId} = useParams();

  const handleSubmit = (e) => {
    e.preventDefault();
  
    axios.post('http://localhost:3000/auth/add_project', project)
      .then(result => {
          if (result.data.Status) {
              navigate('/dashboard/project');
          } else {
              alert(result.data.Error);
          }
      })
      .catch(err => console.log(err));
  };

  useEffect(()=> {
    axios.get('http://localhost:3000/auth/project/'+projectId)
    .then(result => {
      console.log(result);
      if (result.data.Status) {
        setSelectProject(
          {
            ...project,
            projectName: result.data.Result[0].projectName,
            startDate: result.data.Result[0].startDate,
            endDate: result.data.Result[0].endDate,
        }
        );
    } else {
        console.log(result.data.Error);
    }
    }).catch(err => console.log(err))
}, [projectId])

  const handleUpdate = (e) => {
    e.preventDefault()
    axios.put('http://localhost:3000/auth/edit_project/'+projectId, project)
    .then(result => {
        if(result.data.Status) {
            navigate('/dashboard/project')
        } else {
            alert(result.data.Error)
        }
    }).catch(err => console.log(err))
}
  
  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Add project</h3>
        <form className="row g-1" onSubmit={projectId ? handleUpdate : handleSubmit}>
          <div className="col-12">
            <label for="inputEmail4" className="form-label">
              Project Name
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputEmail4"
              placeholder="Enter Project Name"
              defaultValue={selectproject?.projectName}
              autoComplete="off"
              onChange={(e) =>
                setProject({ ...project, projectName: e.target.value })
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
              defaultValue={selectproject?.startDate}
              placeholder="Enter Start Date"
              onChange={(e) =>
                setProject({ ...project, startDate: e.target.value })
              }
            />
            <label for="inputSalary" className="form-label">
              End Date
            </label>
            <input
              type="date"
              className="form-control rounded-0"
              id="inputSalary"
              placeholder="Enter End Date"
              autoComplete="off"
              defaultValue={selectproject?.endDate}
              onChange={(e) =>
                setProject({ ...project, endDate: e.target.value })
              }
            />
          </div>
         
          <div className="col-12">
            {
              projectId ?
              <button type="submit" className="btn btn-primary w-100">
              Update project
            </button>
            :
            <button type="submit" className="btn btn-primary w-100">
            Add project
          </button>
            }
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProject;
