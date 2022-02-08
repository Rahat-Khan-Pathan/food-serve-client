import { Button, Collapse, IconButton, makeStyles,Paper,Grid,TextField, Box, TablePagination, FormControlLabel, Switch, Chip } from '@material-ui/core';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import axios from 'axios';
import {apiBaseUrl} from '../../config';
import { IoIosPaper } from "react-icons/io";
import { AiFillDelete } from "react-icons/ai";

// Classes 
const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(1),
      textAlign: "center",
    },
    button: {
      marginRight: theme.spacing(2),
    },
    textfields: {
      "& > *": {
        margin: theme.spacing(1),
        width: "40ch",
      },
    },
    textfieldsLg: {
      margin: theme.spacing(1),
    },
    alert: {
      width: "100%",
      "& > *": {
        marginTop: theme.spacing(2),
      },
    },
    formControl: {
      width: "100%",
    },
    chip: {
      margin: theme.spacing(0.5),
    },
    grid : {
      marginBottom: theme.spacing(1)
    },
    tableContainer: {
        marginTop: "2rem",
    },
    table: {
        minWidth: 650,
    },
    divider: {
        borderRight: '4px solid #e0e0e0',
        marginRight: '2rem',
        marginLeft: '2rem',
        height:'30px'
    }
}));

// View Modes
const viewModesView = "VIEW";
const viewModesNew = "NEW";
const viewModesEdit = "EDIT";
const viewModesEditable = "EDITABLE";

// Initial student
const initialStudent = {
    fullname:"",
    roll: "",
    age:"",
    class:"",
    hall:"",
    status:true
}

const StudentCreate = () => {
    // states 
    const [currentView, setCurrentView] = useState(viewModesView);
    const [message,setMessage] = useState("");
    const [openSuccess,setOpenSuccess] = useState(false);
    const [openFailure,setOpenFailure] = useState(false);
    const [student,setStudent] = useState(initialStudent)
    const [allStudents,setAllStudents] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalStudent,setTotalStudent] = useState(0);
    const [page, setPage] = React.useState(0);

    // styles 
    const classes = useStyles();

    // helper functions
    const clearFields = ()=> {
        setStudent(initialStudent);
    }
    const addStudent = () => {
        if(student.fullname==="") {
            setMessage("Fullname cannot be empty");
            setOpenFailure(true);
            return;
        }
        if(student.role==="") {
            setMessage("Roll cannot be empty");
            setOpenFailure(true);
            return;
        }
        if(student.age==="") {
            setMessage("Age cannot be empty");
            setOpenFailure(true);
            return;
        }
        if(student.class==="") {
            setMessage("Class cannot be empty");
            setOpenFailure(true);
            return;
        }
        if(student.hall==="") {
            setMessage("Hall name cannot be empty");
            setOpenFailure(true);
            return;
        }
        axios({
            method: "POST",
            url: `${apiBaseUrl}/student/new`,
            headers: {
              "Content-Type": "application/json",
            },
            data: JSON.stringify(student)
          })
          .then(()=> {
            setMessage("Student Added Successfully");
            setOpenSuccess(true);
            clearFields();
            setCurrentView(viewModesView);
            getAllStudents(page,rowsPerPage);
          })
          .catch((err)=> {
            setMessage(err?.response?.data || "Couldn't Add Student");
            setOpenFailure(true);
        })
    }
    const modifyStudent = () => {
        if(student.fullname==="") {
            setMessage("Fullname cannot be empty");
            setOpenFailure(true);
            return;
        }
        if(student.role==="") {
            setMessage("Roll cannot be empty");
            setOpenFailure(true);
            return;
        }
        if(student.age==="") {
            setMessage("Age cannot be empty");
            setOpenFailure(true);
            return;
        }
        if(student.class==="") {
            setMessage("Class cannot be empty");
            setOpenFailure(true);
            return;
        }
        if(student.hall==="") {
            setMessage("Hall name cannot be empty");
            setOpenFailure(true);
            return;
        }
        axios({
            method: "POST",
            url: `${apiBaseUrl}/student/modify/${student?._id}`,
            headers: {
              "Content-Type": "application/json",
            },
            data: JSON.stringify(student)
          })
          .then(()=> {
            setMessage("Student Modified Successfully");
            setOpenSuccess(true);
            clearFields();
            setCurrentView(viewModesView);
            getAllStudents(page,rowsPerPage);
          })
          .catch((err)=> {
            setMessage(err?.response?.data || "Couldn't Modify Student");
            setOpenFailure(true);
        })
    }
    const getAllStudents = (rPage,rRowsPerPage)=> {
        axios({
            method: "POST",
            url: `${apiBaseUrl}/student/get_all/${rPage}/${rRowsPerPage}`,
            headers: {
              "Content-Type": "application/json",
            },
            data: JSON.stringify({})
          })
          .then((res)=> {
            res.data.results ? setAllStudents(res.data.results) : setAllStudents([]);
            res.data.totalstudent ? setTotalStudent(res.data.totalstudent) : setTotalStudent(0);
          })
          .catch((err)=> {
            setMessage(err?.response?.data || "Couldn't Get All Students");
            setOpenFailure(true);
        })
    }
    const deleteStudent = id=> {
        axios({
            method: "POST",
            url: `${apiBaseUrl}/student/delete_by_id/${id}`,
            headers: {
              "Content-Type": "application/json",
            },
            data: JSON.stringify({})
          })
          .then((res)=> {
            setMessage("Student Deleted Successfully");
            getAllStudents(page,rowsPerPage);
          })
          .catch((err)=> {
            setMessage(err?.response?.data || "Couldn't Delete Student");
            setOpenFailure(true);
        })
    }
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
        getAllStudents(0,+event.target.value);
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        getAllStudents(newPage,rowsPerPage);
    };
    const changeStudentStatus = (id,status)=> {
        const newStatus = status? "active" : "inactive";
        axios({
            method: "POST",
            url: `${apiBaseUrl}/student/modify_status/${id}/${newStatus}`,
            headers: {
              "Content-Type": "application/json",
            },
            data: JSON.stringify({})
          })
          .then((res)=> {
            getAllStudents(page,rowsPerPage);
          })
          .catch((err)=> {
            setMessage(err?.response?.data || "Couldn't Modify Student Status");
            setOpenFailure(true);
        })
    }
    // useeffects
    useEffect(()=> {
        getAllStudents(0,10);
    },[])
    return (
        <div>
            <div style={{marginBottom: '1rem',display:'flex',alignItems:'center'}}>
                <Button
                    size='small'
                    disabled={currentView !== viewModesView}
                    onClick={() => {
                        setCurrentView(viewModesNew)
                        setOpenFailure(false);
                        setOpenSuccess(false);
                    }}
                    variant="contained" color="secondary" className={classes.button}
                > CREATE NEW
                </Button>
                <Button
                    size='small'
                    disabled={currentView !== viewModesEditable}
                    onClick={() => {
                        setCurrentView(viewModesEdit);
                        setCurrentView(viewModesEdit);
                    }}
                    variant="contained" color="primary" className={classes.button}
                >
                    EDIT
                </Button>
                <Button
                    size='small'
                    disabled={ currentView !== viewModesNew && currentView !== viewModesEdit }
                    variant="contained" color="primary" className={classes.button}
                    onClick={()=>{
                        setOpenSuccess(false);
                        setOpenFailure(false);
                        currentView === viewModesEdit ? modifyStudent() : addStudent();
                    }}
                >
                    SAVE 
                </Button>
                <Button
                    size='small'
                    onClick={() => {
                        setCurrentView("VIEW");
                        setOpenFailure(false);
                        setOpenSuccess(false);
                        clearFields();
                        setRowsPerPage(10);
                        setPage(0);
                        getAllStudents(0,10);
                    }}
                    variant="contained"
                    className={classes.button}
                    >
                    CANCEL
                </Button>
            </div>
            <div style={{ marginTop: "1rem",marginBottom:"1rem" }}>
                <Collapse in={openSuccess}>
                    <Alert
                        action={
                        <IconButton aria-label="close" color="inherit" onClick={() => {setOpenSuccess(false)}}>
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                        }
                    >{message}
                    </Alert>
                </Collapse>
                <Collapse in={openFailure}>
                    <Alert
                        severity="error"
                        action={
                            <IconButton aria-label="close" color="inherit" onClick={() => { setOpenFailure(false)}}>
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                    > {message}
                    </Alert>
                </Collapse>
            </div>
            <Paper elevation={2} className={classes.paper}>
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center',marginBottom:"1rem" }}>
                    <FormControlLabel
                        control={
                            <Switch
                                size='small'
                                data-testid="user-status"
                                disabled={currentView !== viewModesNew && currentView !== viewModesEdit}
                                checked={student.status}
                                onChange={(e) => {
                                    setStudent({ ...student, status: e.target.checked })
                                }}
                                name="checkedB"
                                color="primary"
                            />
                        }
                        label={student.status? "Active" : "Inactive"}
                    />
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            size="small"
                            disabled={currentView !== viewModesNew && currentView !== viewModesEdit}
                            id="outlined-basic"
                            label="Full Name"
                            variant="outlined"
                            value={student.fullname}
                            fullWidth
                            onChange={(e)=> setStudent({...student,fullname:e.target.value})}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            size="small"
                            disabled={currentView !== viewModesNew && currentView !== viewModesEdit}
                            id="outlined-basic"
                            label="Roll"
                            variant="outlined"
                            value={student.roll}
                            fullWidth
                            onChange={(e)=> setStudent({...student,roll:e.target.value})}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            size="small"
                            disabled={currentView !== viewModesNew && currentView !== viewModesEdit}
                            id="outlined-basic"
                            label="Age"
                            variant="outlined"
                            value={student.age}
                            fullWidth
                            onChange={(e)=> setStudent({...student,age:e.target.value})}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            size="small"
                            disabled={currentView !== viewModesNew && currentView !== viewModesEdit}
                            id="outlined-basic"
                            label="Class"
                            variant="outlined"
                            value={student.class}
                            fullWidth
                            onChange={(e)=> setStudent({...student,class:e.target.value})}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            size="small"
                            disabled={currentView !== viewModesNew && currentView !== viewModesEdit}
                            id="outlined-basic"
                            label="Hall Name"
                            variant="outlined"
                            value={student.hall}
                            fullWidth
                            onChange={(e)=> setStudent({...student,hall:e.target.value})}
                        />
                    </Grid>
                </Grid>
            </Paper>
            <Box style={{display:"flex",justifyContent:"center"}}>
                <Paper style={{width:"100%",marginTop:"2rem"}}>
                    <TableContainer style={{overflowY:"scroll",maxHeight:440}}>
                        <Table stickyHeader aria-label="sticky table" size='small'>
                            <TableHead style={{backgroundColor:"#aaa"}}>
                            <TableRow hover>
                                <TableCell>Actions</TableCell>
                                <TableCell align="right">Full Name</TableCell>
                                <TableCell align="right">Roll</TableCell>
                                <TableCell align="right">Age</TableCell>
                                <TableCell align="right">Class</TableCell>
                                <TableCell align="right">Hall Name</TableCell>
                                <TableCell align="right">Status</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {   allStudents?.map((row) => (
                                <TableRow key={row?._id} hover>
                                    <TableCell component="th" scope="row">
                                        <Grid container spacing={1}>
                                            <Grid item xs={2}>
                                                <Tooltip title="Edit">
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        color="primary"
                                                        onClick={()=> {
                                                            setStudent(row);
                                                            setCurrentView(viewModesEditable);
                                                        }}
                                                        >
                                                        <IoIosPaper></IoIosPaper>
                                                    </Button>
                                                </Tooltip>
                                            </Grid>
                                            <Grid item xs={2}>
                                                <Tooltip title="Delete">
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        color="secondary"
                                                        onClick={()=> {
                                                            deleteStudent(row?._id);
                                                        }}
                                                        >
                                                        <AiFillDelete></AiFillDelete>
                                                    </Button>
                                                </Tooltip>
                                            </Grid>
                                            <Grid item xs={2}>
                                                <FormControlLabel 
                                                    control={
                                                        <Switch
                                                            size='small'
                                                            data-testid="user-status"
                                                            checked={row.status}
                                                            onChange={(e) => {
                                                                changeStudentStatus(row._id,e.target.checked);
                                                            }}
                                                            name="checkedB"
                                                            color="primary"
                                                        />
                                                    }
                                                    label={row.status? "Active" : "Inactive"}
                                                />
                                            </Grid>
                                        </Grid>
                                    </TableCell>
                                    <TableCell align="right">{row?.fullname}</TableCell>
                                    <TableCell align="right">{row?.roll}</TableCell>
                                    <TableCell align="right">{row?.age}</TableCell>
                                    <TableCell align="right">{row?.class}</TableCell>
                                    <TableCell align="right">{row?.hall}</TableCell>
                                    <TableCell align="right">
                                        <Chip label={row?.status ? "Active" : "Inactive"} style={row?.status ? {backgroundColor:"green",color:"white"} : {backgroundColor:"red",color:"white"}}></Chip>
                                    </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 50]}
                        component="div"
                        count={totalStudent}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Box>
        </div>
    );
};

export default StudentCreate;