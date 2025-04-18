// pages/api/revalidate.js

import { NextApiRequest, NextApiResponse } from "next/types";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse) {
  // Check for secret to confirm this is a valid request
  if (req.query.revalidate_secret !== process.env.REVALIDATE_SECRET_TOKEN) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  try {
    if (req.query.pages) {
      const pages = (req.query.pages as string).split(',')
      for (let index = 0; index < pages.length; index++) {
        const page = pages[index];
        if (page === 'home') {
          // We revalidate next js api related to home page
          await res.revalidate(`/_site/${req.query.site}`)
        } else {
          await res.revalidate(`/_custom/${req.query.site}/${page}`)
        }
      }
    }
    return res.json({ revalidated: true })
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send('Error revalidating')
  }
}