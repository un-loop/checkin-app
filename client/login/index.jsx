import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Login from '../../components/apps/Login';
import {parse} from 'querystring';

const values = parse(window.location.search.substring(1));

ReactDOM.render(
    <Login redirect={values['redirect']}
      error={
          values['message'] ?
            {errorKey: Date.now(), message: values['message']}
          : null
      }/>,
    document.getElementById('login')
);
