import { Button, Collapse, IconButton, makeStyles,Paper,Grid,TextField, Box, TablePagination, FormControlLabel, Switch, Chip, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@material-ui/core';
import { Alert, Autocomplete } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import axios from 'axios';
import {apiBaseUrl} from '../../config';
import DateFnsUtils from '@date-io/date-fns';
import { IoIosAddCircle } from "react-icons/io";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

// Classes 
const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        padding: theme.spacing(0.5),
        margin: 0,
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

// Initial student
const initialDistribution = {
    studentid: null,
    date: null,
    shift: "",
    status: true,
    fooditemlist: [],
}

const ServeFood = () => {
    // states 
    const [currentView, setCurrentView] = useState(viewModesView);
    const [message,setMessage] = useState("");
    const [openSuccess,setOpenSuccess] = useState(false);
    const [openFailure,setOpenFailure] = useState(false);
    const [distribution,setDistribution] = useState(initialDistribution)
    const [allDistributions,setAllDistributions] = useState([]);
    const [allStudents,setAllStudents] = useState([]);
    const [allFoodItems,setAllFoodItems] = useState([]);
    const [selectedFoodItem,setSelectedFoodItem] = useState(null);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalStudent,setTotalStudent] = useState(0);
    const [page, setPage] = React.useState(0);
    const [foodItemsList,setFoodItemsList] = useState([]);

    // styles 
    const classes = useStyles();

    // helper functions
    const handleDelete = (chipToDelete) => () => {
        setFoodItemsList((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
      };
    const clearFields = ()=> {
        setDistribution(initialDistribution);
    }
    const addDistribution = () => {
        if(!distribution.studentid) {
            setMessage("Student cannot be empty");
            setOpenFailure(true);
            return;
        }
        if(!distribution.date) {
            setMessage("Date cannot be empty");
            setOpenFailure(true);
            return;
        }
        if(distribution.shift==="" || distribution.shift === "NONE") {
            setMessage("Shift cannot be empty");
            setOpenFailure(true);
            return;
        }
        if(foodItemsList.length === 0) {
            setMessage("Food item list cannot be empty");
            setOpenFailure(true);
            return;
        }
        const newDate = new Date(distribution.date);
        newDate.setHours(0,0,0,0);
        const data = {...distribution,studentid:distribution.studentid?._id,fooditemlist:foodItemsList,date:newDate.toISOString()};
        console.log(data);
        axios({
            method: "POST",
            url: `${apiBaseUrl}/distribution/new`,
            headers: {
              "Content-Type": "application/json",
            },
            data: JSON.stringify(data)
          })
          .then(()=> {
            setMessage("Distribution Added Successfully");
            setOpenSuccess(true);
            clearFields();
            setCurrentView(viewModesView);
            getAllDistributions(page,rowsPerPage);
            setSelectedFoodItem(null);
            setFoodItemsList([]);
          })
          .catch((err)=> {
            setMessage(err?.response?.data || "Couldn't Add Distribution");
            setOpenFailure(true);
        })
    }
    const getAllDistributions = (rPage,rRowsPerPage)=> {
        axios({
            method: "POST",
            url: `${apiBaseUrl}/distribution/get_all_populated/${rPage}/${rRowsPerPage}`,
            headers: {
              "Content-Type": "application/json",
            },
            data: JSON.stringify({})
          })
          .then((res)=> {
              console.log(res.data.results);
            res.data.results ? setAllDistributions(res.data.results) : setAllDistributions([]);
            res.data.totaldistribution ? setTotalStudent(res.data.totaldistribution) : setTotalStudent(0);
          })
          .catch((err)=> {
            setMessage(err?.response?.data || "Couldn't Get All Distributions");
            setOpenFailure(true);
        })
    }
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
        getAllDistributions(0,+event.target.value);
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        getAllDistributions(newPage,rowsPerPage);
    };
    const getAllStudents = ()=> {
        axios({
            method: "POST",
            url: `${apiBaseUrl}/student/get_all/${-1}/${-1}`,
            headers: {
              "Content-Type": "application/json",
            },
            data: JSON.stringify({})
          })
          .then((res)=> {
            res.data.results ? setAllStudents(res.data.results) : setAllStudents([]);
          })
          .catch((err)=> {
            setMessage(err?.response?.data || "Couldn't Get All Students");
            setOpenFailure(true);
        })
    }
    const getAllFoodItems = ()=> {
        axios({
            method: "POST",
            url: `${apiBaseUrl}/food-item/get_all/${-1}/${-1}`,
            headers: {
              "Content-Type": "application/json",
            },
            data: JSON.stringify({})
          })
          .then((res)=> {
            res.data.results ? setAllFoodItems(res.data.results) : setAllFoodItems([]);
          })
          .catch((err)=> {
            setMessage(err?.response?.data || "Couldn't Get All Students");
            setOpenFailure(true);
        })
    }
    // useeffects
    useEffect(()=> {
        getAllDistributions(0,10);
        getAllStudents();
        getAllFoodItems();
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
                    disabled={ currentView !== viewModesNew }
                    variant="contained" color="primary" className={classes.button}
                    onClick={()=>{
                        setOpenSuccess(false);
                        setOpenFailure(false);
                        addDistribution();
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
                        getAllDistributions(0,10);
                        setSelectedFoodItem(null);
                        setFoodItemsList([]);
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
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <Autocomplete
                            size="small"
                            disabled={currentView !== viewModesNew}
                            value={distribution.studentid}
                            onChange={(event, newValue) => {
                                setDistribution({...distribution,studentid:newValue});
                            }}
                            id="controllable-states-demo"
                            fullWidth
                            options={allStudents}
                            getOptionLabel={(option) => option?.roll}
                            renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Choose Student Roll"
                                variant="outlined"
                            />
                            )}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid container justifyContent="space-around">
                                <KeyboardDatePicker
                                    disabled={currentView !== viewModesNew}
                                    value={distribution.date}
                                    maxDate={new Date()}
                                    size='small'
                                    autoOk
                                    variant="inline"
                                    inputVariant="outlined"
                                    label="Date"
                                    format="MM/dd/yyyy"
                                    InputAdornmentProps={{ position: "end" }}
                                    onChange={(e) => {
                                        if(!isNaN(e.getHours())) {
                                            setDistribution({ ...distribution, date: e})
                                        }
                                    }}
                                    KeyboardButtonProps={{
                                    "aria-label": "change time",
                                    }}
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item xs={2}>
                        <FormControl variant="outlined" className={classes.formControl} size="small">
                            <InputLabel id="demo-simple-select-outlined-label">Shift</InputLabel>
                                <Select
                                    disabled={currentView !== viewModesNew}
                                    size="small"
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={distribution.shift}
                                    onChange={(e)=> {
                                        setDistribution({...distribution,shift:e.target.value}); 
                                    }}
                                    label="Status"
                                >
                                    <MenuItem value={"NONE"}>NONE</MenuItem>
                                    <MenuItem value={"MORNING"}>MORNING</MenuItem>
                                    <MenuItem value={"NOON"}>NOON</MenuItem>
                                    <MenuItem value={"AFTERNOON"}>AFTERNOON</MenuItem>
                                </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                            <Autocomplete
                                disabled={currentView !== viewModesNew}
                                data-testid="option-autocomplete"
                                value={selectedFoodItem}
                                onChange={(e, newValue) => { setSelectedFoodItem(newValue) }}
                                size="small"
                                fullWidth
                                id="combo-box-demo"
                                options={allFoodItems}
                                getOptionLabel={(option) => option?.name}
                                renderInput={(params) => <TextField {...params} label="Select Food Item" variant="outlined" />}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <Button color="primary" disabled={currentView !== viewModesNew}
                                onClick={() => {
                                    const chck = foodItemsList.find(ct => ct?._id === selectedFoodItem?._id);
                                    if (!chck) {
                                        setFoodItemsList([...foodItemsList,selectedFoodItem]);
                                    }
                                    setSelectedFoodItem(null);
                                }}
                                variant="contained" >
                                <IoIosAddCircle style={{ fontSize: "1.2rem" }} />
                            </Button>
                        </Grid>
                        <Grid item>
                            <Paper component="ul" className={classes.root}>
                                {foodItemsList.map((data) => {
                                    return (
                                    <li key={data._id}>
                                        <Chip
                                            color='primary'
                                            label={data.name}
                                            onDelete={handleDelete(data)}
                                            className={classes.chip}
                                        />
                                    </li>
                                    );
                                })}
                            </Paper>
                        </Grid>
                </Grid>
            </Paper>
            <Box style={{display:"flex",justifyContent:"center"}}>
                <Paper style={{width:"100%",marginTop:"2rem"}}>
                    <TableContainer style={{overflowY:"scroll",maxHeight:440}}>
                        <Table stickyHeader aria-label="sticky table" size='small'>
                            <TableHead style={{backgroundColor:"#aaa"}}>
                            <TableRow hover>
                                <TableCell component="th" scope="row">Name</TableCell>
                                <TableCell align="right">Roll</TableCell>
                                <TableCell align="right">Class</TableCell>
                                <TableCell align="right">Hall</TableCell>
                                <TableCell align="right">Date</TableCell>
                                <TableCell align="right">Shift</TableCell>
                                <TableCell align="right">Status</TableCell>
                                <TableCell align="right">Food Item List</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            { allDistributions?.map((row) => (
                                <TableRow key={row?._id} hover>
                                    <TableCell component="th" scope="row">{row?.student?.fullname}</TableCell>
                                    <TableCell align="right">{row?.student?.roll}</TableCell>
                                    <TableCell align="right">{row?.student?.class}</TableCell>
                                    <TableCell align="right">{row?.student?.hall}</TableCell>
                                    <TableCell align="right">{new Date(row?.date).toLocaleDateString()}</TableCell>
                                    <TableCell align="right">{row?.shift}</TableCell>
                                    <TableCell align="right">
                                        <Chip label={row?.student?.status ? "Active" : "Inactive"} style={row?.student?.status ? {backgroundColor:"green",color:"white"} : {backgroundColor:"red",color:"white"}}></Chip>
                                    </TableCell>
                                    <TableCell align="right">
                                    {
                                        row?.fooditemlist?.map(fd=> (
                                            <Chip label={fd?.name} color="primary"></Chip>
                                        ))
                                    }
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

export default ServeFood;