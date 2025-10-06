import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    amcatServer: process.env.AMCAT_SERVER || process.env.NEXT_PUBLIC_AMCAT_SERVER || "http://localhost:5000",
  });
}
