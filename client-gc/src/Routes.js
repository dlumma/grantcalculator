import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from './containers/Home';
import Login from './containers/Login';
import NotFound from './containers/NotFound';
import Signup from './containers/Signup';
import NewGrant from './containers/NewGrant';
import Grants from './containers/Grants';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import UnauthenticatedRoute from './components/UnauthenticatedRoute';



export default ({ childProps }) => (
  <Switch>
    <AuthenticatedRoute path="/" exact component={Home} props={childProps} />
    <UnauthenticatedRoute path="/login" exact component={Login} props={childProps} />
    <UnauthenticatedRoute path="/signup" exact component={Signup} props={childProps} />
    <AuthenticatedRoute path="/grants/new" exact component={NewGrant} props={childProps} />
    <AuthenticatedRoute path="/grants/:id" exact component={Grants} props={childProps} />
    <Route component={NotFound} />
  </Switch>
);
