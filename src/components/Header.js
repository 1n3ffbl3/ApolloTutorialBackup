import { Link as _Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { AUTH_TOKEN } from '../constants';
import fnfy from 'fnfy';


const div = fnfy('div');
const Link = fnfy(_Link);


const Header = ({ history }) => {
  const authToken = localStorage.getItem(AUTH_TOKEN);

  return div({
    className: 'flex pa1 justify-between nowrap orange',
    children: [
      div({
        className: 'flex flex-fixed black',
        children: [
          Link({
            className: 'ml1 no-underline black',
            to: '/top',
            children: 'top',
          }),
          div({
            className: 'ml1',
            children: '|',
          }),
          div({
            className: 'fw7 mr1',
            children: 'Hacker News',
          }),
          Link({
            className: 'ml1 no-underline black',
            to: '/',
            children: 'new',
          }),
          div({
            className: 'ml1',
            children: '|',
          }),
          Link({
            className: 'ml1 no-underline black',
            to: '/search',
            children: 'search',
          }),
          authToken && 
          div({
            className: 'ml1',
            children: Link({
              className: 'ml1 no-underline black',
              to: '/create',
              children: ' | submit',
            }),
          }),
        ]
      }),
      div({
        className: 'flex flex-fixed',
        children: [
          authToken ? (
            div({
              className: 'ml1 pointer black',
              onClick: () => {
                localStorage.removeItem(AUTH_TOKEN)
                history.push(`/`)},
              children: 'logout',
            })
          ) : (
            Link({
              className: 'ml1 no-underline black',
              to: '/login',
              children: 'login',
            })
          )
        ]
      })
    ]
  })
};


export default fnfy(withRouter(Header));