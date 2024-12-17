import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { LocalStorageProvider } from "./storage/local-storage-provider";
import { useAllData, useMutateData } from "./storage/data-hooks";

function Content() {
  const data = useAllData<{ id?: string; name: string }>("test");
  const { remove } = useMutateData<{ id?: string; name: string }>("test");
  return (
    <ul>
      {data.map((item) => (
        <li key={item.id}>
          {item.id}
          {item.name}
          <button onClick={() => remove(item)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

function AddContentButton() {
  const { save } = useMutateData<{ id?: string; name: string }>("test");
  return (
    <button
      onClick={() => {
        save({ name: "New Item" });
      }}
    >
      Add
    </button>
  );
}

function App() {
  return (
    <LocalStorageProvider>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Content />
          <AddContentButton />
          <Content />
        </header>
      </div>
    </LocalStorageProvider>
  );
}

export default App;
