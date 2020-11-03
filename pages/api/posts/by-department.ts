// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Op } from 'sequelize'
import config from '../../../db/config/config'
import { initialize } from '../../../db/models'
import { Post } from '../../../db/models/Post'
import { getCardItems } from '../../../utils/template'

const MAX_LENGTH = 20

export default async (req, res) => {
  const { department } = req.query
  const env = process.env.NODE_ENV || 'development'
  const sequelize = await initialize((config[env] as any))

  res.setHeader('Cache-Control', 'max-age=0, s-maxage=86400, stale-while-revalidate')

  const start = new Date().getTime()
  const posts = await Post.findAndCountAll({
    where: {
      department: {
        [Op.like]: `%${department}%`,
      },
    },
    order: [['number', 'DESC']],
    limit: MAX_LENGTH,
    raw: true,
  })
  console.log('mysql', new Date().getTime() - start)

  const cardItems = await getCardItems(posts.rows)

  const responseBody = {
    version: '2.0',
    template: {
      outputs: [
        {
          simpleText: {
            text: `현재 올라온 ${department} 담당 공고 중 최근 ${posts.count > MAX_LENGTH ? MAX_LENGTH : posts.count}개를 보여드립니다.`,
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
  await sequelize.close()
}
