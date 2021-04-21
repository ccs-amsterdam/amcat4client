import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Container, Dropdown } from "semantic-ui-react";
import { selectAmcatIndex, setAmcatIndices } from "../actions";

import SelectionTable from "./SelectionTable";
import CreateAmcatIndex from "./CreateAmcatIndex";

const AmcatIndexSelector = ({ type = "table" }) => {
  const amcat = useSelector((state) => state.amcat);
  const amcatIndices = useSelector((state) => state.amcatIndices);
  const amcatIndex = useSelector((state) => state.amcatIndex);
  const dispatch = useDispatch();

  const [selectedAmcatIndex, setSelectedAmcatIndex] = useState(amcatIndex);

  useEffect(() => {
    dispatch(selectAmcatIndex(selectedAmcatIndex));
  }, [selectedAmcatIndex, dispatch]);

  useEffect(() => {
    if (amcat && amcatIndices === null) {
      amcat.getIndices().then((res) => {
        dispatch(setAmcatIndices(res.data));
      });
    }
  }, [amcat, amcatIndices, dispatch]);

  if (type === "table") {
    const tableColumns = [
      {
        Header: "Index",
        accessor: "name",
        headerClass: "thirteen wide",
      },
      {
        Header: "Role",
        accessor: "role",
        headerClass: "five wide",
      },
    ];

    return (
      <Container>
        <Button.Group widths="2">
          <CreateAmcatIndex />
        </Button.Group>
        <SelectionTable
          columns={tableColumns}
          data={amcatIndices ? amcatIndices : []}
          selectedRow={selectedAmcatIndex}
          setSelectedRow={setSelectedAmcatIndex}
          defaultSize={10}
        />
      </Container>
    );
  }

  if (type === "dropdown") {
    const asDropdownItems = (indices) => {
      return indices.map((index) => {
        return { key: index.name, text: index.name, value: index.name };
      });
    };

    const onDropdownSelect = (value) => {
      if (value && amcatIndices !== null) {
        const i = amcatIndices.findIndex((row) => row.name === value);
        setSelectedAmcatIndex({ ...amcatIndices[i], ROW_ID: i.toString() });
      } else {
        setSelectedAmcatIndex(null);
      }
    };

    return (
      <Dropdown
        search
        text={amcatIndex ? "Index: " + amcatIndex.name : "Select index"}
        fluid
        button
        floating
        options={asDropdownItems(amcatIndices)}
        value={amcatIndex ? amcatIndex.name : null}
        onChange={(e, d) => onDropdownSelect(d.value)}
      />
    );
  }

  return null;
};

export default AmcatIndexSelector;
