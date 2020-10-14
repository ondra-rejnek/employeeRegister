import { Grid } from '@material-ui/core';
import React, { useState, useEffect } from 'react'
import { useForm, Form } from '../../components/useForm'
import Controls from '../../components/controls/Controls';
import * as employeeService from '../../services/employeeService';

const genderItems = [
  {id: 'male', title: 'Male'},
  {id: 'female', title: 'Female'},
  {id: 'other', title: 'Other'},
]

const initialFValues = {
  fullName: '',
  email: '',
  mobile: '',
  city: '',
  gender: 'male',
  departmendId: '',
  hireDate: new Date(),
  isPermanent: false,
  id: 0,
}

export default function EmployeeForm(props) {

  const { addOrEdit, recordForEdit } = props

  const [options, setOptions] = useState('')
  const [loading, setLoading] = useState(true)

  const validate = (fieldValues = values) => {
    let temp = {...errors}
    if('fullName' in fieldValues)
      temp.fullName = fieldValues.fullName ? '' : 'This field is required';
    if('email' in fieldValues)
      temp.email = (/$^|.+@.+..+/).test(fieldValues.email) ? '' : 'Email is not valid';
    if('mobile' in fieldValues)
      temp.mobile = fieldValues.mobile.length > 8 ? '' : 'Minimum 9 numbers required';
    if('departmendId' in fieldValues)
      temp.departmendId = fieldValues.departmendId.length !== 0 ? '' : 'This field is required';
    setErrors({
      ...temp
    })
    if(fieldValues === values)
      return Object.values(temp).every(x => x === '');
  }

  const {
    values,
    setValues,
    handleInputChange,
    errors,
    resetForm,
    setErrors,
  } = useForm(initialFValues, true, validate);

  const handleSubmit = e => {
    e.preventDefault();
    if(validate()) {
      addOrEdit(values, resetForm);
    }
  }

  const getData = async() => {
    setOptions(await employeeService.getDepartmentCollection())
    setLoading(false)
  }

  useEffect(() => {
    getData()
    if(recordForEdit !== null)
    setValues({
      ...recordForEdit
    })
  },[recordForEdit])

  return (
    <>
    {loading ? <p>Loading...</p> :
    <Form onSubmit={handleSubmit}>
      <Grid container>
        <Grid item xs={6}>
          <Controls.Input
          name='fullName'
          label='Full Name'
          value={values.fullName}
          onChange={handleInputChange}
          error={errors.fullName}
          />
          <Controls.Input
          label='Email'
          value={values.email}
          name='email'
          onChange={handleInputChange}
          error={errors.email}
          />
          <Controls.Input
          name='mobile'
          label='Mobile'
          value={values.mobile}
          onChange={handleInputChange}
          error={errors.mobile}
          />
          <Controls.Input
          name='city'
          label='City'
          value={values.city}
          onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={6}>
          <Controls.RadioGroup
          name='gender'
          label='Gender'
          value={values.gender}
          onChange={handleInputChange}
          items={genderItems}
          />
          <Controls.Select
          name='departmendId'
          label='Department'
          value={values.departmendId}
          onChange={handleInputChange}
          options={options}
          error={errors.departmendId}
          />
          <Controls.DatePicker
          name='hireDate'
          label='Hire Date'
          value={values.hireDate}
          onChange={handleInputChange}
          />
          <Controls.Checkbox 
          name='isPermanent'
          label='Permanent Employee'
          value={values.isPermanent}
          onChange={handleInputChange}
          />
        <div>
          <Controls.Button
          type='submit'
          text='Submit' />
          <Controls.Button
          color='default'
          text='Reset'
          onClick={resetForm} />
        </div>
        </Grid>
      </Grid>
    </Form>}
    </>
  )
}
