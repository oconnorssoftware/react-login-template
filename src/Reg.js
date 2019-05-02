import React from 'react'
import axios from 'axios';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import CssBaseline from '@material-ui/core/CssBaseline';
axios.defaults.baseURL = "http://127.0.0.1:8000/";//URL to django back end


function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

class Reg extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      username:"",
      email:"",
      password1:"",
      password2:""
    }
    this.handleChange = this.handleChange.bind(this);
    this.registerUser = this.registerUser.bind(this);
  };

  handleChange (evt) {
    this.setState({ [evt.target.name]: evt.target.value});
  }
  registerUser () {
    //http://127.0.0.1:8000/coreback/rest-auth/registration/
    axios.post('coreback/rest-auth/registration/',{ //TODO:add CORS headers
      username:this.state.username,
      email:this.state.email,
      password1:this.state.password1,
      password2:this.state.password2
    }).then((response) => {
      if("key" in response.data){
        axios.defaults.headers.common['Authorization'] = response.data.key;
        setCookie("Auth", response.data.key, 3);
        this.setState(() => ({
          isAuthenticated: true
        }))
        this.props.onLogin(true);
      }
    }).catch((error) => {
      console.log(error);
      if(error.response.status === 400){
        alert("An error occured in registration");
      }
    });
  }
  render() {
    return (
      <div>
        <CssBaseline />

        <Paper alignItems="center">
          <h1>YOU WANNA MAKE AN ACCOUNT MAN?</h1><br/>
          username:<Input type="text" name="username" onChange={this.handleChange} /><br/>
          email:<Input type="text" name="email" onChange={this.handleChange} /><br/>
          password<Input type="password" name="password1" onChange={this.handleChange} /><br/>
          confirm password<Input type="password" name="password2" onChange={this.handleChange} /><br/>
          <Button onClick={this.registerUser}>Register</Button>
        </Paper>
      </div>
      )
  }

}

export default Reg;