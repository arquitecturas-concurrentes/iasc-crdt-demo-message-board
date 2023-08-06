import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { bindProxyAndYArray } from "valtio-yjs";
import { proxy, useSnapshot } from "valtio";
import { useState } from "react";
import { nanoid } from "nanoid/non-secure";
import "./styles.css";

const ydoc = new Y.Doc();

const websocketProvider = new WebsocketProvider(
  "wss://demos.yjs.dev",
  "valtio-yjs-demo",
  ydoc,
);

const yarray = ydoc.getArray("messages.v2");
const messages = proxy([]);
bindProxyAndYArray(messages, yarray);

const MyMessage = () => {
  const [message, setMessage] = useState("");
  const send = () => {
    if (message) {
      messages.unshift({ id: nanoid(), text: message, vote: 1 });
      setMessage("");
    }
  };
  return (
    <div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />{" "}
      <button disabled={!message} onClick={send}>
        Send
      </button>
    </div>
  );
};

const Message = ({ message }) => {
  const [pending, setPending] = useState(false);
  const voteUp = () => {
    const found = messages.find((item) => item.id === message.id);
    ++found.vote;
    setPending(true);
    setTimeout(() => {
      setPending(false);
    }, 1000);
  };
  return (
    <div className="container">
      <p>
        [{message.vote}]
        <button disabled={pending} onClick={voteUp}>
          +1
        </button>
        : {message.text}
      </p>
    </div>
  );
};

const Messages = () => {
  const snap = useSnapshot(messages);
  return (
    <div>
      {snap.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
};

const App = () => (
  <div>
    <h4>Posteá un mensaje</h4>
    <MyMessage />
    <h3>Mensajes</h3>
    <Messages />
  </div>
);

export default App;
