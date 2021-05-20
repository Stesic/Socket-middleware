export const actions = {
  wsConnect: (host) => ({ type: "WS_CONNECT", host }),
  wsConnecting: (host) => ({ type: "WS_CONNECTING", host }),
  wsConnected: (host) => ({ type: "WS_CONNECTED", host }),
  wsDisconnect: (host) => ({ type: "WS_DISCONNECT", host }),
  wsDisconnected: (host) => ({ type: "WS_DISCONNECTED", host }),
  wsReceived: (payload) => ({
    type: "WS_RECEIVED",
    payload,
  }),
  wsSend: (payload) => ({
    type: "WS_SEND",
    payload,
  }),
};

const socketMiddleware = () => {
  let socket = null;

  const onOpen = (store) => (event) => {
    console.log("websocket open", event.target.url);
    store.dispatch(actions.wsConnected(event.target.url));
  };

  const onClose = (store) => () => {
    store.dispatch(actions.wsDisconnected());
  };

  const onMessage = (store) => (event) => {
    const payload = JSON.parse(event.data);
    console.log("receiving server message");
    store.dispatch(actions.wsReceived(payload));
  };

  return (store) => (next) => (action) => {
    switch (action.type) {
      case "WS_CONNECT":
        if (socket !== null) {
          socket.close();
        }

        // connect to the remote host
        socket = new WebSocket(action.host);

        // websocket handlers
        socket.onmessage = onMessage(store);
        socket.onclose = onClose(store);
        socket.onopen = onOpen(store);

        break;
      case "WS_DISCONNECT":
        if (socket !== null) {
          socket.close();
        }
        socket = null;
        console.log("websocket closed");
        break;
      case "WS_SEND":
        console.log("sending a message", action.payload);
        socket.send(JSON.stringify(action.payload));
        break;
      default:
        return next(action);
    }
  };
};

const initState = { connected: false };

export const reducer = (state = initState, action) => {
  switch (action.type) {
    case "WS_CONNECTED":
      return { ...state, connected: true };

    case "WS_DISCONNECTED":
      return { ...initState, connected: false };
    case "WS_RECEIVED":
      const { event, payload } = action.payload;
      return {
        ...state,
        [event]: payload,
      };
    default:
      return state;
  }
};

export default socketMiddleware();
