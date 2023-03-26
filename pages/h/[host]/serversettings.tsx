import { useMiddlecatContext } from "../../../amcat4react";
import { useServerConfig } from "../../../amcat4react/hooks/useServerConfig";

export default function ServerSettings() {
  const { user } = useMiddlecatContext();
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
