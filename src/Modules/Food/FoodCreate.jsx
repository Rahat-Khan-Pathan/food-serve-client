import { Button, Collapse, IconButton, makeStyles,Paper,Grid,TextField, Box, TablePagination } from '@material-ui/core';
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

// Initial food item 
const initialFoodItem = {
    name:"",
    price:0,
}

const FoodCreate = () => {
    // states 
    const [currentView, setCurrentView] = useState(viewModesView);
    const [message,setMessage] = useState("");
    const [openSuccess,setOpenSuccess] = useState(false);
    const [openFailure,setOpenFailure] = useState(false);
    const [foodItem,setFoodItem] = useState(initialFoodItem)
    const [allFoodItems,setAllFoodItems] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalFoodItem,setTotalFoodItem] = useState(0);
    const [page, setPage] = React.useState(0);

    // styles 
    const classes = useStyles();

    // helper functions
    const clearFields = ()=> {
        setFoodItem(initialFoodItem);
    }
    const addFoodItem = () => {
        if(foodItem.name==="") {
            setMessage("Name cannot be empty");
            setOpenFailure(true);
            return;
        }
        axios({
            method: "POST",
            url: `${apiBaseUrl}/food-item/new`,
            headers: {
              "Content-Type": "application/json",
            },
            data: JSON.stringify(foodItem)
          })
          .then(()=> {
            setMessage("Food Item Added Successfully");
            setOpenSuccess(true);
            clearFields();
            setCurrentView(viewModesView);
            getAllFoodItems(page,rowsPerPage);
          })
          .catch((err)=> {
            setMessage(err?.response?.data || "Couldn't Add Food Item");
            setOpenFailure(true);
        })
    }
    const modifyFoodItem = () => {
        if(foodItem.name==="") {
            setMessage("Name cannot be empty");
            setOpenFailure(true);
            return;
        }
        axios({
            method: "POST",
            url: `${apiBaseUrl}/food-item/modify/${foodItem?._id}`,
            headers: {
              "Content-Type": "application/json",
            },
            data: JSON.stringify(foodItem)
          })
          .then(()=> {
            setMessage("Food Item Modified Successfully");
            setOpenSuccess(true);
            clearFields();
            setCurrentView(viewModesView);
            getAllFoodItems(page,rowsPerPage);
          })
          .catch((err)=> {
            setMessage(err?.response?.data || "Couldn't Modify Food Item");
            setOpenFailure(true);
        })
    }
    const getAllFoodItems = (rPage,rRowsPerPage)=> {
        axios({
            method: "POST",
            url: `${apiBaseUrl}/food-item/get_all/${rPage}/${rRowsPerPage}`,
            headers: {
              "Content-Type": "application/json",
            },
            data: JSON.stringify({})
          })
          .then((res)=> {
            res.data.results ? setAllFoodItems(res.data.results) : setAllFoodItems([]);
            res.data.totalfooditem ? setTotalFoodItem(res.data.totalfooditem) : setTotalFoodItem(0);
          })
          .catch((err)=> {
            setMessage(err?.response?.data || "Couldn't Get All Food Item");
            setOpenFailure(true);
        })
    }
    const deleteFoodItem = id=> {
        axios({
            method: "POST",
            url: `${apiBaseUrl}/food-item/delete_by_id/${id}`,
            headers: {
              "Content-Type": "application/json",
            },
            data: JSON.stringify({})
          })
          .then((res)=> {
            setMessage("Food Item Deleted Successfully");
            getAllFoodItems(page,rowsPerPage);
          })
          .catch((err)=> {
            setMessage(err?.response?.data || "Couldn't Delete Food Item");
            setOpenFailure(true);
        })
    }
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
        getAllFoodItems(0,+event.target.value);
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        getAllFoodItems(newPage,rowsPerPage);
    };
    // useeffects
    useEffect(()=> {
        getAllFoodItems(0,10);
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
                        currentView === viewModesEdit ? modifyFoodItem() : addFoodItem();
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
                        setPage(0);
                        setRowsPerPage(10);
                        getAllFoodItems(0,10);
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
                    <Grid item xs={6}>
                        <TextField
                            size="small"
                            disabled={currentView !== viewModesNew && currentView !== viewModesEdit}
                            id="outlined-basic"
                            label="Food Name"
                            variant="outlined"
                            value={foodItem.name}
                            fullWidth
                            onChange={(e)=> setFoodItem({...foodItem,name:e.target.value})}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            type="number"
                            inputProps={{ min: 0}}
                            size="small"
                            disabled={currentView !== viewModesNew && currentView !== viewModesEdit}
                            id="outlined-basic"
                            label="Cost Price"
                            variant="outlined"
                            value={foodItem.price}
                            fullWidth
                            onChange={(e)=> setFoodItem({...foodItem,price:parseFloat(e.target.value)})}
                        />
                    </Grid>
                </Grid>
            </Paper>
            <Box style={{display:"flex",justifyContent:"center"}}>
                <Paper style={{width:"60%",marginTop:"2rem"}}>
                    <TableContainer style={{overflowY:"scroll",maxHeight:440}}>
                        <Table stickyHeader aria-label="sticky table" size='small'>
                            <TableHead style={{backgroundColor:"#aaa"}}>
                            <TableRow hover>
                                <TableCell>Actions</TableCell>
                                <TableCell align="right">Name</TableCell>
                                <TableCell align="right">Price</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {   allFoodItems?.map((row) => (
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
                                                            setFoodItem(row);
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
                                                            deleteFoodItem(row?._id);
                                                        }}
                                                        >
                                                        <AiFillDelete></AiFillDelete>
                                                    </Button>
                                                </Tooltip>
                                            </Grid>
                                        </Grid>
                                    </TableCell>
                                    <TableCell align="right">{row?.name}</TableCell>
                                    <TableCell align="right">{row?.price}</TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 50]}
                        component="div"
                        count={totalFoodItem}
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

export default FoodCreate;