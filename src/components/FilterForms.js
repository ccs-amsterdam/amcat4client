import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';

import { setIndexFields, setFieldValues } from '../actions';

import { Button, Form, Container } from 'semantic-ui-react';
import SemanticDatepicker from 'react-semantic-ui-datepickers';

const FilterForms = function () {
  const amcat = useSelector((state) => state.amcat);
  const amcatIndex = useSelector((state) => state.amcatIndex);
  const fields = useSelector((state) => state.indexFields);
  const fieldValues = useSelector((state) => state.fieldValues);
  const dispatch = useDispatch();

  useEffect(() => {
    if (amcatIndex && amcat) {
      amcat.getFields(amcatIndex.name).then((res) => {
        dispatch(setIndexFields(res.data));
      });
    } else {
      setIndexFields(null);
    }
  }, [amcat, amcatIndex, dispatch]);

  const onSubmit = (key, value) => {
    let newFieldValues = { ...fieldValues };
    newFieldValues[key] = value;
    if (value === '') {
      console.log('ommitting');
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
  };

  const extractDateFormat = (date) => {
    if (!date) return '';
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const year = date.getUTCFullYear();
    return year + '-' + month + '-' + day;
  };

  const renderFields = () => {
    return Object.keys(fields).map((key) => {
      if (fields[key] === 'text') {
        return (
          <Form.TextArea
            key={key}
            value={fieldValues[key] ? fieldValues[key] : ''}
            onChange={(e, d) => onSubmit(key, d.value)}
            label={key.charAt(0).toUpperCase() + key.slice(1)}
          />
        );
      }
      if (fields[key] === 'date') {
        return (
          <Container key="date_filter">
            <Form.Field key={key + '_gte'}>
              <SemanticDatepicker
                key="gte"
                type="basic"
                label="Start Date"
                locale={navigator.locale}
                format="YYYY-MM-DD"
                onChange={(e, d) => {
                  e.stopPropagation();

                  dateFilter('gte', d.value);
                }}
              />
            </Form.Field>
            <Form.Field key={key + '_lte'}>
              <SemanticDatepicker
                key="lte"
                type="basic"
                label="End Date"
                locale={navigator.locale}
                format="YYYY-MM-DD"
                onChange={(e, d) => {
                  e.stopPropagation();

                  dateFilter('lte', d.value);
                }}
              />
            </Form.Field>
          </Container>
        );
      }
      if (fields[key] === 'keyword') {
        return (
          <Form.Field key={key}>
            <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
            <input
              value={fieldValues[key] ? fieldValues[key] : ''}
              onChange={(e) => onSubmit(key, e.target.value)}
            />
          </Form.Field>
        );
      }
      return null;
    });
  };

  if (!fields) return null;
  else
    return (
      <Container>
        <Container>{renderFields()}</Container>
        <br />
        <Button.Group widths={2}>
          <Button
            className="ui red button"
            onClick={() => dispatch(setFieldValues(null))}
          >
            Reset Filters
          </Button>
        </Button.Group>
      </Container>
    );
};

export default FilterForms;
