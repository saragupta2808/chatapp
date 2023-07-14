
import "./App.css";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";

import { Route } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Route path="/" component={HomePage} exact />

      <Route path="/chats" component={ChatPage} />
    </div>
  );
}

export default App;
