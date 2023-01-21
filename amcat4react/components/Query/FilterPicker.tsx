import { Icon, Popup } from "semantic-ui-react";
import { StyledButton } from "../../styled/StyledSemantic";
import {
  AmcatUser,
  AmcatField,
  AmcatFilter,
  AmcatIndexName,
} from "../../interfaces";
import { filterLabel, FilterPopup } from "./FilterPopups";

// this is needed to make a styled components version of
// semantic ui's Button work as a Popup trigger...
const RefButton = (props: any) => <StyledButton {...props} />;

interface FilterPickerProps {
  user: AmcatUser;
  index: AmcatIndexName;
  field: AmcatField | undefined;
  value: AmcatFilter | undefined;
  onChange: (value: AmcatFilter) => void;
  onDelete?: () => void;
  [key: string]: any;
}
export default function FilterPicker({
  user,
  index,
  field,
  value,
  onChange,
  onDelete,
  ...props
}: FilterPickerProps) {
  if (field == null || value == null) return null;

  return (
    <Popup
      on="click"
      position="bottom center"
      trigger={
        <RefButton {...props} className="valuepicker">
          {onDelete == null ? null : (
            <Icon link name="delete" onClick={onDelete} />
          )}
          {filterLabel(field, value, true)}
        </RefButton>
      }
    >
      <FilterPopup
        user={user}
        index={index}
        field={field}
        value={value}
        onChange={onChange}
      />
    </Popup>
  );
}
