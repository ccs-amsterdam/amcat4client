import { useServerConfig } from "../../../amcat4react/hooks/useServerConfig";
import useUser from "../../../hooks/useUser";

export default function ServerSettings() {
  const user = useUser();
  const server = useServerConfig(user);
  console.log(server);
  if (user == null || !server.isSuccess || !server.data) return;

  return (
    <>
      Server: {server.data.resource} <br />
      Authorization mode: {server.data.authorization}
      <br />
    </>
  );
}
