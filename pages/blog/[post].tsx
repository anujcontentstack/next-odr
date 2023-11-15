import React, { useState } from 'react';

import parse from 'html-react-parser';
import moment from 'moment';
import { GetServerSidePropsContext } from 'next/types';
import Skeleton from 'react-loading-skeleton';

import ArchiveRelative from '../../components/archive-relative';
import RenderComponents from '../../components/render-components';
import {
  getBlogPostRes,
  getPageRes,
} from '../../helper';
import {
  BlogPosts,
  Page,
  PageUrl,
} from '../../typescript/pages';

export default function BlogPost({ blogPost, page, pageUrl }: { blogPost: BlogPosts, page: Page, pageUrl: PageUrl }) {

  const [getPost, setPost] = useState({ banner: page, post: blogPost });
  async function fetchData() {
    try {
      const entryRes = await getBlogPostRes(pageUrl);
      const bannerRes = await getPageRes('/blog');
      if (!entryRes || !bannerRes) throw new Error('Status: ' + 404);
      setPost({ banner: bannerRes, post: entryRes });
    } catch (error) {
      console.error(error);
    }
  }

  // useEffect(() => {
  //   onEntryChange(() => fetchData());
  // }, [blogPost]);

  const { post, banner } = getPost;
  return (
    <>
      {banner ? (
        <RenderComponents
          pageComponents={banner.page_components}
          blogPost
          contentTypeUid='blog_post'
          entryUid={banner?.uid}
          locale={banner?.locale}
        />
      ) : (
        <Skeleton height={400} />
      )}
      <div className='blog-container'>
        <article className='blog-detail'>
          {post && post.title ? (
            <h2 {...post.$?.title as {}}>{post.title}</h2>
          ) : (
            <h2>
              <Skeleton />
            </h2>
          )}
          {post && post.date ? (
            <p {...post.$?.date as {}}>
              {moment(post.date).format('ddd, MMM D YYYY')},{' '}
              <strong {...post.author[0].$?.title as {}}>
                {post.author[0].title}
              </strong>
            </p>
          ) : (
            <p>
              <Skeleton width={300} />
            </p>
          )}
          {post && post.body ? (
            <div {...post.$?.body as {}}>{parse(post.body)}</div>
          ) : (
            <Skeleton height={800} width={600} />
          )}
        </article>
        <div className='blog-column-right'>
          <div className='related-post'>
            {banner && banner?.page_components[2].widget ? (
              <h2 {...banner?.page_components[2].widget.$?.title_h2 as {}}>
                {banner?.page_components[2].widget.title_h2}
              </h2>
            ) : (
              <h2>
                <Skeleton />
              </h2>
            )}
            {post && post.related_post ? (
              <ArchiveRelative
                {...post.$?.related_post}
                blogs={post.related_post}
              />
            ) : (
              <Skeleton width={300} height={500} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export async function getServerSideProps({ params, res }: GetServerSidePropsContext) {
  try {
    const page = await getPageRes('/blog');
    const posts = await getBlogPostRes(`/blog/${params?.post}`);
    if (!page || !posts) throw new Error('404');

    res.setHeader("cache-control", "max-age=14400, s-maxage=84000, no-store");

    return {
      props: {
        pageUrl: `/blog/${params?.post}`,
        blogPost: posts,
        page,
      },
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
}
