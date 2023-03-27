import { Form } from "semantic-ui-react";
import { AmcatRole, AmcatUserInfo } from "../../interfaces";

interface Props {
  user?: AmcatUserInfo;
  onChange: (user: AmcatUserInfo) => void;
  disableEmail?: boolean;
}

export default function UserForm({ user, onChange, disableEmail }: Props) {
  return (
    <Form>
      <Form.Field disabled={disableEmail}>
        <label>E-mail address</label>
        <Form.Input
          value={user?.email}
          placeholder="user@example.com"
          onChange={(_, { value }) => user && onChange({ ...user, email: value })}
        />
      </Form.Field>
      <Form.Field>
        <label>Server role</label>
        <Form.Dropdown
          value={user?.role}
          options={ROLES}
          onChange={(_, { value }) => user && onChange({ ...user, role: value as AmcatRole })}
        />
      </Form.Field>{" "}
    </Form>
  );
}

const ROLES = [
  { key: "READER", value: "READER", text: "Reader (user can see and open indexes, but not create indexes or users)" },
  { key: "WRITER", value: "WRITER", text: "Writer (user can create but not modify indexes and cannot create users)" },
  { key: "ADMIN", value: "ADMIN", text: "Admin (user has full rights to this server)" },
];
