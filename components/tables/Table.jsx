import * as React from "react";
import { Table, TableBody, TableRow, TableCell, Typography, TableHead, TablePagination } from "@material-ui/core";
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

    class DecoratedTable extends React.Component {
        constructor(props) {
            super(props)
            let page = this.props.page ? this.props.page : 0;
            let rowsPerPage = this.props.rowsPerPage ? this.props.rowsPerPage : 5;

            this.state = { page: page, rowsPerPage: rowsPerPage, sortField: this.props.sortField, sortAscending: this.props.sortAscending && true };

            this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
            this.handleChangePage = this.handleChangePage.bind(this);
            this.dataCompare = this.dataCompare.bind(this);
            this.getDataSlice = this.getDataSlice.bind(this);

        }

        handleChangeRowsPerPage(e) {
            this.setState( { rowsPerPage: e.target.value });
            this.props.onDataChange && this.props.onDataChange(this.state.page, e.target.value, this.state.sortField, this.state.sortAscending);
        }

        handleChangePage(e) {
            this.setState( { page: e.target.value });
            this.props.onDataChange && this.props.onDataChange(e.target.value, this.state.rowsPerPage, this.state.sortField, this.state.sortDir);
        }

        stableSort(array, cmp) {
            const stabilizedThis = array.map((el, index) => [el, index]);
            stabilizedThis.sort((a, b) => {
              const order = cmp(a[0], b[0]);
              if (order !== 0) return order;
              return a[1] - b[1];
            });
            return stabilizedThis.map(el => el[0]);
        }

        dataCompare(first, second) {
            if (first === second) return 0;

            let cmp = 1;
            if (first < second) cmp = -1;
            if (!this.state.sortAscending) cmp *= -1;
            return cmp;
        }

        getDataSlice() {
            if (this.props.onDataChange || !this.props.data) return this.props.data;

            let data = this.props.data;

            if (this.state.sortField) {
                data = stableSort(data, dataCompare);
            } else if (!this.state.sortAscending) {
                data = data.map(i => i).reverse();
            }

            return data.slice((this.state.page) * this.state.rowsPerPage, (this.state.page + 1) * this.state.rowsPerPage);
        }

        render() {
            const {classes} = this.props;
            const data = this.getDataSlice();

            return (
                <div className={classes.layout}>
                    {this.props.title &&
                        <Typography className={classes.title} variant="h6" color="inherit" noWrap>{this.props.title}</Typography>
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
                            {!this.props.loading && data && data.map(renderRow(row))}
                        </TableBody>
                    </Table>
                    {!this.props.loading && (!data || !data.length) && noData(classes.noData)}
                    {this.props.loading && <Progress color="secondary"><Typography>loading...</Typography></Progress>}
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={data ? data.length : 0}
                        rowsPerPage={this.state.rowsPerPage}
                        page={this.state.page}
                        backIconButtonProps={{
                            'aria-label': 'Previous Page',
                        }}
                        nextIconButtonProps={{
                            'aria-label': 'Next Page',
                        }}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        />
                </div>
            );
        }
    }

    return withStyles(styles)(DecoratedTable);
}
