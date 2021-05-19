import React, { useState, useEffect } from 'react';
import QueryForm from './QueryForm';
import { useSelector } from 'react-redux';

const Query = () => {
  const amcat = useSelector((state) => state.amcat);
  const amcatIndex = useSelector((state) => state.amcatIndex);

  const [amcatIndexFields, setAmcatIndexFields] = useState(null);
  const [fieldValues, setFieldValues] = useState({});

  useEffect(() => {}, [fieldValues]);

  useEffect(() => {
    if (amcatIndex && amcat) {
      amcat.getFields(amcatIndex.name).then((res) => {
        setAmcatIndexFields(res.data);
      });
    } else {
      setAmcatIndexFields(null);
    }
  }, [amcat, amcatIndex]);

  console.log(amcatIndexFields);
  return <QueryForm />;
};

export default Query;
