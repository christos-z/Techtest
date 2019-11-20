import React, {useState} from 'react';
import InputComponent from './InputComponent';

const Login = ({login}) => {
  const [userDetails, setUserDetails] = useState({name: null, password: null, confirmPassword: null})
  const [formState, setFormValidState] = useState({isValid: true, invalidMessage: ""})


  const handleSubmit = (event) => {
    event.preventDefault();
    loginRequest(userDetails); 
  }

  //If I had time i'd refactor this to it's own service function in a different file.
  var query = `query Login($name: String!, $password: String!) {
    login(userName: $name, password: $password)
  }`;
  
  const loginRequest = (userDetails) => {
    fetch('http://localhost:4000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: userDetails,
      })
    })
    .then(r => r.json())
    .then(data => parseBackendResponse(data));
  }

  const parseBackendResponse = (response) => {
    if(response.errors) {
      setFormValidState({isValid: false, invalidMessage: response.errors[0].message});
    } else {
      sessionStorage['login_token'] = response.data.login;
      sessionStorage['user_name'] = userDetails.name;
      login(userDetails.name);
    }
  }
  
  const parseInput = (inputName, event) => setUserDetails({ ...userDetails, [inputName]: event.target.value });
    return(
    <div className="container">
      <h1>Login</h1>
      <div>
        {formState.isValid === false && <p className="error">{formState.invalidMessage}</p>}
      </div>
      <form onSubmit={handleSubmit}>
        <InputComponent 
          inputName="Name" 
          inputType="input"
          onInput={parseInput.bind(this, 'name')} //Binding the input name so I can reuse the parse input function.
        />
        <InputComponent 
          inputName="Password" 
          inputType="password" 
          onInput={parseInput.bind(this, 'password')} //Binding the input name so I can reuse the parse input function.
        />
        <input type="submit" value="Submit" />
      </form>
    </div>
  )
}
export default Login;
