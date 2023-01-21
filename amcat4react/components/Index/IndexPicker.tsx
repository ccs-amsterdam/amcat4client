import { useState, useEffect } from "react";
import { Dropdown, DropdownItemProps } from "semantic-ui-react";
import { StyledButton } from "../../styled/StyledSemantic";
import { getIndices } from "../../Amcat";
import { AmcatUser, AmcatIndexName } from "../../interfaces";

import IndexCreate from "./IndexCreate";
import IndexDelete from "./IndexDelete";

interface IndexPickerProps {
  user: AmcatUser;
  value: AmcatIndexName;
  onChange: (index: AmcatIndexName) => void;
}

export default function IndexPicker({
  user,
  value,
  onChange,
}: IndexPickerProps) {
  const [options, setOptions] = useState<DropdownItemProps[]>([]);
  const canCreate = true;
  const canDelete = true;

  useEffect(() => {
    if (user != null) prepareOptions(user, value, setOptions);
    else setOptions([]);
  }, [user, value, setOptions]);

  if (!user) return null;
  const setIndex = (name: string) => {
    value = name;
    onChange(value);
  };

  const handleCreate = (name: string) => {
    prepareOptions(user, name, setOptions);
    setIndex(name);
  };
  const handleDelete = () => {
    prepareOptions(user, "", setOptions);
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: "1 1 auto" }}>
        <Dropdown
          placeholder="select index"
          fluid
          search
          selection
          value={value}
          options={options}
          onChange={(e, d) => setIndex(d.value as string)}
        />
      </div>

      <div style={{ flex: "0 1 auto" }}>
        <StyledButton.Group
          style={{ marginLeft: canDelete || canCreate ? "5px" : "0" }}
        >
          {!canCreate ? null : (
            <IndexCreateButton user={user} onCreate={handleCreate} />
          )}
          {!canDelete ? null : (
            <IndexDeleteButton
              user={user}
              index={value}
              onDelete={handleDelete}
            />
          )}
        </StyledButton.Group>
      </div>
    </div>
  );
}

const buttonStyle = { paddingLeft: "5px", paddingRight: "5px" };

interface CreateButtonProps {
  user: AmcatUser;
  onCreate: (name: string) => void;
}

const IndexCreateButton = ({ user, onCreate }: CreateButtonProps) => {
  const [open, setOpen] = useState(false);
  const handleClose = (name: string | undefined) => {
    setOpen(false);
    if (name) {
      onCreate(name);
    }
  };
  return (
    <>
      <StyledButton
        icon="plus"
        style={buttonStyle}
        onClick={() => setOpen(true)}
      />
      <IndexCreate user={user} onClose={handleClose} open={open} />
    </>
  );
};

interface DeleteButtonProps {
  user: AmcatUser;
  index: AmcatIndexName;
  onDelete: (index: AmcatIndexName) => void;
}
const IndexDeleteButton = ({ user, index, onDelete }: DeleteButtonProps) => {
  const [open, setOpen] = useState(false);

  const handleDelete = (deleted: boolean) => {
    setOpen(false);
    // when a new index is delete, unselect it, and re-create options
    if (deleted) {
      onDelete(index);
    }
  };
  return (
    <>
      <StyledButton
        disabled={!index}
        icon="minus"
        style={buttonStyle}
        onClick={() => setOpen(true)}
      />
      ;
      <IndexDelete
        user={user}
        index={index}
        open={open}
        onClose={handleDelete}
      />
      ;
    </>
  );
};

async function prepareOptions(
  user: AmcatUser,
  selected: string,
  setOptions: (options: DropdownItemProps[]) => void
) {
  try {
    const res = await getIndices(user);
    const options = res.data.map((ix: { name: string; role: string }) => {
      return {
        key: ix.name,
        value: ix.name,
        text: ix.name,
        description: ix.role,
        selected: ix.name === selected,
      };
    });
    setOptions(options);
  } catch (e) {
    console.log(e);
    setOptions([]);
  }
}
