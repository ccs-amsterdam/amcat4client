import { Table } from "semantic-ui-react";
import { AggregateDataPoint, AggregateVisualizerProps } from "../../interfaces";
import { axis_label, can_transform, transform_dateparts } from "./lib";

export default function AggregateList({
  data,
  onClick,
  limit,
}: AggregateVisualizerProps) {
  const handleClick = (row: AggregateDataPoint) => {
    const values = data.meta.axes.map((axis) => row[axis.field]);
    onClick(values);
  };
  let d = data.data;
  if (can_transform(data.meta.axes[0].interval)) {
    d = d
      .map((x) => transform_dateparts(x, data.meta.axes[0]))
      .sort((e1, e2) => e1._sort - e2._sort);
  }

  if (limit && d.length > limit) d = d.slice(0, limit);
  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          {data.meta.axes.map((axis, i) => (
            <Table.HeaderCell key={i}>{axis_label(axis)}</Table.HeaderCell>
          ))}
          <Table.HeaderCell>N</Table.HeaderCell>
          {data.meta.aggregations?.map((metric, i) => (
            <Table.HeaderCell key={-i}>{metric.name}</Table.HeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {d.map((row, i) => {
          return (
            <Table.Row key={i}>
              {data.meta.axes.map((axis, j) => {
                if (!axis.name) return null;
                return (
                  <Table.Cell key={j} onClick={() => handleClick(row)}>
                    {row[axis.name]}
                  </Table.Cell>
                );
              })}
              <Table.Cell>{row.n}</Table.Cell>

              {data.meta.aggregations?.map((metric, i) => {
                if (!metric.name) return null;
                return <Table.Cell key={-i}>{row[metric.name]}</Table.Cell>;
              })}
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
}
