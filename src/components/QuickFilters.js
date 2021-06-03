import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';

import { setFieldValues } from '../actions';

import { Button, Dropdown } from 'semantic-ui-react';
import SemanticDatepicker from 'react-semantic-ui-datepickers';

const dateOptions = {
  gte: 'Start Date',
  lte: 'End Date',
};

const QuickFilters = ({ runQuery }) => {
  const documents = useSelector((state) => state.documents);
  const fieldValues = useSelector((state) => state.fieldValues);

  const dispatch = useDispatch();

  const onSubmit = (key, value) => {
    let newFieldValues = { ...fieldValues };
    newFieldValues[key] = value;
    if (value === '') {
      newFieldValues = _.omit(newFieldValues, key);
    }
    dispatch(setFieldValues(newFieldValues));
  };

  const dateFilter = (key, value) => {
    let newFieldValues = { ...fieldValues };

    // this is for the POST method
    if (!newFieldValues.date) {
      newFieldValues['date'] = {};
      newFieldValues.date[key] = extractDateFormat(value);
    } else if (value === null) {
      newFieldValues.date = _.omit(newFieldValues.date, key);
      if (_.isEmpty(newFieldValues.date)) {
        newFieldValues = _.omit(newFieldValues, 'date');
      }
    } else {
      newFieldValues.date[key] = extractDateFormat(value);
    }
    dispatch(setFieldValues(newFieldValues));

    // this is for using GET while setting date filters (not advised)
    // const dateKey = 'date__' + key;
    // if (value === null) {
    //   newFieldValues = _.omit(newFieldValues, dateKey);
    // } else newFieldValues[dateKey] = extractDateFormat(value);
    // dispatch(setFieldValues(newFieldValues));
  };

  const renderDatePicker = (option) => {
    return (
      <Dropdown.Menu>
        <SemanticDatepicker
          type="basic"
          locale={navigator.locale}
          format="YYYY-MM-DD"
          onClick={(e) => {
            e.stopPropagation();
          }}
          onChange={(e, d) => {
            dateFilter(option[0], d.value);
          }}
        />
      </Dropdown.Menu>
    );
  };

  const renderQuickFilters = () => {
    return Object.entries(dateOptions).map((option) => {
      return (
        <Dropdown
          key={option[0]}
          text={option[1]}
          icon="filter"
          floating
          labeled
          button
          className="icon"
        >
          {renderDatePicker(option)}
        </Dropdown>
      );
    });
  };

  const getTitleOptions = (number) => {
    const titles = [];
    documents.forEach((document) => {
      titles.push(document.title);
    });
    return _.times(number, (index) => ({
      key: index,
      text: titles[index],
      value: index,
    }));
  };

  return (
    <React.Fragment>
      {renderQuickFilters()}
      <Dropdown
        text="Filter Title"
        icon="filter"
        floating
        labeled
        button
        className="icon"
        scrolling
        options={getTitleOptions(documents.length)}
        onChange={(e) => onSubmit('title', e.target.textContent)}
      />
      <Button.Group widths={1}>
        <Button
          float="right"
          primary
          onClick={() => {
            runQuery('POST');
          }}
        >
          Apply Filters
        </Button>
        <Button
          float="right"
          color="red"
          onClick={() => {
            dispatch(setFieldValues(null));
          }}
        >
          Reset Filters
        </Button>
      </Button.Group>
    </React.Fragment>
  );
};

const extractDateFormat = (date) => {
  if (!date) return '';
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  const year = date.getUTCFullYear();
  return year + '-' + month + '-' + day;
};

export default QuickFilters;
