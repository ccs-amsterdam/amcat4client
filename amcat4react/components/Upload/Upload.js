import { useRef, useEffect, useState } from "react";
import { Container } from "semantic-ui-react";
import { useCSVReader } from "react-papaparse";
import ImportTable from "./ImportTable";
import SubmitButton from "./SubmitButton";
import { getFields } from "../../Amcat";

const styles = {
  csvReader: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 10,
  },
  browseFile: {
    width: "20%",
  },
  acceptedFile: {
    border: "1px solid #ccc",
    height: 45,
    lineHeight: 2.5,
    paddingLeft: 10,
    width: "80%",
  },
  remove: {
    borderRadius: 0,
    padding: "0 20px",
  },
  progressBarBackgroundColor: {
    backgroundColor: "red",
  },
};

export default function Upload({ user, index }) {
  const { CSVReader } = useCSVReader();
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState(null);
  const [fields, setFields] = useState(null);
  const fileRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;
    getFields(user, index)
      .then((res) => {
        setFields(res.data);
      })
      .catch((e) => {
        setFields(null);
        console.log(e);
      });
  }, [index, data, setFields]);

  useEffect(() => {
    if (!fields) return;
    if (data.length <= 1) return;
    const columns = data[0].map((name) => {
      return { name, field: name, type: fields?.[name]?.type || "auto" };
    });
    setColumns(columns);
  }, [fields, data, setColumns, setFields]);

  const reset = () => {
    if (fileRef.current) fileRef.current.click();
    setData([]);
  };

  return (
    <Container>
      <CSVReader
        onUploadAccepted={(res) => {
          setData(res.data);
        }}
      >
        {({ getRootProps, acceptedFile, ProgressBar, getRemoveFileProps }) => (
          <>
            <div style={styles.csvReader}>
              <button
                type="button"
                {...getRootProps()}
                style={styles.browseFile}
              >
                Browse file
              </button>
              <div style={styles.acceptedFile}>
                {acceptedFile && acceptedFile.name}
              </div>
              <button
                ref={fileRef}
                {...getRemoveFileProps()}
                style={styles.remove}
              >
                Remove
              </button>
            </div>
            <ProgressBar style={styles.progressBarBackgroundColor} />
          </>
        )}
      </CSVReader>
      <br />
      <ImportTable
        data={data}
        columns={columns}
        setColumns={setColumns}
        fields={fields}
      />
      <SubmitButton
        index={index}
        data={data}
        columns={columns}
        fields={fields}
        reset={reset}
      />
    </Container>
  );
}
