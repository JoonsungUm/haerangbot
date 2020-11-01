// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import config from '../../db/config/config'
import { initialize } from '../../db/models'
import { Post, PostAttributes } from '../../db/models/Post'
import { getCardItems } from '../../utils/template'

const MAX_LENGTH = 50

export default async (req, res) => {
  const { method } = req

  const env = process.env.NODE_ENV || 'development'

  const sequelize = await initialize((config[env] as any))

  const posts: PostAttributes[] = await Post.findAll({
    order: [['id', 'DESC']],
    limit: MAX_LENGTH,
    raw: true,
  })

  switch (method) {
    case 'GET':
      // Get data from your database
      const data: PostAttributes = await Post.findOne({raw: true})

      res.status(200).json(posts)

      break
    case 'POST':
      const cardItems = await getCardItems(posts)

      const responseBody = {
        version: '2.0',
        template: {
          outputs: [
            {
              simpleText: {
                text: `현재 올라온 공고 중 최근 ${MAX_LENGTH}개를 보여드립니다.`,
              },
            },
            {
              carousel: {
                type: 'basicCard',
                items: cardItems,
              },
            },
          ],
          quickReplies: [
            {
              label: '처음으로',
              action: 'message',
              messageText: '처음으로',
            },
          ],
        },
      }

      res.status(200).json(responseBody)

      break
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }

  await sequelize.close()
}
