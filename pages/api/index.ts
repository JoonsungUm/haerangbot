// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { api } = req.body.action.params
  let redirectURL = ''

  switch(api) {
    case '/api/posts/by-title': {
      const { title } = req.body.action.params
      redirectURL = `${api}?title=${encodeURI(title)}`
      break
    }
    case '/api/posts/by-department': {
      const { department } = req.body.action.params
      redirectURL = `${api}?department=${encodeURI(department)}`
      break
    }
    default: {
    }
  }

  res.redirect(303, redirectURL)
}
