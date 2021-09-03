import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import Plotly from 'plotly.js';

import createPlotlyComponent from 'react-plotly.js/factory';
const PlotlyComponent = createPlotlyComponent(Plotly);

const Plot = () => {
  const [dates, setDates] = useState(null);
  const [docsOverTime, setDocsOverTime] = useState([]);

  const documents = useSelector((state) => state.documents);

  const unpack = (rows, key) => {
    return rows.map(function (row) {
      return row[key];
    });
  };

  useEffect(() => {
    if (documents) {
      setDates(unpack(documents, 'date'));
      setDocsOverTime(() => {
        const dates = unpack(documents, 'date');
        const docsOverTime = [];

        dates.map((date) => {
          docsOverTime.push(_.filter(documents, { date: date }).length);
          return docsOverTime;
        });
        return docsOverTime;
      });
    }
  }, [documents]);

  return (
    <PlotlyComponent
      data={[
        {
          x: dates,
          y: docsOverTime,

          type: 'scatter',
          mode: 'lines+markers',
          line: { color: '#0E6EB8' },
        },
        {},
      ]}
      layout={{
        width: '95%',
        height: 500,
        //   title: 'Documents over time',
        font: {
          family: 'Lato',
          size: 12,
        },
        xaxis: {
          title: {
            text: 'Time (Date)',
          },
        },
        yaxis: {
          title: {
            text: 'Number of Documents',
          },
        },
      }}
      config={{ displaylogo: false }}
    />
  );
};

export default Plot;
