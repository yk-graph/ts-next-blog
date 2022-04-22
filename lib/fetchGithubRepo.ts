import fetch from "node-fetch";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
const base64 = require("js-base64").Base64;

type ContentsType = {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  _links: {
    self: string;
    git: string;
    html: string;
  };
};

export const getPostTitlesFromGithub = async () => {
  const repoUrl =
    "https://api.github.com/repos/yk-graph/ts-next-blog/contents/posts";
  const response = await fetch(repoUrl);
  const files = (await response.json()) as ContentsType[];

  return files.map((file) => {
    const title = file.name.replace(/\.md$/, "");
    return {
      title,
    };
  });
};

export const getAllPostIdsFromGithub = async () => {
  const repoUrl =
    "https://api.github.com/repos/yk-graph/ts-next-blog/contents/posts";
  const response = await fetch(repoUrl);
  const files = (await response.json()) as ContentsType[];
  const fileNames = files.map((file) => file.name);
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
};

export const getPostDataFromGithub = async (id) => {
  const repoUrl = `https://api.github.com/repos/yk-graph/ts-next-blog/contents/posts/${id}.md`;
  const response = await fetch(repoUrl);
  const file = (await response.json()) as ContentsType & {
    content: string;
    encoding: "base64";
  };
  const fileContents = base64.decode(file.content);
  const matterResult = matter(fileContents);
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();
  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
};
