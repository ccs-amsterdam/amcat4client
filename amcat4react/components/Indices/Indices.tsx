import styled from "styled-components";
import { useAmcatIndices, Response, AmcatUser } from "../../../amcat4react";

const StyleWrapper = styled.div`
  box-sizing: border-box;
  font-size: 1.2em;
  margin: auto;
  width: 100%;
  max-width: 400px;
  text-align: center;
  padding: 2rem 0rem;

  h2 {
    color: var(--secondary);
    & span {
      font-size: 0.8em;
    }
  }

  .IndexButtons {
    display: flex;
    flex-direction: column;
  }

  ul {
    font-size: 1.5rem;
    list-style: none;

    & li {
      cursor: pointer;
      padding: 0.3rem;
      border-radius: 5px;
    }
    & li:hover {
      background: var(--primary);
    }
  }
`;

interface Props {
  user: AmcatUser | undefined;
  onSelect: (index: string) => void;
}

export default function Indices({ user, onSelect }: Props) {
  const indices = useAmcatIndices(user);
  if (indices.isLoading) return <Response.LoadingScreen />;
  if (indices.isError) return <Response.ErrorScreen />;

  if (user == null || indices.data == null) return null;

  return (
    <StyleWrapper>
      <h2>
        {user.resource.replace(/^https:\/\//, "")}
        <br />
        <span>Select index</span>
      </h2>

      <ul>
        {indices.data.map((i) => (
          <li key={i.name} onClick={() => onSelect(i.name)}>
            {i.name}
          </li>
        ))}
      </ul>
    </StyleWrapper>
  );
}
