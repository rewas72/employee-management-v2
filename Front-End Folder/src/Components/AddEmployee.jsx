import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AddEmployee = () => {
  const [employee, setEmployee] = useState({
    fullname:"",
    email: "",
    password: "",
    position: "",
  });
  const [currentEmployee, setCurrentEmployee] = useState([]);
  const navigate = useNavigate();
  const {userId} = useParams();



  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(employee);  // Konsolda veri doğru görünüyor

    // JSON kullanarak veriyi gönderin
    axios.post('http://localhost:3000/auth/add_employee', employee)
    .then(result => {
        if (result.data.Status) {
            navigate('/dashboard/employee');
        } else {
            alert(result.data.Error);
        }
    })
    .catch(err => console.log(err));
};

useEffect(() => {
  if(userId){
  axios
      .get("http://localhost:3000/auth/employee", {
        params: {employeeId:userId},
      })
      .then((result) => {
          console.log(result.data.Result,)
          if (result.data.Status) {
              setCurrentEmployee(result.data.Result[0]);
          } else {
              alert(result.data.Error);
          }
      })
      .catch((err) => console.log(err));
    }
}, [userId]);

const handleUpdate = (e) => {
  e.preventDefault()
  axios.put('http://localhost:3000/auth/edit_employee/' + userId, employee)
    .then(result => {
      if (result.data.Status) {
        navigate('/dashboard/employee')
      } else {
        alert(result.data.Error)
      }
    }).catch(err => console.log(err))
}


  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Add Employee</h3>
        <form className="row g-1" onSubmit={userId ? handleUpdate : handleSubmit}>
          <div className="col-12">
            <label for="inputEmail4" className="form-label">
              Email
            </label>
            <input
              type="mail"
              className="form-control rounded-0"
              id="inputEmail4"
              placeholder="Enter Email"
              defaultValue={currentEmployee?.email}
              autoComplete="off"
              onChange={(e) =>
                setEmployee({ ...employee, email: e.target.value })
              }
            />
            <label for="inputPassword4" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control rounded-0"
              id="inputPassword4"
              placeholder="Enter Password"
              onChange={(e) =>
                setEmployee({ ...employee, password: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label for="inputName" className="form-label">
              FullName
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputName"
              defaultValue={currentEmployee?.fullname}
              placeholder="Enter Name"
              onChange={(e) =>
                setEmployee({ ...employee, fullname: e.target.value })
              }
            />
          </div>
          
          <div className="col-12">
            
            <label for="inputSalary" className="form-label">
              Position
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputSalary"
              placeholder="Enter position"
              defaultValue={currentEmployee?.position}
              autoComplete="off"
              onChange={(e) =>
                setEmployee({ ...employee, position: e.target.value })
              }
            />
          </div>
          
          
          <div className="col-12">
            {
              userId ?
              <button type="submit" className="btn btn-primary w-100">
              Update Employee
            </button>
            :
            <button type="submit" className="btn btn-primary w-100">
            Add Employee
          </button>
            }
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;