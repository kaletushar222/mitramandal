import { combineReducers } from 'redux';
import incomeReducer from './incomeReducer';
import expenseReducer from './expenseReducer';
import authReducer from './authReducer';

const rootReducer = combineReducers({
    incomeReducer,
    expenseReducer,
    authReducer
})
export default rootReducer
