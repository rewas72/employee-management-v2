import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";

const router = express.Router();


router.post("/adminlogin", (req, res) => {
  const sql = "SELECT * from admin Where email = ? and password = ?";
  con.query(sql, [req.body.email, req.body.password], (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });
    if (result.length > 0) {
      const email = result[0].email;
      const token = jwt.sign(
        { role: "admin", email: email, id: result[0].id },
        "jwt_secret_key",
        { expiresIn: "1d" }
      );
      res.cookie('token', token)
      return res.json({ loginStatus: true });
    } else {
        return res.json({ loginStatus: false, Error:"wrong email or password" });
    }
  });
});

router.get('/category', (req, res) => {
    const sql = "SELECT * FROM category";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.post('/add_category', (req, res) => {
    const sql = "INSERT INTO category (`name`) VALUES (?)"
    con.query(sql, [req.body.category], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true})
    })
})

// image upload 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public/Images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({
    storage: storage
})
// end imag eupload 


//ÇALIŞAN EKLEME ÇIKARTMA VS.
router.post('/add_employee', (req, res) => {
    console.log(req.body); // Gelen veriyi kontrol edin

    const sql = `INSERT INTO employee 
    (email, password, fullname, position) 
    VALUES (?)`;

    // Password'ü hashlemeden doğrudan al
    const values = [
        req.body.email,
        req.body.password, // Hashleme yok
        req.body.fullname,
        req.body.position,
    ];

    con.query(sql, [values], (err, result) => {
        if (err) {
            console.error("Database Error:", err.message);
            return res.json({ Status: false, Error: err.message });
        }
        return res.json({ Status: true });
    });
});



router.get('/employee', (req, res) => {
    const { employeeId } = req.query;

    let sql = "SELECT * FROM employee";
    if (employeeId) {
        sql += " WHERE employeeId = ?";
    }
    con.query(sql, employeeId ? [employeeId] : [], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.get('/employee/:employeeId', (req, res) => {
    const employeeId = req.params.employeeId;
    const sql = "SELECT * FROM employee WHERE employeeId = ?";
    con.query(sql,[employeeId], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.put('/edit_employee/:userId', (req, res) => {
    const employeeId = req.params.userId;
    const fields = [];
    const values = [];
    if (req.body.fullname) {
        fields.push("fullname = ?");
        values.push(req.body.fullname);
    }
    if (req.body.email) {
        fields.push("email = ?");
        values.push(req.body.email);
    }
    if (req.body.position) {
        fields.push("position = ?");
        values.push(req.body.position);
    }

    values.push(employeeId);
    const sql = `UPDATE employee SET ${fields.join(", ")} WHERE employeeId = ?`;


    con.query(sql,values, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
            return res.json({Status: true, Result: result})
    })
})

router.delete('/delete_employee/:employeeId', (req, res) => {
    const employeeId = req.params.employeeId;
    const sql = "delete from employee where employeeId = ?"
    con.query(sql,[employeeId], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})
//çalışan  ile ilgili şeylerin sonu

//proje ekleme çıkartma vs.
router.post('/add_project', (req, res) => {
    const sql = `INSERT INTO project (projectName, startDate, endDate, taskData) VALUES (?)`;
    const values = [
      req.body.projectName,
      req.body.startDate,
      req.body.endDate,
      req.body.taskData,
    ];
  
    con.query(sql, [values], (err, result) => {
      if (err) return res.json({ Status: false, Error: err.message });
      return res.json({ Status: true });
    });
});

  

router.get('/project', (req, res) => {
    const sql = "SELECT * FROM project";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.get('/project/:projectId', (req, res) => {
    const projectId = req.params.projectId;
    const sql = "SELECT * FROM project WHERE projectId = ?";
    con.query(sql,[projectId], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.put('/edit_project/:projectId', (req, res) => {
    const projectId = req.params.projectId;
    const fields = [];
    const values = [];
    if (req.body.projectName) {
        fields.push("projectName = ?");
        values.push(req.body.projectName);
    }
    if (req.body.startDate) {
        fields.push("startDate = ?");
        values.push(req.body.startDate);
    }
    if (req.body.endDate) {
        fields.push("endDate = ?");
        values.push(req.body.endDate);
    }
    if (req.body.taskData) {
        fields.push("taskData = ?");
        values.push(req.body.taskData);
    }

    values.push(projectId);
    const sql = `UPDATE project SET ${fields.join(", ")} WHERE projectId = ?`;

    con.query(sql, values, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

router.post('/add_project_data/:projectId', (req, res) => {
    const projectId = req.params.projectId;
    //const checkColumnsQuery = `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = ? AND TABLE_SCHEMA = ?`;

  /*   let columns = [{name:"taskId",type:"INT"},{name:"employeeId",type:"INT"},{name:"taskStatus",type:"varchar(50)"}]
    const alterQueries = columns.map(
        (column) => `ADD COLUMN taskData JSON`
      );
      const alterQuery = `ALTER TABLE project ADD COLUMN taskData JSON`; //bu yeni column ekleme önemli !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    
      // 2. Veri eklemek için INSERT INTO sorgusu oluştur
      const columnNames = columns.map((col) => col.name).join(', ');
      const placeholders = columns.map(() => '?').join(', ');
      const setClause = columns.map((col) => `${col.name} = ?`).join(', '); */
      const getQuery = `SELECT taskData FROM project WHERE projectId = ?`;
      const insertQuery = `UPDATE project SET taskData = ? WHERE projectId = ?`;

    //const sql = `INSERT INTO project (name, ) VALUES (?, ?)`
/*     const sql = `INSERT INTO project (taskId, employeeId, taskStatus)
VALUES (?, ?, ?)
ON DUPLICATE KEY UPDATE
    taskId = ?,
    employeeId = ?,
    taskStatus = ?;`; */

    const values = {taskId:req.body.taskId,employeeId:req.body.employeeId,taskStatus:req.body.taskStatus};
    let taskDataArray = [];
      con.query(getQuery, [projectId], (err, row) => {
        if (err) {
            console.error("Mevcut veriyi alırken hata oluştu:", err);
            return;
        }
    
        if (row) {
            try {
                let rowData = row.map(row => JSON.parse(row.taskData))[0];
                if(!!rowData){
                    taskDataArray = rowData;
                }
            } catch (parseError) {
                console.error("JSON parse hatası:", parseError);
                return;
            }
        }
    
        taskDataArray.push(values);
        const updatedTaskData = JSON.stringify(taskDataArray);
    
        con.query(insertQuery, [updatedTaskData, projectId], (updateErr) => {
            if (updateErr) {
                console.error("TaskData güncellenirken hata oluştu:", updateErr);
            } else {
                console.log("TaskData başarıyla güncellendi.");
            }
        });
    });

/*         con.query(insertQuery, [JSON.stringify(values),projectId], (insertErr, results) => {
          if (insertErr) {
            console.error('Error inserting data:', insertErr);
            return;
          }
          console.log('Data inserted successfully:', results);
        }); */
     
});

router.put('/update_task_status/:projectId', (req, res) => {
    const projectId = Number(req.params.projectId);
    const userId = Number(req.body.indexId);
    const sql = `
 UPDATE project
  SET taskData = JSON_REPLACE(
      taskData,
      '$[${userId}].taskStatus',
      ?
  )
  WHERE projectId = ?;
    `
    const values = [req.body.taskStatus, projectId];
    con.query(sql, values, (err, results) => {
        if(err){
            return res.json({Status: false, Error: "Error occurred:"+err})
        } else{
            console.log("Update successful:", results);
            return res.json({Status: true, Result: results})
        }
    });
})

router.delete('/delete_project/:projectId', (req, res) => {
    const projectId = req.params.projectId;
    const sql = "delete from project where projectId = ?"
    con.query(sql,[projectId], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})
//proje ile ilgili şeylerin sonu

// task(göre ile ilgili şeyler)

router.post('/add_task', (req, res) => {
    const sql = `INSERT INTO task (taskName, startDate, endDate, manDay, status, delay) VALUES (?)`;
    const values = [
      req.body.taskName,
      req.body.startDate,
      req.body.endDate,
      req.body.manDay,
      req.body.status,
      req.body.delay,
    ];
  
    con.query(sql, [values], (err, result) => {
        console.log(req.query);
      if (err) return res.json({ Status: false, Error: err.message });
      return res.json({ Status: true });
    });
});

router.get('/task', (req, res) => {
    const { taskId } = req.query;

    let sql = "SELECT * FROM task";
    if (taskId) {
        sql += " WHERE taskId = ?";
    }
    //const sql = "SELECT * FROM task";
    con.query(sql, taskId ? [taskId] : [], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.delete('/delete_task/:taskId', (req, res) => {
    const taskId = req.params.taskId;
    const sql = "delete from task where taskId = ?"
    con.query(sql,[taskId], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

router.get('/task/:projectId', (req, res) => {
    const projectId = req.params.projectId;
    const sql = `SELECT t.taskId, t.taskName, t.startDate, t.endDate, 
                        t.status, e.fullname as assignedEmployee 
                 FROM task t 
                 LEFT JOIN employee e ON t.employeeId = e.employeeId 
                 WHERE t.projectId = ?`;
  
    con.query(sql, [projectId], (err, result) => {
      if (err) return res.json({ Status: false, Error: "Query Error" });
      return res.json({ Status: true, Result: result });
    });
  });
  

  router.get('/task/:employeeId', (req, res) => {
    const employeeId = req.params.employeeId;
    const sql = `SELECT t.taskId, t.taskName, t.startDate, t.endDate, 
                        t.status, e.fullname as assignedEmployee 
                 FROM task t 
                 LEFT JOIN employee e ON t.employeeId = e.employeeId 
                 WHERE t.employeeId = ?`;
  
    con.query(sql, [employeeId], (err, result) => {
      if (err) return res.json({ Status: false, Error: "Query Error" });
      return res.json({ Status: true, Result: result });
    });
  });

router.get('/task', (req, res) => {
    const sql = "SELECT * FROM task";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.get('/task/:taskId', (req, res) => {
    const taskId = req.params.taskId;
    const sql = "SELECT * FROM task WHERE taskId = ?";
    con.query(sql,[taskId], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.put('/edit_task/:taskId', (req, res) => {
    const taskId = req.params.taskId;
    const fields = [];
    const values = [];
    if (req.body.taskName) {
        fields.push("taskName = ?");
        values.push(req.body.taskName);
    }
    if (req.body.startDate) {
        fields.push("startDate = ?");
        values.push(req.body.startDate);
    }
    if (req.body.endDate) {
        fields.push("endDate = ?");
        values.push(req.body.endDate);
    }
    if (req.body.manDay) {
        fields.push("manDay = ?");
        values.push(req.body.manDay);
    }
    if (req.body.delay) {
        fields.push("delay = ?");
        values.push(req.body.delay);
    }

    values.push(taskId);
    const sql = `UPDATE task SET ${fields.join(", ")} WHERE taskId = ?`;

    con.query(sql, values, (err, result) => {
        if (err) {
            console.error("Query Error:", err);
            return res.status(500).json({ Status: false, Error: "Query Error: " + err });
        }
        return res.json({ Status: true, Result: result });
    });
});


router.delete('/delete_task/:taskId', (req, res) => {
    const taskId = req.params.taskId;
    const sql = "delete from task where taskId = ?"
    con.query(sql,[taskId], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})
//task(görev ile ilgili şeylerin sonu)


router.get('/admin_count', (req, res) => {
    const sql = "select count(id) as admin from admin";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})


router.get('/employee_count', (req, res) => {
    const sql = "select count(employeeId) as employee from employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

router.get('/salary_count', (req, res) => {
    const sql = "select sum(salary) as salaryOFEmp from employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

router.get('/admin_records', (req, res) => {
    const sql = "select * from admin"
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({Status: true})
})

export { router as adminRouter };
