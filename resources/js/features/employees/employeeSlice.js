import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = { employeesData: [], isLoading: true }

export const getEmployeeData = createAsyncThunk(
  'employees/getEmployeeData',
  async (employee, thunkAPI) => {
    try {
      const { data } = await axios.get('http://127.0.0.1:8000/api/employees')
      return data.employees
    } catch (error) {
      return thunkAPI.rejectWithValue('Fehler beim abholen von Employees')
    }
  }
)

export const postEmployeeData = createAsyncThunk(
  'employees/postEmployeeData',
  async (employeeData, thunkAPI) => {
    try {
      const { data } = await axios.post(
        `http://127.0.0.1:8000/api/employees/`,
        {
          employeeData,
        }
      )
    } catch (error) {
      return thunkAPI.rejectWithValue('Fehler beim anlegen des Employee')
    }
  }
)

export const updateEmployeeData = createAsyncThunk(
  'employees/updateEmployeeData',
  async (employeeData, thunkAPI) => {
    try {
      const { data } = await axios.patch(
        `http://127.0.0.1:8000/api/employees/${employeeData.id}`,
        {
          employeeData,
        }
      )
      return data.employee
    } catch (error) {
      return thunkAPI.rejectWithValue('Fehler beim anlegen des Employee')
    }
  }
)

export const deleteEmployeeData = createAsyncThunk(
  'employees/deleteEmployeeData',
  async (employee_id, thunkAPI) => {
    try {
      const { data } = await axios.delete(
        `http://127.0.0.1:8000/api/employees/${employee_id}`
      )
      return data.deleted_employee
    } catch (error) {
      return thunkAPI.rejectWithValue('Fehler beim löschen von dem Employee')
    }
  }
)

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    clearEmployees: (state) => {
      state.employeesData = []
    },
    fillEmployees: (state, actions) => {
      state.employeesData = actions
    },
    removeEmployee: (state, { payload }) => {
      state.employeesData = state.employeesData.find(
        (employee) => employee.id === payload.id
      )
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEmployeeData.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getEmployeeData.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.employeesData = payload
      })
      .addCase(getEmployeeData.rejected, (state, { payload }) => {
        state.errorMessage = payload
        state.isLoading = false
        state.hasError = true
      })
      .addCase(postEmployeeData.pending, (state) => {
        state.isLoading = true
      })
      .addCase(postEmployeeData.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.employeesData.push(payload)
      })
      .addCase(postEmployeeData.rejected, (state, { payload }) => {
        state.errorMessage = payload
        state.isLoading = false
        state.hasError = true
      })
      .addCase(updateEmployeeData.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateEmployeeData.fulfilled, (state, { payload }) => {
        state.isLoading = false
        const employee = state.employeesData.filter(
          (employee) => employee.id !== payload.id
        )
        state.employeeData = { ...employee, payload }
      })
      .addCase(updateEmployeeData.rejected, (state, { payload }) => {
        state.errorMessage = payload
        state.isLoading = false
        state.hasError = true
      })
      .addCase(deleteEmployeeData.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteEmployeeData.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.employeesData = state.employeesData.filter(
          (employee) => employee.id !== payload.id
        )
      })
      .addCase(deleteEmployeeData.rejected, (state, { payload }) => {
        state.errorMessage = payload
        state.isLoading = false
        state.hasError = true
      })
  },
})

export const { clearEmployees, fillEmployees } = employeesSlice.actions

export default employeesSlice.reducer
