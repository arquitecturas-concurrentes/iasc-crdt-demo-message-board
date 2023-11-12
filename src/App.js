import { useState } from "react";
import { nanoid } from "nanoid/non-secure";
import { useBootstrap, useDocument} from "@automerge/automerge-repo-react-hooks"
import "./styles.css";

const MyMessage = ({changeDoc}) => {
  const [message, setMessage] = useState("");
  const send = () => {
    if (message) {
      changeDoc(doc => doc.messages.push({ id: nanoid(), text: message, vote: 0 }));
      setMessage("");
    }
  };
  return (
    <div className="row">
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

const Message = ({ message, changeDoc }) => {
  const [pending, setPending] = useState(false);
  const voteUp = () => {
      changeDoc(doc => {
          const found = doc.messages.find((item) => item.id === message.id);
          ++found.vote;
      })
    setPending(true);
    setTimeout(() => {
      setPending(false);
    }, 1000);
  };
  return (
    <div className="container">
      <p className="row">
        <button disabled={pending} onClick={voteUp}>
          <span>▲ {message.vote}</span>
        </button>
        <span>{message.text}</span>
      </p>
    </div>
  );
};

const Messages = ({doc, changeDoc}) => {
  const sortedMessages = [...doc.messages].sort(
    (messageA, messageB) => messageB.vote - messageA.vote,
  );
  return (
    <div>
      {sortedMessages.map((message) => (
        <Message key={message.id} message={message} changeDoc={changeDoc} />
      ))}
    </div>
  );
};

const MessageBoard = () => {
    const { url } = useBootstrap({
        onNoDocument: repo => {
            const handle = repo.create()
            handle.change(doc => {
                doc.messages = []
            })
            return handle
        },
    })
    const [doc, changeDoc] = useDocument(url);

    if (!doc) {
        return null;
    }

    return <>
        <h3>Posteá un mensaje</h3>
        <MyMessage changeDoc={changeDoc}/>
        <h3>Mensajes</h3>
        <Messages doc={doc} changeDoc={changeDoc}/>
    </>;
}

const App = () => <MessageBoard/>;

export default App;
