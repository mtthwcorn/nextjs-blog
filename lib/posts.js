import fs from "fs";
import path from "path";
import matter from "gray-matter"; // used for interpreting YAML (the text at the beginning of mdx files)
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "posts");

export function getSortedPostsData() {
  // getting the post data from the mdx files and returning the data for each mdx file / blog posts to the file calling this function (index.js)
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory); // read in each file from the posts directory
  const allPostsData = fileNames.map((fileName) => {
    // read through each file and store below information in object allPostsData
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, ""); // create an id based off the file name

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id, // return the id, then the matterResult data which will have the title, date, and data of the mdx file
      ...matterResult.data,
    };
  });
  // Sort posts by date
  return allPostsData.sort(({ date: a }, { date: b }) => {
    //
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    } else {
      return 0;
    }
  });
}

// used for the getStaticPaths - i.e. getting the ID of the dynamic pages
export function getAllPostIds() {
  // will return the list of all file names excluding the .md in the posts directory
  const fileNames = fs.readdirSync(postsDirectory);

  // Returns an array that looks like this:
  // [
  //   {
  //     params: {
  //       id: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'pre-rendering'
  //     }
  //   }
  // ]
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
}

// used for getStaticProps - i.e. getting the content of the dynamic pages based on ID
export async function getPostData(id) {
  // will return the post data based on the id
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}
