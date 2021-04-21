import React, { useState } from "react";
import { Segment, Form, Grid, Modal, Button, Icon } from "semantic-ui-react";
import { useSelector, useDispatch } from "react-redux";
import { setDocuments } from "../actions";
import AmcatIndexSelector from "./AmcatIndexSelector";
import DocumentTable from "./DocumentTable";
import SemanticDatepicker from "react-semantic-ui-datepickers";

const QueryForm = () => {
  const amcat = useSelector((state) => state.amcat);
  const amcatIndex = useSelector((state) => state.amcatIndex);
  const dispatch = useDispatch();

  const [query, setQuery] = useState("");

  const onSubmit = () => {
    const fields = ["date", "title", "url"];

    amcat
      .getQuery(amcatIndex.name, query, fields, "2m", 100, {})
      .then((res) => {
        dispatch(setDocuments(res.data.results));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <Grid>
      <Grid.Column floated="left" width={6}>
        <Segment style={{ border: "0" }}>
          <AmcatIndexSelector type="dropdown" />
          <Form>
            <Button primary type="submit" onClick={onSubmit}>
              <Icon name="search" />
              Search
            </Button>
          </Form>
        </Segment>
      </Grid.Column>
      <Grid.Column width={10}>
        <Grid.Row>
          <Segment style={{ border: "0" }}>
            <Form style={{ marginBottom: "2em" }}>
              <Form.Group>
                <Form.TextArea
                  width={16}
                  placeholder="Query"
                  style={{ height: 200 }}
                  onChange={(e, d) => setQuery(d.value)}
                />
              </Form.Group>
              <QueryHelp />
            </Form>
          </Segment>
        </Grid.Row>
        <Grid.Row>
          <DocumentTable />
        </Grid.Row>
      </Grid.Column>
    </Grid>
  );
};

const FilterForms = function ({ fields, fieldValues, setFieldValues }) {
  const onSubmit = (key, value) => {
    const newFieldValues = { ...fieldValues };
    newFieldValues[key] = value;
    setFieldValues(newFieldValues);
  };

  if (!fields) return null;

  return Object.keys(fields).map((key) => {
    if (fields[key] === "text") {
      return (
        <Form.TextArea
          key={key}
          value={fieldValues[key] ? fieldValues[key] : ""}
          onChange={(e, d) => onSubmit(key, d.value)}
          label={key}
        />
      );
    }
    if (fields[key] === "date") {
      return (
        <SemanticDatepicker
          key={key}
          type="range"
          label={"from"}
          value={fieldValues[key] ? fieldValues[key] : ""}
          onChange={(e, d) => onSubmit(key, d.value)}
        />
      );
    }
    if (fields[key] === "keyword") {
      return (
        <Form.Field key={key}>
          <label>{key}</label>
          <input
            value={fieldValues[key] ? fieldValues[key] : ""}
            onChange={(e) => onSubmit(key, e.target.value)}
          />
        </Form.Field>
      );
    }
    return null;
  });
};

const QueryHelp = () => {
  const [open, setOpen] = useState(false);

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <span
          style={{
            cursor: "pointer",
            color: "blue",
            float: "right",
          }}
        >
          Query help
        </span>
      }
    >
      <Modal.Header>Query help</Modal.Header>
      <Modal.Content>
        <p>
          If there is no boolean operator between two terms, the OR operator is
          used. Therefore, the query "a b" is parsed as "a OR b".
        </p>
        <h4>Search Identifier</h4>
        <p>
          identifier#query = separate the identifier from the query with the #
          character, such as pvda#pvda OR "wouter bos" OR "partij van de arbeid"
          The query identifier can be used in further queries, marked with
          [brackets]. Example: partijen#[pvda] OR [cda] (where pvda and cda have
          been previously defined)
        </p>
        <h4>Wildcards</h4>
        <p>
          ? = Single character wildcard, like te?t will find both test and text
          * = Multiple character wildcard, like mosl* will find moslim, moslims,
          etc.
        </p>
        <p>Note: You can not start a term with a wildcard</p>
        <h4>Proximity Search</h4>
        <p>
          "word1 word2"~10 = Search with word distance 10 between word1 and
          word2
        </p>
        <p>
          "(word1 OR word2 OR word*) word3"~5 = Search with word distance 5
          between word1 OR word2 OR word*, and word3
        </p>
        <h4>Fuzzy Search</h4>
        <p>
          koe~ or koe~0.9 = fuzzy search where the value should be between 0
          (low similarity) and 1 (high similarity)
        </p>
        <h4>NOT</h4>
        <p>
          word1 NOT (word2 word3) = Search for documents containing word1 and
          not word2 and not word3
        </p>
        <h4>Headline only</h4>
        <p>Use headline:keyword to only search the headline for "keyword"</p>

        <a href="https://lucene.apache.org/core/3_4_0/queryparsersyntax.html">
          More info about the Lucene query syntax
        </a>
      </Modal.Content>
    </Modal>
  );
};

export default QueryForm;
