import React from "react";
import { usePromiseTracker } from "react-promise-tracker";

export const LoadingIndicator = props => {
  const { promiseInProgress } = usePromiseTracker();

  return promiseInProgress && <h1>Hey some async call in progress ! </h1>;
};
