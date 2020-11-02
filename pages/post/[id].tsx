import React, { FC } from 'react'

import { GetStaticProps } from 'next'
import { GetStaticPaths } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'

import { format } from 'date-fns'

import { Post as PostModel, PostAttributes } from '../../db/models/Post'
import { initialize } from '../../db/models'
import config from '../../db/config/config'
import styles from '../../styles/Post.module.css'

const Post: FC<PostAttributes> = post => {
  const router = useRouter()
  const { type, title, content, publicationNumber, noticeNumber, createdAt, startDate, endDate, managerName, managerPhone, department } = post

  if (router.isFallback) {
    return (
      <div className={styles.container}>
        <Head>
          <title>불러오는 중...</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.main}>
          <p className={styles.description}>불러오는 중...</p>
        </main>
      </div>
    )
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h3 className={styles.title}>
          {title}
        </h3>

        <div className={styles.grid}>
          <div className={styles.card}>
            <tbody>
              <tr>
                <td style={{ fontWeight: 'bold' }}>고시공고구분</td>
                <td>{type}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold' }}>고시공고번호</td>
                <td>{noticeNumber}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold' }}>게재제호</td>
                <td>{publicationNumber}</td>
              </tr>
            </tbody>
          </div>
          <div className={styles.card}>
            <tbody>
              <tr>
                <td style={{ fontWeight: 'bold' }}>등록일</td>
                <td>{createdAt}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold' }}>담당부서</td>
                <td>{department}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold' }}>담당자/연락처</td>
                <td>{managerName} / {managerPhone}</td>
              </tr>
            </tbody>
          </div>
        </div>
        <p className={styles.description}>
          {content}
        </p>
      </main>

      <footer className={styles.footer}>
        <a
          href="http://pf.kakao.com/_UxeVnK"
          target="_blank"
          rel="noopener noreferrer"
        >
          남해군청 공고/고시 알림이 해랑봇{' '}
          <img src="/icon.jpeg" alt="Haerang Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}

export default Post

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const env = process.env.NODE_ENV || 'development'
  const sequelize = await initialize((config[env] as any))

  const post = await PostModel.findOne({
    where: {
      number: params.id
    },
    raw: true,
  })

  await sequelize.close()

  return {
    props: {
      ...post,
      createdAt: format(post.createdAt, 'yyyy-MM-dd'),
    },
    revalidate: 1,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: true }
}
