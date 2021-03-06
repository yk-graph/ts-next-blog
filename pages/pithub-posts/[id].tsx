import { GetStaticProps, GetStaticPaths } from "next";
import Head from "next/head";
import Layout from "../../components/layout";

import {
  getAllPostIdsFromGithub,
  getPostDataFromGithub,
} from "../../lib/fetchGithubRepo";

import Date from "../../components/date";
import utilStyles from "../../styles/utils.module.css";

type Props = {
  postData: {
    title: string;
    date: string;
    contentHtml: string;
  };
};

export default function GithubPost({ postData }: Props) {
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

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await getAllPostIdsFromGithub();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postData = await getPostDataFromGithub(params.id);
  return {
    props: {
      postData,
    },
  };
};
