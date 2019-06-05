import { useState } from 'react'
import { AUTH_TOKEN } from '../constants'
import { useMutation } from 'urql';
import gql from 'fraql';
import fnfy from 'fnfy';


const div = fnfy('div');
const input = fnfy('input');
const h4 = fnfy('h4');

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`


const Login = ({ history }) => {
  const [ login, setLogin ] = useState(true);// switch between Login and SignUp
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ name, setName ] = useState('');
  const [ res, executeMutation] = useMutation(login ? LOGIN_MUTATION : SIGNUP_MUTATION);


  const confirm = (data, login) => {
    console.log(`confirm: ${JSON.stringify(data)}`)
    const { token } = login ? data.login : data.signup
    localStorage.setItem(AUTH_TOKEN, token)
    history.push(`/`)
  }

  if (!res.fetching && res.data) {
    confirm(res.data, login);
  }

  return div({
    children:[
      h4({
        className: 'mv3',
        children: [(login ? 'Login' : 'Sign Up')]
      }),
      div({
        className: 'flex flex-column',
        children: [
          !login && ( input({
            value: name,
            onChange: (e) => setName(e.target.value),
            type: 'text',
            placeholder: 'Your name',
          })),
          input({
            value: email,
            onChange: (e) => setEmail(e.target.value),
            type: 'text',
            placeholder: 'Your email address',
          }),
          input({
            value: password,
            onChange: (e) => setPassword(e.target.value),
            type: 'password',
            placeholder: 'Choose a safe password',
          })
        ]
      }),
      div({
        className: 'flex mt3',
        chidren: [
          div({
            className: 'pointer mr2 button',
            onClick: () => executeMutation({ name, password, email }),
            children: [
              (login ? 'login' : 'create account')
            ]
          }),
          div({
            className: 'pointer button',
            onClick: () => setLogin(!login),
            children: [
              (login ? 'need to create an account?' : 'already have an account?')
            ]
          })
        ]
      })
    ]
  })
};

export default Login