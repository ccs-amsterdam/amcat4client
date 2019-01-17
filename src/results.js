import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';

function Results(props) {
    console.log(props.result)
    if (!props.result) return <p>(no results)</p>
    let data = props.result.results;
    let meta = props.result.meta;
    return (
        <Paper>
            <Table>
                <colgroup>
                    <col width="10%" />
                    <col width="20%" />
                    <col width="50%" />
                    <col width="20%" />
                </colgroup>
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Url</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map(row => {
                        return (
                            <TableRow key={row._id}>
                                <TableCell>{row.date}</TableCell>
                                <TableCell>{row.title}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={meta.total_count}
          rowsPerPage={meta.per_page}
          page={meta.page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={props.onChangePage}
          onChangeRowsPerPage={props.onChangeRowsPerPage}
        />
        </Paper>
    );
}

export default Results;
