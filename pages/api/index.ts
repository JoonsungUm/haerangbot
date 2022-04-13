// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'cross-fetch'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

const apiRoot = async (req: NextApiRequest, res: NextApiResponse) => {
    const { api } = req.body.action.params
    let redirectURL = ''

    switch (api) {
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
            redirectURL = api
        }
    }

    try {
        const start = new Date().getTime()
        const apiData = await fetch(`${BASE_URL}${redirectURL}`)
        console.log(redirectURL, new Date().getTime() - start)

        if (apiData.status >= 400) {
            throw new Error('Bad response from server')
        }

        const result = await apiData.json()
        res.status(200).json(result)
    } catch (err) {
        console.error(err)
        res.status(400)
    }
}

export default apiRoot
