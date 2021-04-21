import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import SelectionTable from "./SelectionTable";
import { selectDocument } from "../actions";

const documentTableColumns = [
  { Header: "ID", accessor: "id", headerClass: "two wide" },
  { Header: "Date", accessor: "date", headerClass: "six wide" },
  { Header: "Title", accessor: "title", headerClass: "eight wide" },
];

const DocumentTable = () => {
  const amcatIndex = useSelector((state) => state.amcatIndex);
  const documenmt = useSelector((state) => state.document);
  const documents = useSelector((state) => state.documents);
  const dispatch = useDispatch();

  const [selectedRow, setSelectedRow] = useState(document);

  useEffect(() => {
    dispatch(selectDocument(selectedRow));
  }, [selectedRow, dispatch]);

  if (!amcatIndex) return null;

  return (
    <SelectionTable
      columns={documentTableColumns}
      data={documents}
      selectedRow={selectedRow}
      setSelectedRow={setSelectedRow}
      defaultSize={15}
    />
  );
};

export default DocumentTable;
