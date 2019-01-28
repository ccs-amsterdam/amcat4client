import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


function ResultsTable(props) {
    if (!props.result) return <p>(no results)</p>
    if (!props.fields) return <p>(fetching field data...)</p>
    let data = props.result;
    console.log(data);
    let row = props.options.row;
    let column = props.options.column;
    console.log(props)
    console.log( {row, column});
    if (column && column.field) { 
        let t = new Map(), rows = new Set(), cols = new Set();
        for (let x of data) {
            let r = x[row.field], c = x[column.field];
            rows.add(r)
            cols.add(c)
            // arrays don't work as keys since [1,2] !== [1,2], so use nested map
            if (!t.has(r)) t.set(r, new Map());
            t.get(r).set(c, x.n);
        }
        let sorted = set => Array.from(set).sort();
        rows = sorted(rows);
        cols = sorted(cols);
        console.log({rows, cols, t})
        return <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{row.field}</TableCell>
              {cols.map(c => <TableCell key={c}>{c}</TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(r => (
              <TableRow key={r}>
                <TableCell component="th" scope="row">{r}</TableCell>
                {cols.map(c => <TableCell key={c}>{(t.has(r) && t.get(r).get(c)) || ""}</TableCell>)}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>;
    } else {
       data.sort()
       return <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{row.field}</TableCell>
              <TableCell align="right"># Articles</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(x => (
              <TableRow key={x[row.field]}>
                <TableCell component="th" scope="row">{x[row.field]}</TableCell>
                <TableCell align="right">{x.n}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    }
}

export default ResultsTable;
