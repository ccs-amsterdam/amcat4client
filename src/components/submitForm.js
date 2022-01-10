import React, { useEffect, useState } from 'react';
import { Select, Form, Button, Icon } from 'semantic-ui-react';
import { useSelector } from 'react-redux';

const SubmitForm = ({ data, amcatIndex, fileRef }) => {
  const amcat = useSelector((state) => state.amcat);
  const [options, setOptions] = useState([]);
  const [dateField, setDateField] = useState(null);
  const [titleField, setTitleField] = useState(null);
  const [textField, setTextField] = useState(null);
  const [annotationsField, setAnnotationsField] = useState(null);

  useEffect(() => {
    if (data.length <= 1) {
      setDateField(null);
      setTitleField(null);
      setTextField(null);
      setAnnotationsField(null);
      setOptions([]);
      return;
    }

    setOptions(
      data[0].data.map((colname) => {
        return { key: colname, value: colname, text: colname };
      })
    );
    setDateField(data[0].data.includes('date') ? 'date' : null);
    setTitleField(data[0].data.includes('title') ? 'title' : null);
    setTextField(data[0].data.includes('text') ? 'text' : null);
  }, [data]);

  const csvToJson = (data, titleField, textField, annotationsField) => {
    const keys = data[0].data;
    return data.slice(1).map((row) => {
      const datarow = row.data.reduce(
        (obj, value, i) => {
          let key = keys[i];
          if (key === dateField) {
            obj['date'] = value;
          } else if (key === titleField) {
            obj['title'] = value;
          } else if (key === textField) {
            obj['text'] = value;
          } else {
            obj['meta'][key] = value;
          }
          return obj;
        },
        { meta: {}, annotations: '' }
      );
      datarow.meta = JSON.stringify(datarow.meta, null, 2);
      return datarow;
    });
  };

  const uploadData = async () => {
    try {
      const preparedData = csvToJson(
        data,
        titleField,
        textField,
        annotationsField
      );
      await amcat.createDocuments(amcatIndex.name, preparedData);
      fileRef.current.removeFile();
    } catch (e) {
      console.log(e);
    }
  };

  if (data.length <= 1) return null;

  return (
    <>
      <Form>
        <Form.Group>
          <Form.Field
            control={Select}
            placeholder="title column"
            options={options}
            value={titleField}
            onChange={(e, d) => setTitleField(d.value)}
          />
          <Form.Field
            control={Select}
            placeholder="text column"
            options={options}
            value={textField}
            onChange={(e, d) => setTextField(d.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Field
            control={Select}
            clearable
            placeholder="annotations (optional)"
            options={options}
            value={annotationsField}
            onChange={(e, d) => setAnnotationsField(d.value)}
          />
          <Form.Field
            control={Button}
            fluid
            onClick={uploadData}
            disabled={!titleField || !textField}
          >
            <Icon name="upload" />
            Upload
          </Form.Field>
        </Form.Group>
      </Form>
    </>
  );
};

export default SubmitForm;
