import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import {Repo} from "@automerge/automerge-repo";
import {MessageChannelNetworkAdapter} from "@automerge/automerge-repo-network-messagechannel";
import {IndexedDBStorageAdapter} from "@automerge/automerge-repo-storage-indexeddb";
import { RepoContext } from "@automerge/automerge-repo-react-hooks"

const sharedWorker = new SharedWorker(
    new URL("./shared-worker.js", import.meta.url),
    {
        type: "module",
        name: "automerge-repo-shared-worker",
    }
);

const repo = new Repo({
    network: [new MessageChannelNetworkAdapter(sharedWorker.port)],
    storage: new IndexedDBStorageAdapter("automerge-repo-message-board"),
    sharePolicy: async peerId => peerId.includes("shared-worker"),
})

const rootElement = document.getElementById("root");
ReactDOM.createRoot(rootElement).render(
    <RepoContext.Provider value={repo}>
      <StrictMode>
        <App />
      </StrictMode>
    </RepoContext.Provider>
);
