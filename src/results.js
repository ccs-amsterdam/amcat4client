import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import TableSortLabel from '@material-ui/core/TableSortLabel';

function clean(value, type) {
    if (type === "text") {
        if (value.length > 50) {
            value = value.substr(0, 50) + "..."
        }
    }
    return value;
}

function Results(props) {
    if (!props.result) return <p>(no results)</p>
    if (!props.fields) return <p>(fetching field data...)</p>
    let result_fields = Object.keys(props.result.results[0])
    let fields = {...props.fields};
    Object.keys(fields).forEach((key) => result_fields.includes(key) || delete fields[key]);        

    let data = props.result.results;
    let meta = props.result.meta;
    let order = props.sortDesc ? "desc" : "asc";
    return (
        <Paper>
            <Table>
                <TableHead>
                    <TableRow>
                        {
                            Object.keys(fields).map((field) =>
                                <TableCell
                                    key={field}
                                    sortDirection={props.sortBy === field ? order : false}
                                >

                                    <TableSortLabel
                                        active={props.sortBy === field}
                                        direction={order}
                                        onClick={() => props.onSort(field)}
                                    >
                                        {field}
                                    </TableSortLabel>
                                </TableCell>
                            )
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map(row =>
                        <TableRow key={row._id}>
                            {Object.entries(fields).map(([field, type]) =>
                                <TableCell key={field}>{clean(row[field], type)}</TableCell>)}
                        </TableRow>)}

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
