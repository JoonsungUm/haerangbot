// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Op } from 'sequelize'
import config from '../../../db/config/config'
import { initialize } from '../../../db/models'
import { Post, PostAttributes } from '../../../db/models/Post'
import { getCardItems } from '../../../utils/template'

const MAX_LENGTH = 20

export default async (req, res) => {
  const { method } = req
  const { title } = req.body.action.params


  const env = process.env.NODE_ENV || 'development'

  const sequelize = await initialize((config[env] as any))

  const posts = await Post.findAndCountAll({
    where: {
      title: {
        [Op.like]: `%${title}%`,
      },
    },
    order: [['number', 'DESC']],
    limit: MAX_LENGTH,
    raw: true,
  })

  res.setHeader('Cache-Control', 'max-age=0, s-maxage=86400')

  switch (method) {
    case 'GET':
      res.status(200).json(posts.rows)

      break
    case 'POST':
      const cardItems = await getCardItems(posts.rows)

      const responseBody = {
        version: '2.0',
        template: {
          outputs: [
            {
              simpleText: {
                text: `현재 올라온 ${title} 관련 공고 중 최근 ${posts.count}개를 보여드립니다.`,
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
