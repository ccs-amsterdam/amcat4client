// here import and export all components for the npm module
import AggregateResult from "./components/Aggregate/AggregateResult";
import Articles from "./components/Articles/Articles";
import Article from "./components/Article/Article";
import ArticleModal from "./components/Article/ArticleModal";
import Indices from "./components/Indices/Indices";
import IndexPicker from "./components/Index/IndexPicker";
import Upload from "./components/Upload/Upload";
import QueryForm from "./components/Query/QueryForm";
import SimpleQueryForm from "./components/Query/SimpleQueryForm";
import MultilineQueryForm from "./components/Query/MultilineQueryForm";

import { MiddlecatWrapper, useMiddlecatContext } from "./context/middlecat";

import useAmcatIndices from "./hooks/useAmcatIndices";

import * as Amcat from "./Amcat";

// We'll slowly move more styling over to separate styled
// components, to phase out semantic ui
import * as Response from "./styled/Response";

// export all interfaces
export * from "./interfaces";

export {
  AggregateResult,
  Article,
  ArticleModal,
  Articles,
  Indices,
  IndexPicker,
  Upload,
  QueryForm,
  SimpleQueryForm,
  MultilineQueryForm,
  useAmcatIndices,
  MiddlecatWrapper,
  useMiddlecatContext,
  Amcat,
  Response,
};
