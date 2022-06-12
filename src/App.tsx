import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import AmcatClient from "./components/AmcatClient";
import AmcatPage from "./components/Login/AmcatPage";
import IndexChoice from "./components/Login/IndexChoice";
import Fields from "./components/Pages/Fields";
import ArticlePage from "./components/Query/ArticlePage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="x" element={<AmcatPage />}>
            <Route path=":host/:index" element={<AmcatClient />} />
            <Route path=":host" element={<IndexChoice />} />
            <Route path=":host/:index/doc/:docid" element={<ArticlePage />} />
            <Route path=":host/:index/fields" element={<Fields />} />
          </Route>
          <Route path="/" element={<AmcatPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
