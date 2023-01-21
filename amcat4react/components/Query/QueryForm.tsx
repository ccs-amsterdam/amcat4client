import { useState } from "react";
import styled from "styled-components";
import { useFields } from "../../Amcat";
import { AmcatIndexName, AmcatQuery, AmcatUser } from "../../interfaces";
import MultilineQueryForm from "./MultilineQueryForm";
import SimpleQueryForm from "./SimpleQueryForm";

const StyleWrapper = styled.div`
  padding-bottom: 2rem;
`;

export interface QueryFormProps {
  user: AmcatUser;
  index: AmcatIndexName;
  value: AmcatQuery;
  onSubmit: (value: AmcatQuery) => void;
}

export default function QueryForm({
  user,
  index,
  value,
  onSubmit,
}: QueryFormProps) {
  const [simple, setSimple] = useState(true);
  const fields = useFields(user, index);

  if (!index) return null;
  const QForm = simple ? SimpleQueryForm : MultilineQueryForm;
  const handleClick = () => {
    setSimple(!simple);
  };
  // Thanks to https://icons.getbootstrap.com/icons/chevron-compact-down/
  const chevron = simple
    ? "M1.553 6.776a.5.5 0 0 1 .67-.223L8 9.44l5.776-2.888a.5.5 0 1 1 .448.894l-6 3a.5.5 0 0 1-.448 0l-6-3a.5.5 0 0 1-.223-.67z"
    : "M7.776 5.553a.5.5 0 0 1 .448 0l6 3a.5.5 0 1 1-.448.894L8 6.56 2.224 9.447a.5.5 0 1 1-.448-.894l6-3z";

  return (
    <StyleWrapper>
      <QForm user={user} index={index} value={value} onSubmit={onSubmit} />

      <div style={{ display: "flex" }}>
        <div style={{ flexGrow: 1 }} />
        <svg
          className="chevron"
          preserveAspectRatio="none"
          onClick={handleClick}
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="24"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path fillRule="evenodd" d={chevron} />
        </svg>
        <div style={{ flexGrow: 1 }} />
      </div>
    </StyleWrapper>
  );
}
