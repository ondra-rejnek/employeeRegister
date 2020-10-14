import React, { useState, useEffect } from 'react'
import EmployeeForm from './EmployeeForm'
import PageHeader from '../../components/PageHeader';
import PeopleAltTwoToneIcon from '@material-ui/icons/PeopleAltTwoTone';
import { InputAdornment, makeStyles, Paper, TableBody, TableCell, TableRow, Toolbar } from '@material-ui/core';
import useTable from '../../components/UseTable';
import * as employeeService from '../../services/employeeService';
import Controls from '../../components/controls/Controls';
import { Search } from '@material-ui/icons'
import AddIcon from '@material-ui/icons/Add'
import Popup from '../../components/Popup'
import CloseIcon from '@material-ui/icons/Close';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import Notification from '../../components/controls/Notification';
import ConfirmDialog from '../../components/ConfirmDialog';

const useStyle = makeStyles(theme => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3),
  },
  searchInput: {
    width: '75%'
  },
  newButton: {
    position: 'absolute',
    right: '10px',
  }
}))

const headCells = [
  {id: 'fullName', label: 'Employee Name'},
  {id: 'email', label: 'Email Address (Personal)'},
  {id: 'mobile', label: 'Mobile Number'},
  {id: 'department', label: 'Department', disableSorting: true},
  {id: 'actions', label: 'Actions', disableSorting: true}
]

export default function Employees() {

  const classes = useStyle();

  const [records, setRecords] = useState([]);
  const [recordForEdit, setRecordForEdit] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filterFn, setFilterFn] = useState({fn: items => {return items}});
  const [openPopup, setOpenPopup] = useState(false)
  const [notify, setNotify] = useState({isOpen: false, message: '', type: ''})
  const [confirmDialog, setConfirmDialog] = useState({isOpen: false, title: '', subTitle: ''})

  const{ 
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPaginAndSorting,
  } = useTable(records, headCells, filterFn);

  const handleSearch = e => {
    let target = e.target;
    setFilterFn({
      fn: items => {
        if(target.value === '')
          return items;
        else
          return items.filter(x => x.fullName.toLowerCase().includes(target.value))
      }
    })
  }

  const getData = async() => {
    setLoading(true)
    setRecords(await employeeService.getEmployees())
    setLoading(false)
  }

  const addOrEdit = async (employee, resetForm) => {
    if(employee.id === 0) {
      await employeeService.insertEmployee(employee)
    } else {
      await employeeService.updateEmployee(employee)
    }
    resetForm()
    setRecordForEdit(null)
    setOpenPopup(false)
    setRecords(getData())
    setNotify({
      isOpen: true,
      message: 'Submitted Succesfuly',
      type: 'success'
    })
  }

  const onDelete = async (id) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    })
    await employeeService.deleteEmployee(id);
    setRecords(getData());
    setNotify({
      isOpen: true,
      message: 'Deleted Successfully',
      type: 'error'
    })
  }

  const openInPopup = item => {
    setRecordForEdit(item)
    setOpenPopup(true)
  }

  useEffect(() => {
    getData()
  },[])

  return (
    <>
      <PageHeader
            title='New Employee'
            subTitle='Form design with validation'
            icon={<PeopleAltTwoToneIcon fontSize='large'/>}
          />
      <Paper className={classes.pageContent}>
        <Toolbar>
          <Controls.Input
          className={classes.searchInput}
          label='Search Employees'
          InputProps={{
            startAdornment: (<InputAdornment position='start'>
              <Search />
            </InputAdornment>)
          }}
          onChange={handleSearch}
          />
          <Controls.Button
          text='Add New'
          variant='outlined'
          startIcon={<AddIcon />} 
          className={classes.newButton}
          onClick={() => {setOpenPopup(true); setRecordForEdit(null); }} />
        </Toolbar>
        <TblContainer>
          <TblHead />
          <TableBody>
            {loading ? <p>Loading...</p> :
              recordsAfterPaginAndSorting().map((record, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{record.fullName}</TableCell>
                    <TableCell>{record.email}</TableCell>
                    <TableCell>{record.mobile}</TableCell>
                    <TableCell>{record.department}</TableCell>
                    <TableCell>
                      <Controls.ActionButton
                      color='primary'>
                        <EditOutlinedIcon fontSize='small'
                        onClick={()=> {openInPopup(record)}} />
                      </Controls.ActionButton>
                      <Controls.ActionButton
                        color='secondary'
                        onClick={() => {
                          setConfirmDialog({
                            isOpen: true,
                            title: 'Are you sure to delete this record?',
                            subTitle: 'You cant undo this operation',
                            onConfirm: () => { onDelete(record.id) }
                          })
                          //onDelete(record.id)
                        }} >
                        <CloseIcon fontSize='small'/>
                      </Controls.ActionButton>
                    </TableCell>
                  </TableRow>
                )
              })
            }
          </TableBody>
        </TblContainer>
        <TblPagination />
      </Paper>
      <Popup
      title={'Employee Form'}
      openPopup={openPopup}
      setOpenPopup={setOpenPopup}>
        <EmployeeForm 
        recordForEdit={recordForEdit}
        addOrEdit={addOrEdit} />
      </Popup>
      <Notification 
        notify={notify}
        setNotify={setNotify} />
      <ConfirmDialog 
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog} />
    </>
  )
}
