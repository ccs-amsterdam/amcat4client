import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import AmcatClient from "./components/AmcatClient";
import AmcatPage from "./components/Login/AmcatPage";
import AmcatPageFixedHost from "./components/Login/AmcatPageFixedHost";
import IndexChoice from "./components/Login/IndexChoice";
import Fields from "./components/Pages/Fields";
import ArticlePage from "./components/Query/ArticlePage";

function App() {
  const fixed_host = process.env.REACT_APP_FIXED_HOST;
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="i" element={<AmcatPageFixedHost />}>
            <Route path=":index" element={<AmcatClient />} />
            <Route path=":index/doc/:docid" element={<ArticlePage />} />
            <Route path=":index/fields" element={<Fields />} />
          </Route>

          <Route path="h" element={<AmcatPage />}>
            <Route path=":host" element={<IndexChoice />} />
            <Route path=":host/i/:index" element={<AmcatClient />} />
            <Route path=":host/i/:index/doc/:docid" element={<ArticlePage />} />
            <Route path=":host/i/:index/fields" element={<Fields />} />
          </Route>
          <Route
            path="/"
            element={<Navigate to={fixed_host ? "/i" : "/h"} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
