import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { setHistory } from '../services/global';

const RouterSetup = () => {
  const history = useHistory();

  useEffect(() => {
    setHistory(history);
  }, []);

  return <React.Fragment />;
};

export default RouterSetup;
