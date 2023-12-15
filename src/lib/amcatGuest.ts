import { AmcatUser } from "@/amcat/interfaces";
import axios from "axios";

//const server = "http://localhost/amcat";
const server = "https://open.amcat.nl/amcat";

export default function amcatGuest(): AmcatUser {
  const api = axios.create({
    baseURL: server,
  });

  const killSession = async (signOutMiddlecat: boolean) =>
    console.error("Not implemented");

  return {
    email: "",
    name: "",
    image: "",
    authenticated: false,
    authDisabled: false,
    api,
    resource: "",
    middlecat: "",
    killSession,
  };
}
