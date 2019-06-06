import React from 'react';
import Header from './Header';
import { Switch, Route } from 'react-router-dom';
import LinkList from './LinkList';
import CreateLink from './CreateLink';
import Login from './Login';
import Search from './Search';
import { Provider, createClient } from 'urql';
import { AUTH_TOKEN } from '../constants'


const client = createClient({
  url: 'http://localhost:4000',
  fetchOptions: () => {
    const token = localStorage.getItem(AUTH_TOKEN);
    return {
      headers: {
        authorization: token ? `Bearer ${token}` : '' ,
      },
    };
  },
});


const App = () => {
  return (
    <Provider value={client}>
      <div className='center w85'>
        <Header />
        <div className='ph3 pv1 background-gray'>
          <Switch>
            <Route exact path='/' component={LinkList} />
            <Route exact path='/create' component={CreateLink} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/search' component={Search} />
            <Route exact path='/top' component={LinkList} />
            <Route exact path='/new/:page' component={LinkList} />
          </Switch>
        </div>
      </div>
    </Provider>
  )
};


export default App;