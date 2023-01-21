import { useState } from "react";
import { Icon, Popup } from "semantic-ui-react";
import { StyledButton } from "../../styled/StyledSemantic";
import { AmcatField, AmcatQuery } from "../../interfaces";
import { getFieldTypeIcon } from "../../Amcat";

// this is needed to make a styled components version of
// semantic ui's Button work as a Popup trigger...
const RefButton = (props: any) => <StyledButton {...props} />;

export function fieldOptions(fields: AmcatField[], query: AmcatQuery) {
  return fields
    .filter((f) => !Object.keys(query?.filters || {}).includes(f.name))
    .filter((f) => ["date", "keyword", "tag"].includes(f.type));
}

interface AddFilterProps {
  options: AmcatField[];
  onClick: (value: string) => void;
  addFilterLabel?: string;
}
export default function AddFilterButton({
  options,
  onClick,
  addFilterLabel,
}: AddFilterProps) {
  const [addOpen, setAddOpen] = useState(false);
  return (
    <Popup
      open={addOpen}
      onOpen={() => setAddOpen(true)}
      onClose={() => setAddOpen(false)}
      on="click"
      trigger={
        <RefButton primary circular>
          <Icon.Group>
            <Icon name="filter" />
            <Icon corner name="add" color="blue" />
          </Icon.Group>
          <span className="addfiltertext">
            {addFilterLabel || "Add Filter"}
          </span>
        </RefButton>
      }
    >
      <b>{addFilterLabel || "Add Filter"}</b>
      <br />
      <StyledButton.Group basic vertical>
        {options.map((f) => (
          <StyledButton
            key={f.name}
            icon
            labelPosition="left"
            onClick={() => {
              setAddOpen(false);
              onClick(f.name);
            }}
          >
            <Icon name={getFieldTypeIcon(f.type)} />
            {f.name}
          </StyledButton>
        ))}
      </StyledButton.Group>
    </Popup>
  );
}
