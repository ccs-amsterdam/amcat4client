import { useCallback } from "react";
import { Container, Icon, Pagination, Table } from "semantic-ui-react";
import { SemanticWIDTHS } from "semantic-ui-react/dist/commonjs/generic";
import {
  highlightElasticTags,
  removeElasticTags,
} from "./highlightElasticTags";
import { AmcatDocument, AmcatField, SortSpec } from "../../interfaces";

export interface PaginationTableColumn extends AmcatField {
  /** Set to true to hide this column */
  hide?: boolean;
  /** Optional transformation function to run over the *row*  */
  //f?: (row: TableRow) => TableRow;
  /** Optional 'width' to specify width in SemanticUIs 16 parts system. */
  width?: SemanticWIDTHS;
}

export interface PaginationFooterProps {
  /** the number of pages */
  pages: number;
  /** the function to perform on pagechange. Gets pageindex as an argument, and should update data */
  pageChange: (page: number) => void;
}

export interface PaginationProps extends PaginationFooterProps {
  /** an Array with data for a single page */
  data: AmcatDocument[];
  /** an Array with objects indicating which columns to show and how. */
  columns: PaginationTableColumn[];
  /** the number of pages */
  onClick: (value: any) => void;
  sort?: SortSpec;
  onSortChange?: (sort: SortSpec) => void;
}

export function PaginationFooter({ pages, pageChange }: PaginationFooterProps) {
  if (pages <= 1) return null;
  return (
    <Pagination
      fluid
      size="mini"
      boundaryRange={1}
      siblingRange={1}
      ellipsisItem={{
        content: <Icon name="ellipsis horizontal" />,
        icon: true,
      }}
      firstItem={{
        content: <Icon name="angle double left" />,
        icon: true,
      }}
      lastItem={{
        content: <Icon name="angle double right" />,
        icon: true,
      }}
      prevItem={{ content: <Icon name="angle left" />, icon: true }}
      nextItem={{
        content: <Icon name="angle right" />,
        icon: true,
      }}
      pointing
      secondary
      defaultActivePage={1}
      totalPages={pages}
      onPageChange={(e, d) => pageChange((d.activePage as number) - 1)}
    ></Pagination>
  );
}

function _sortdir(sort: SortSpec | undefined) {
  if (sort == null) return new Map();
  if (typeof sort === "string") return new Map([[sort, "asc"]]);
  return new Map(
    sort.map((val) => {
      if (typeof val === "string") return [val, "asc"];
      const field = Object.keys(val)[0];
      return [field, val[field].order];
    })
  );
}

/**
 * A nice table with pagination
 */
export default function PaginationTable({
  data,
  columns,
  pages,
  pageChange,
  onClick,
  sort,
  onSortChange,
}: PaginationProps) {
  const toggleSort = useCallback(
    (field: string, current_order: string) => {
      if (onSortChange == null) return;
      onSortChange([
        { [field]: { order: current_order === "asc" ? "desc" : "asc" } },
      ]);
    },
    [onSortChange]
  );
  const sortdir = _sortdir(sort);
  const createHeaderRow = (columns: PaginationTableColumn[]) => {
    return columns.map((col, i) => {
      if (col.hide) return null;
      const order = sortdir.get(col.name);
      const canSort = onSortChange != null && col.type !== "text";
      return (
        <Table.HeaderCell
          className={canSort ? "sortableHeader" : "header"}
          key={i}
          width={col.width || undefined}
          onClick={canSort ? () => toggleSort(col.name, order) : null}
        >
          <span title={col.name}>
            {col.name}
            {order == null ? null : (
              <Icon name={order === "asc" ? "sort up" : "sort down"} />
            )}
          </span>
        </Table.HeaderCell>
      );
    });
  };

  const createBodyRows = (
    data: AmcatDocument[],
    columns: PaginationTableColumn[]
  ) => {
    return data.map((rowObj, i) => {
      return (
        <Table.Row
          key={i}
          style={{ cursor: "pointer" }}
          onClick={() => onClick(rowObj)}
        >
          {createRowCells(rowObj, columns)}
        </Table.Row>
      );
    });
  };

  const createRowCells = (
    rowObj: AmcatDocument,
    columns: PaginationTableColumn[]
  ) => {
    return columns.map((column, i) => {
      if (column.hide) return null;
      const content = formatCell(rowObj, column);
      const title = removeElasticTags(content);
      const label = highlightElasticTags(content);
      return (
        <Table.Cell
          key={i}
          style={{
            minWidth: column.width || "50px",
            maxWidth: column.width || "200px",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <span title={title}>{label}</span>
        </Table.Cell>
      );
    });
  };

  if (data.length < 1) return null;
  const columnSelection = columns; // || Object.keys(data[0]).map((name) => ({ name, type: "text" }));

  return (
    <Container style={{ width: "100%", overflow: "auto" }}>
      <Table
        unstackable
        selectable
        compact
        singleLine
        size="small"
        style={{ fontSize: "10px" }}
      >
        <Table.Header>
          <Table.Row>{createHeaderRow(columnSelection)}</Table.Row>
        </Table.Header>
        <Table.Body>{createBodyRows(data, columnSelection)}</Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan={columnSelection.length}>
              <PaginationFooter pages={pages} pageChange={pageChange} />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </Container>
  );
}

function formatCell(row: AmcatDocument, column: PaginationTableColumn) {
  let val = row[column.name];
  if (val == null) return "";
  if (column.type === "id") return "🔗";
  if (column.type === "date") return val.replace("T", " ").substring(0, 19);
  return val;
}
