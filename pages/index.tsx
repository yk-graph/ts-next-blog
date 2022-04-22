import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";

import { getSortedPostsData } from "../lib/posts";
import { getPostTitlesFromGithub } from "../lib/fetchGithubRepo";

import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import Date from "../components/date";

type Props = {
  allPostsData: {
    id: string;
    title: string;
    date: string;
  }[];
  allPostTitlesFromGithub: {
    title: string;
  }[];
};

export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = getSortedPostsData();
  const allPostTitlesFromGithub = await getPostTitlesFromGithub();
  return {
    props: {
      allPostsData,
      allPostTitlesFromGithub,
    },
  };
};

export default function Home({ allPostsData, allPostTitlesFromGithub }: Props) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
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
      <section>
        <h2 className={utilStyles.headingLg}>Blog from github repos</h2>
        <ul className={utilStyles.list}>
          {allPostTitlesFromGithub.map(({ title }) => (
            <li className={utilStyles.listItem} key={title}>
              <Link href={`/pithub-posts/${title}`}>
                <a>{title}</a>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}
