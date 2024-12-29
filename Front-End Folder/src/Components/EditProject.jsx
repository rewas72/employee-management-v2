import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const EditProject = () => {
    const {projectId} = useParams()
    const [project, setProject] = useState({
        projectName: "",
        startDate: "",
        endDate: "",
      });
      const navigate = useNavigate()

      useEffect(()=> {
        axios.get('http://localhost:3000/auth/project/'+projectId)
        .then(result => {
          console.log(result);
          if (result.data.Status) {
            setProject({
              ...project,
              projectId: result.data.Result[0].projectId,
              projectName: result.data.Result[0].projectName,
              startDate: result.data.Result[0].startDate,
              endDate: result.data.Result[0].endDate,
          }) 
        } else {
            console.log(result.data.Error);
        }
        }).catch(err => console.log(err))
    }, [projectId])

    const handleSubmit = (e) => {
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
        <h3 className="text-center">Edit Project</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label for="inputEmail4" className="form-label">
              projectName
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputEmail4"
              placeholder="Enter projectName"
              autoComplete="off"
              value={project.projectName}
              onChange={(e) =>
                setProject({ ...project, projectName: e.target.value })
              }
            />
          </div>
          <div className='col-12'>
            <label for="inputSalary" className="form-label">
              StartDate
            </label>
            <input
              type="date"
              className="form-control rounded-0"
              id="inputSalary"
              placeholder="Enter Salary"
              autoComplete="off"
              value={project.startDate}
              onChange={(e) =>
                setProject({ ...project, startDate: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label for="inputAddress" className="form-label">
              EndDate
            </label>
            <input
              type="date"
              className="form-control rounded-0"
              id="inputAddress"
              placeholder="1234 Main St"
              autoComplete="off"
              value={project.endDate}
              onChange={(e) =>
                setProject({ ...project, endDate: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Edit Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProject