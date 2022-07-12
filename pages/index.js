// @ts-nocheck
import Head from 'next/head'
import Link from 'next/link'
import { getSortedPostsData } from '../lib/posts';
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import Date from '../components/date';

// the home function will be rendered using the props from getStaticProps (i.e. allPostsData) which has the posts data (including title and date)
// in essence we want this page to fetch some data from the the static blog posts on the server (title, date) before rendering so the pre-render must be aware of this 
export default function Home({allPostsData}) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>[Your Self Introduction]</p>
        <p>
          (This is a sample website - you’ll be building a site like this in{' '}
          <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
        </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => ( // these props are from the parsing of the mdx files 
            <li className={utilStyles.listItem} key={id}>
            <Link href={`/posts/${id}`}>
              <a>{title}</a>
            </Link>
            <br />
            <small className={utilStyles.lightText}>
              <Date dateString={date} />
            </small>
          </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}

// if we export the getStaticProps function (like we do here), Next.js will pre-render the page (entire file, including the Home function above) at build time using the props returned by this function 
export async function getStaticProps() { // gets the mdx file's data from the getStaticProps function exported from lib/posts
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData, 
    },
  };
}
// getStaticProps() is run at build time, and gets all of the necessary props at build time, not during each page request, and then stores each page in the cache of the browser. 
// In development, getStaticProps is run on every request. In production, it runs only at build time. So we cannot access data from each request in a build production. (data such as HTTP Requests)