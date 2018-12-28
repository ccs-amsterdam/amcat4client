import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


function createData(id, date, title, url) {
    return { id, date, title, url };
}

const rows = [
    createData(123, '2018-01-01', 'This is news?', 'http://nuniet.nl'),
    createData(123, '2018-01-01', 'This is news?', 'http://nuniet.nl'),
    createData(123, '2018-01-01', 'This is news?', 'http://nuniet.nl'),
    createData(123, '2018-01-01', 'This is news?', 'http://nuniet.nl'),
    createData(123, '2018-01-01', 'This is news?', 'http://nuniet.nl'),
    createData(123, '2018-01-01', 'This is news?', 'http://nuniet.nl'),
    createData(123, '2018-01-01', 'This is news?', 'http://nuniet.nl'),
];

function Results() {

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
                        <TableCell>id</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Url</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map(row => {
                        return (
                            <TableRow key={row.id}>
                                <TableCell component="th" scope="row">
                                    {row.id}
                                </TableCell>
                                <TableCell>{row.date}</TableCell>
                                <TableCell>{row.title}</TableCell>
                                <TableCell>{row.url}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </Paper>
    );
}

export default Results;
