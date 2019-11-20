import React, {useState} from 'react';
import InputComponent from './InputComponent';

const SignUp = () => {
  let usernameIsValid, passwordIsValid
  const [userDetails, setUserDetails] = useState({name: null, password: null, confirmPassword: null})
  const [formState, setFormValidState] = useState({isValid: true, invalidMessage: ""})
  const [formSuccess, setFormSuccess] = useState()

  const handleSubmit = (event) => {
      event.preventDefault();

      //Just some very basic front end validation, this can be omitted as validation will also be done back end also.
      //I could have also added html validation, such as regex, min length etc. but due to time constraints this has not been done.
      validateInput(userDetails);

      if(usernameIsValid && passwordIsValid) {
        setFormValidState({isValid: true});
      } else {
        setFormValidState({isValid: false, invalidMessage: 'Whoops, something went wrong, please ensure passwords have min 6 characters'});
      }
      if(usernameIsValid && passwordIsValid) { authenticateUser(userDetails); }
  }

  //If I had time i'd refactor this to it's own service function in a different file.

  var query = `query CreateUser($name: String!, $password: String!, $confirmPassword: String!) {
    createUser(userName: $name, password: $password, confirmPassword: $confirmPassword)
  }`;
  
  const authenticateUser = (userDetails) => {
    fetch('http://localhost:4000/signup', {
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
      setFormSuccess(false);
    } else {
      setFormSuccess(true);
    }
  }
  
  const parseInput = (inputName, event) => setUserDetails({ ...userDetails, [inputName]: event.target.value });

  const validateInput = (userDetails) => {
    usernameIsValid = userDetails.name && userDetails.name.length > 0;
    passwordIsValid = userDetails.password && userDetails.confirmPassword && userDetails.password.length >= 6 && userDetails.password === userDetails.confirmPassword
  }
  
  return(
    <div className="container">
      <h1>Sign Up</h1>
      <div>
        {formState.isValid === false && <p className="error">{formState.invalidMessage}</p>}
        {formSuccess && <p className="success">Fantastic! Your account has been created, please log in</p>}
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
        <InputComponent 
          inputName="ConfirmPassword" 
          inputType="password"
          onInput={parseInput.bind(this, 'confirmPassword')} //Binding the input name so I can reuse the parse input function.
        />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}
export default SignUp;
