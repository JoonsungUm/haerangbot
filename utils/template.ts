import { PostAttributes } from '../db/models/Post'
import { format } from 'date-fns'

export const getCardItems = async (
  posts: PostAttributes[],
) => {
  const result = posts.map(post => {
    const { title, createdAt, startDate, endDate, department, managerName, managerPhone } = post

    return {
      title,
      description: `-등록일: ${format(createdAt, 'yyyy-MM-dd')}\n-게재기간: ${startDate}~${endDate}\n-담당부서: ${department}\n-담당자: ${managerName}/${managerPhone}`,
      buttons: [
        {
          action: 'webLink',
          label: '자세히 보기',
          webLinkUrl: `https://google.com`,
        },
        {
          action: 'share',
          label: '공유하기',
        },
      ],
    }
  })

  return result
}
