import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess, loginFailure, attemptLogin } from '../actions/authActions';
import axios from 'axios';
import { setInvoices } from '../actions/incomeActions';
import { setExpenses } from '../actions/expenseActions';
import { useNavigate } from 'react-router-dom';

const LoginWindow = () => {
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Try server-side login first
    try{
      const res = await axios.post((process.env.REACT_APP_API_ENDPOINT || '') + 'auth/login', { contact, password });
      if(res && res.data){
        const token = res.data.token || res.data.accessToken || null;
        const userFromServer = res.data.user || res.data.userInfo || res.data;
        const user = { ...userFromServer, token };
        try{ localStorage.setItem('mitramandal_user', JSON.stringify(user)); } catch(e){}
        dispatch(loginSuccess(user));
        // load group-scoped invoices/expenses into redux so totals reflect current group
        try{
          const gid = user.groupId || 'global';
          const invKey = 'mitramandal_invoices_' + gid;
          const expKey = 'mitramandal_expenses_' + gid;
          const utils = require('../utils/utils');
          const invsRaw = JSON.parse(localStorage.getItem(invKey) || '[]');
          const expsRaw = JSON.parse(localStorage.getItem(expKey) || '[]');
          const invs = utils.normalizeRecords(invsRaw, { groupId: user.groupId, groupName: user.groupName });
          const exps = utils.normalizeRecords(expsRaw, { groupId: user.groupId, groupName: user.groupName });
          dispatch(setInvoices(invs));
          dispatch(setExpenses(exps));
        }catch(err){ console.log('load group data failed', err) }
        setError(null);
        navigate('/mitramandal');
        return;
      }
    }
    catch(err){
      // server auth failed or unreachable — fallback to local attempt
      console.log('server login failed, falling back to local auth', err && err.response ? err.response.data : err.message || err);
      const result = attemptLogin(contact, password);
      if (result.success) {
        dispatch(loginSuccess(result.user));
        // load group-scoped invoices/expenses into redux so totals reflect current group
        try{
          const gid = result.user.groupId || 'global';
          const invKey = 'mitramandal_invoices_' + gid;
          const expKey = 'mitramandal_expenses_' + gid;
          const utils = require('../utils/utils');
          const invsRaw = JSON.parse(localStorage.getItem(invKey) || '[]');
          const expsRaw = JSON.parse(localStorage.getItem(expKey) || '[]');
          const invs = utils.normalizeRecords(invsRaw, { groupId: result.user.groupId, groupName: result.user.groupName });
          const exps = utils.normalizeRecords(expsRaw, { groupId: result.user.groupId, groupName: result.user.groupName });
          dispatch(setInvoices(invs));
          dispatch(setExpenses(exps));
        }catch(err){ console.log('load group data failed', err) }
        setError(null);
        navigate('/mitramandal');
        return;
      } else {
        dispatch(loginFailure(result.message));
        setError(result.message);
      }
    }
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card box">
            <div className="card-header">Login</div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="contact">Contact (username)</label>
                  <input value={contact} onChange={(e)=>setContact(e.target.value)} type="text" className="form-control" id="contact" placeholder="Enter contact number" required />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" className="form-control" id="password" placeholder="Password" required />
                </div>
                { error && <div className="text-danger my-2">{error}</div> }
                <button type="submit" className="btn btn-primary">Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginWindow;