import axios from 'axios';

const api = axios.create({
  baseURL: `https://employee-register-35f1f.firebaseio.com/api/`
})

export const getDepartmentCollection = async () => {
  try{
    const response = await api.get(`/departments.json`)
    const responseArr = Object.values(response.data)
    //console.log(responseArr)
    return responseArr
  }
  catch(error) {
    console.error(error);
  }
}

export const insertEmployee = async (postData) => {
  try {
    const response = await api.post(`/employees.json`, postData)
    console.log(response);
  } 
  catch(error){
    console.error(error);
  };
}

export const updateEmployee = async (data) => {
  //console.log(data)
  let response = await api.get(`/employees.json`)
  const idArr = Object.keys(response.data)
  let employees = response.data
  //console.log(employees)
  let recordId = idArr.find(x => x === data.id);
  //console.log(recordId)
  employees[recordId] = { ...data } 
  //console.log(employees)
  await api.put(`/employees.json`, employees)
}

export const deleteEmployee = async (id) => {
  let response = await api.get(`/employees.json`)
  const idArr = Object.keys(response.data)
  let employees = response.data
  //console.log(employees)
  let recordId = idArr.find(x => x === id);
  //console.log(recordId)
  await axios.delete(`https://employee-register-35f1f.firebaseio.com/api/employees/${recordId}.json`);
}

export const getEmployees = async () => {
  try{
    const response = await api.get(`/employees.json`)
    const idArr = Object.keys(response.data)
    //console.log(idArr)
    const responseArr = Object.values(response.data)
    //console.log(responseArr)
    let departments = await getDepartmentCollection();
    const employees = responseArr.map((employee, index) => ({
      ...employee,
      department: departments[employee.departmendId - 1].title,
      id: idArr[index],
    }))
    //console.log(employees)
    return employees
  }
  catch(error) {
    console.error(error);
  }
}
  