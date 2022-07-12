
import Layout from "../../components/layout";
import Head from 'next/head';
import Date from '../../components/date';
import utilStyles from '../../styles/utils.module.css';
import { getAllPostIds, getPostData } from '../../lib/posts';

export async function getStaticProps({ params }) { // take in the array of ID's from the getStaticPaths function 
  const postData = await getPostData(params.id);// the .id here is the url slug used in the browser in this route (i.e. /posts/pop the slug is pop but returns no page since nothing is returned from params.pop and /posts/ssg-ssr ssg-ssr is the slug and params.ssg-ssr returns the blog post for that)
  return { // so the id here is slug from the url used, and if that params.id is found in the params (returned from getAllPostIds below) then we getPostData for that and then return that PostData
    props: {
      postData,
    },
  };
}

export async function getStaticPaths() {
  // gets all the possible values of ID's for the post names
  const paths = getAllPostIds();
  return {
    paths, // contains the array of known paths returned by getAllPostIds
    fallback: false,
  };
}

export default function Post({ postData }) {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  );
}
