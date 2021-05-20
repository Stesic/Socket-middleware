import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import Provider from "react-redux/es/components/Provider";

import store from "./store";
import { actions } from "./socket/store";

import Main from "./main/Main";

const testSocketApi =
  "wss://demo.websocket.me/v3/1?api_key=oCdCMcMPQpbvNjUIzqtvF1d2X2okWpDQj4AwARJuAgtjhzKxVEjQU6IdCjwm";

const WebSocketInit = ({ children }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.wsConnect(testSocketApi));
    return () => {
      dispatch(actions.wsDisconnect(testSocketApi));
    };
  }, []);

  return <>{children}</>;
};

const App = () => {
  return (
    <Provider store={store}>
      <WebSocketInit>
        <Main />
      </WebSocketInit>
    </Provider>
  );
};

export default App;
