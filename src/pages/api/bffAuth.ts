// currently running this in pages router, because for some reason the app directory decided to completely change how req and res work

import type { NextApiRequest, NextApiResponse } from "next";
import { bffAuthHandler } from "middlecat-react";
import Cookies from "cookies";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = new Cookies(req, res);
  return await bffAuthHandler(req, res, cookies);
}
