import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            marginTop: theme.spacing(2),
            alignItems: "center",
            justifyContent: "center"
        },
    },
    ul: {
        justifyContent: "center"
    }
}));


export default function PaginationElem({ count, page, onChange }) {
  const classes = useStyles();
  return (
      <div className={classes.root}>
          <Pagination classes={classes} count={count} page={page} onChange={onChange} />
      </div>
  );
}