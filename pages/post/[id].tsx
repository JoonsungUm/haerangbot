import React, { VFC } from 'react'

import { GetStaticProps } from 'next'
import { GetStaticPaths } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'

import { format } from 'date-fns'

import { Post as PostModel, PostAttributes } from '../../db/models/Post'
import { initialize } from '../../db/models'
import config from '../../db/config/config'
import styles from '../../styles/Post.module.css'
import Image from 'next/image'

const Post: VFC<PostAttributes> = (post) => {
    const router = useRouter()

    const {
        type,
        title,
        content,
        publicationNumber,
        noticeNumber,
        createdAt,
        managerName,
        managerPhone,
        department,
    } = post

    return (
        <div className={styles.container}>
            <Head>
                <title>{router.isFallback ? '불러오는 중...' : title}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                {router.isFallback ? (
                    <p className={styles.description}>불러오는 중...</p>
                ) : (
                    <>
                        <h3 className={styles.title}>{title}</h3>

                        <div className={styles.grid}>
                            <table className={styles.card}>
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
                            </table>
                            <table className={styles.card}>
                                <tbody>
                                    <tr>
                                        <td style={{ fontWeight: 'bold' }}>등록일</td>
                                        <td>{format(new Date(createdAt), 'yyyy-MM-dd')}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ fontWeight: 'bold' }}>담당부서</td>
                                        <td>{department}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ fontWeight: 'bold' }}>담당자/연락처</td>
                                        <td>
                                            {managerName} / {managerPhone}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className={styles.description}>{content}</p>
                    </>
                )}
            </main>

            <footer className={styles.footer}>
                <a href="http://pf.kakao.com/_UxeVnK" target="_blank" rel="noopener noreferrer">
                    남해군청 공고/고시 알림이 해랑봇
                    <span style={{ marginLeft: 8 }}>
                        <Image src="/icon.jpeg" alt="Haerang Logo" height="48" width="48" />
                    </span>
                </a>
            </footer>
        </div>
    )
}

export default Post

export const getStaticProps: GetStaticProps = async ({ params }) => {
    if (!params?.id) {
        return { props: { post: null } }
    }

    const env = process.env.NODE_ENV || 'development'
    const sequelize = await initialize(config[env] as any)

    const post = await PostModel.findOne({
        where: {
            number: params.id,
        },
        raw: true,
    })

    await sequelize.close()

    if (!post) {
        return { props: { post: null } }
    }

    return {
        props: {
            ...post,
            createdAt: format(new Date(post.createdAt), 'yyyy-MM-dd'),
        },
        revalidate: 1,
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
    return { paths: [], fallback: true }
}
