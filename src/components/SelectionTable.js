import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CSVDownload } from 'react-csv';
import { selectDocument } from '../actions';

import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from 'react-table';
import history from '../history';

import {
  Segment,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
  Pagination,
  Dropdown,
  Icon,
  Button,
} from 'semantic-ui-react';

// Uses react-table with semantic ui. The columns and data arguments are lists of objects
// The 'columns' argument specifies column names (Header) and the names of the keys to get from data.
//
// const columns = [
//   { Header: "ID", accessor: "id", headerClass: "one wide" },
//   { Header: "Name", accessor: "text", headerClass: "one wide" },
// ]
//
// Note that headerClass is custom, and enables setting the header cell class,
// which is used in semantic ui to specify the width (one wide, ten wide, etc).

const SelectionTable = ({
  columns,
  data,
  selectedRow,
  setSelectedRow,
  defaultSize = 20,
  sizeSelector = false,
  downloadArticleSet = true,
}) => {
  const [activeRow, setActiveRow] = useState(
    selectedRow ? selectedRow.ROW_ID : null
  );

  const dispatch = useDispatch();
  const amcat = useSelector((state) => state.amcat);
  const amcatIndex = useSelector((state) => state.amcatIndex);
  const document = useSelector((state) => state.document);
  const [csvDoc, setcsvDoc] = useState(null);
  const documents = useSelector((state) => state.documents);
  const [csvDocs, setcsvDocs] = useState(null);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    pageCount,
    gotoPage,
    setPageSize,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, globalFilter },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: defaultSize, globalFilter: '' },
    },

    useGlobalFilter,
    useSortBy,
    usePagination
  );

  useEffect(() => {
    if (selectedRow) {
      setActiveRow(selectedRow.ROW_ID);
    } else {
      setActiveRow(null);
    }
  }, [selectedRow, dispatch]);

  useEffect(() => {
    if (amcat && amcatIndex && document.ORG_ID) {
      amcat.getDocument(amcatIndex.name, document.ORG_ID).then((res) => {
        dispatch(selectDocument(res.data));
      });
    }
  }, [amcat, amcatIndex, dispatch, document.ORG_ID]);

  const onRowSelect = (row) => {
    if (activeRow && activeRow === row.id) {
      setSelectedRow(null);
      setActiveRow(null);
    } else {
      setSelectedRow({
        ...row.values,
        ROW_ID: row.id,
        ORG_ID: row.original._id,
      });
      setActiveRow(row.id);
    }
  };

  const convertToCSV = (arr, multiple = false) => {
    let array = [];
    if (multiple) {
      array = [arr];
    } else array = [Object.keys(arr)].concat(arr);

    return array
      .map((it, idx) => {
        if (idx === 3) {
          return Object.values(it).toString();
        } else
          return Object.entries(it).map((item) => {
            if (multiple)
              return ('"' + item[1].replace(/"/g, "'") + '"').replace(
                /\n/g,
                ''
              );
            else return ('"' + item[1] + '"').replace(/\n/g, '');
          });
      })
      .join('\n');
  };

  const prepareDocumentCVS = (document) => {
    setcsvDoc(convertToCSV(document));
    setTimeout(() => {
      setcsvDoc(null);
    }, 100);
  };

  const prepareDocumentsCVS = (documents) => {
    const res = [];
    res.push(Object.values(Object.keys(documents[0])).toString());
    documents.forEach((doc) => {
      res.push([convertToCSV(doc, true)]);
    });
    setcsvDocs(res.join('\n'));
    setTimeout(() => {
      setcsvDocs(null);
    }, 100);
  };

  const createHeader = (headerGroup) => {
    return headerGroup.headers.map((column) => {
      return (
        <TableHeaderCell
          className={column.headerClass}
          {...column.getHeaderProps(column.getSortByToggleProps())}
        >
          {column.render('Header')}
          <span>
            {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
          </span>
        </TableHeaderCell>
      );
    });
  };

  const createBody = (page) => {
    return page.map((row, i) => {
      prepareRow(row);

      return (
        <TableRow
          active={row.id === activeRow}
          onClick={() => onRowSelect(row)}
          {...row.getRowProps()}
        >
          {row.cells.map((cell) => {
            return (
              <TableCell
                {...cell.getCellProps()}
                style={{
                  color: `${row.id === activeRow ? '#0E6EB8' : ''}`,
                }}
              >
                {cell.render('Cell')}
                {row.id === activeRow && cell.column.Header === 'Title' ? (
                  <Button.Group floated="right" style={{ marginRight: '20px' }}>
                    <button
                      className="ui primary button float left"
                      onClick={(e) => {
                        history.push('/browseDocument');
                        e.stopPropagation();
                      }}
                    >
                      Browse!
                    </button>
                    <Button
                      className="ui primary button float left"
                      onClick={(e) => {
                        prepareDocumentCVS(document);
                        e.stopPropagation();
                      }}
                    >
                      Download
                    </Button>
                    {csvDoc != null ? (
                      <CSVDownload
                        data={csvDoc}
                        target="_blank"
                        filename={'articleSet.csv'}
                      />
                    ) : null}
                  </Button.Group>
                ) : (
                  ''
                )}
              </TableCell>
            );
          })}
        </TableRow>
      );
    });
  };

  if (data.length === 0) return <Segment>No Documents Found</Segment>;
  return (
    <Segment style={{ border: '0' }}>
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        numDocs={data.length}
      />

      <Table
        unstackable
        striped
        fixed
        singleLine
        selectable
        compact
        {...getTableProps()}
      >
        <TableHeader>
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {createHeader(headerGroup)}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody {...getTableBodyProps()}>{createBody(page)}</TableBody>
      </Table>

      {sizeSelector ? (
        <Dropdown
          text="show per page"
          options={[10, 25, 50, 100, 500].map((n) => ({ value: n, text: n }))}
          onChange={(e, d) => {
            setPageSize(d.value);
          }}
        />
      ) : null}

      <div
        style={{
          marginTop: '1em',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        {downloadArticleSet === true ? (
          <Button
            className="ui primary button float left fluid"
            style={{ marginRight: '30px' }}
            onClick={(e) => {
              prepareDocumentsCVS(documents);
              e.stopPropagation();
            }}
          >
            Download Article Set
          </Button>
        ) : null}

        {csvDocs != null ? (
          <CSVDownload
            data={csvDocs}
            target="_blank"
            filename={'articleSet.csv'}
          />
        ) : null}
        {data.length > defaultSize ? (
          <Pagination
            style={{ border: '0' }}
            size="mini"
            firstItem={false}
            lastItem={false}
            nextItem={false}
            prevItem={false}
            boundaryRange={1}
            ellipsisItem={{
              content: <Icon name="ellipsis horizontal" />,
              icon: true,
            }}
            activePage={pageIndex + 1}
            totalPages={pageCount}
            onPageChange={(event, data) => {
              gotoPage(data.activePage - 1);
            }}
          />
        ) : null}
      </div>
    </Segment>
  );
};

const GlobalFilter = ({ globalFilter, setGlobalFilter, numDocs }) => {
  return (
    <div>
      <div style={{ width: '95%' }}>
        <span style={{ float: 'left' }}>
          <input
            value={globalFilter || ''}
            onChange={(e) => {
              setGlobalFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
            }}
            placeholder={`Click to search results!`}
            style={{
              width: '100%',
              border: '0',
              height: '21px',
            }}
          />
        </span>
        <span
          style={{ float: 'right', height: '30px' }}
        >{`${numDocs} item(s) found`}</span>
      </div>
    </div>
  );
};

export default SelectionTable;
