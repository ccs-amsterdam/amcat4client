import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setIndexFields, setFieldValues } from '../actions';

import { Button, Form, Segment } from 'semantic-ui-react';
import SemanticDatepicker from 'react-semantic-ui-datepickers';

const FilterForms = function (props) {
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
    const newFieldValues = { ...fieldValues };
    console.log(newFieldValues);
    newFieldValues[key] = value;
    dispatch(setFieldValues(newFieldValues));
  };

  const renderFields = () => {
    return Object.keys(fields).map((key) => {
      if (fields[key] === 'text') {
        return (
          <Form.TextArea
            key={key}
            value={fieldValues[key] ? fieldValues[key] : ''}
            onChange={(e, d) => onSubmit(key, d.value)}
            label={key}
          />
        );
      }
      if (fields[key] === 'date') {
        return (
          <SemanticDatepicker
            key={key}
            type="range"
            label={'from'}
            value={fieldValues[key] ? fieldValues[key] : ''}
            onChange={(e, d) => onSubmit(key, d.value)}
          />
        );
      }
      if (fields[key] === 'keyword') {
        return (
          <Form.Field key={key}>
            <label>{key}</label>
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
      <Segment>
        <Form>{renderFields()}</Form>
        <br />
        <Button.Group widths={2}>
          <Button
            className="ui primary button"
            onClick={() => dispatch(setFieldValues(null))}
          >
            {' '}
            Reset Filters
          </Button>
        </Button.Group>
      </Segment>
    );
};

export default FilterForms;
