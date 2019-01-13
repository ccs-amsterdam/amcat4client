import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


function Results(props) {

    if (!props.result) return <p>(no results)</p>
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
                    {props.result.map(row => {
                        return (
                            <TableRow key={row._id}>
                                <TableCell>{row.date}</TableCell>
                                <TableCell>{row.title}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </Paper>
    );
}

export default Results;
