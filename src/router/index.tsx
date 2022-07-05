import React from 'react';
import { Redirect, Route, Switch } from 'react-router';

import RouterSetup from './router-setup';

export interface IRoute {
  path: string;
  component: React.ComponentType;
  exact: boolean;
}

interface IProps {
  routes: IRoute[];
  route404: React.ComponentType;
  children?: React.ComponentType;
}

const RouterComponent = ({ routes, children, route404 }: IProps) => {
  return (
    <React.Fragment>
      <RouterSetup />
      {children}
      <Switch>
        {routes.map((route: IRoute) => {
          return <Route path={route.path} component={route.component} exact={route.exact} key={route.path} />;
        })}
        <Route path="/404" component={route404} />
        <Redirect to="/404" />
      </Switch>
    </React.Fragment>
  );
};

export default RouterComponent;
