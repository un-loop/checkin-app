import * as React from "react";
import { Table, TableBody, TableRow, TableCell, Typography, TableHead } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Progress from "../widgets/Progress";

const styles = (theme) =>({
    layout: {
        [theme.breakpoints.down("sm")]: {
            margin: 0,
            borderRadius: 0,
            padding: theme.spacing.unit / 2
        },
        [theme.breakpoints.up("sm")]: {
            margin: theme.spacing.unit,
            padding: theme.spacing.unit
        },
        [theme.breakpoints.up("lg")]: {
            margin: theme.spacing.unit * 3,
            padding: theme.spacing.unit
        },
    },
    noData: {
        [theme.breakpoints.down("sm")]: {
            padding: theme.spacing.unit / 2
        },
        [theme.breakpoints.up("sm")]: {
            padding: theme.spacing.unit
        },
        [theme.breakpoints.up("lg")]: {
            padding: theme.spacing.unit
        },
        backgroundColor: theme.palette.background.default,
        color: theme.palette.common.black
    },
    header: {
        [theme.breakpoints.down("sm")]: {
            height: theme.spacing.unit * 2
        },
        [theme.breakpoints.up("sm")]: {
            height: theme.spacing.unit * 4
        }
    },
    title: {
        [theme.breakpoints.down("sm")]: {
            marginBottom: theme.spacing.unit / 4
        },
        [theme.breakpoints.up("sm")]: {
            marginBottom: theme.spacing.unit
        }
    }
});

const renderCell = (cell, cellIndex) => (
    <TableCell key={cellIndex}>
        { typeof cell == "function" ? cell.apply(this, cellIndex) : cell }
    </TableCell>
);

const renderRow = (row) => (rowData, rowIndex) => (
    <TableRow key={rowIndex}>
        {row(rowData, rowIndex).map(renderCell)}
    </TableRow>
);

const defaultNoData = (className) =>
    <div className={className}>
        <strong>No Data</strong>
    </div>

export default (row, header, noData) => {
    if (!noData) noData = defaultNoData;

    const table = (props) => {
        const {classes} = props;

        return (
            <div className={classes.layout}>
                {props.title &&
                    <Typography className={classes.title} variant="h6" color="inherit" noWrap>{props.title}</Typography>
                }
                <Table>
                    {header &&
                        <TableHead>
                            <TableRow className={classes.header}>
                                {header().map(renderCell)}
                            </TableRow>
                        </TableHead>
                    }
                    <TableBody>
                        {!props.loading && props.data && props.data.map(renderRow(row))}
                    </TableBody>
                </Table>
                {!props.loading && (!props.data || !props.data.length) && noData(classes.noData)}
                {props.loading && <Progress color="secondary" />}
            </div>
        );
    }

    return withStyles(styles)(table);
}
