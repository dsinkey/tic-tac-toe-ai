import React from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  square: {
    flex: 33,
    height: '100%',
    border: '1px solid black',
    cursor: 'pointer',
    display: 'grid',
    placeItems: 'center',
    fontSize: 40,
    color: 'black',
  },
});

const Square = ({ value, onClick }) => {
  const classes = useStyles();

  return (
    <div className={classes.square} onClick={onClick}>
      {value}
    </div>
  );
};

export default Square;
