import React, {useState, useEffect} from 'react';
import SignUp from './../Components/SignUp';
import Login from './../Components/Login';

export function HomePage() {
  const [userDetails, setUserDetails] = useState({isLoggedIn: false, userName: ''});

  const HandleLogin = (userName) => {
    setUserDetails({isLoggedIn: true, userName})
  }

  const logout = () => {
    sessionStorage.clear();
    setUserDetails({isLoggedIn: false, userName: ''});
  }

  useEffect(() => { if(sessionStorage.login_token){ setUserDetails({isLoggedIn: true, userName: sessionStorage.user_name})} }, []);
  var divStyle = {
    display: 'flex',
    justifyContent: 'space-evenly',
    width: '100%'
  };

  return(
  <header className="App-header">
      { userDetails.isLoggedIn ? 
        (<div>
          <p>Check you out {userDetails.userName} ! All logged in, now there's nothing left todo, except to refresh, or logout.</p>
          <button onClick={logout}>Logout</button>
        </div>) :
        (<div>
          <p>Hello! Looks like you're not logged in yet.</p>
          <p>Please log in, or sign up down below. </p>
          <div style={divStyle}>
          <SignUp />
          <Login login={HandleLogin} />
          </div>
        </div>)
      }
  </header>
  );
}