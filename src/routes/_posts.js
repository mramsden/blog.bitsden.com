import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'
import { Converter } from 'showdown'

const markdown = new Converter()

const postsDir = path.join(__dirname, '..', '..', '..', 'content', 'posts')

const fromDir = async (startPath, filter) => {
  let paths = []
  const stat = await fs.promises.stat(startPath)
  if (!stat.isDirectory()) {
    throw new Error(`${startPath} is not a directory`)
  }

  const files = await fs.promises.readdir(startPath)
  for (let i = 0; i < files.length; i++) {
    const filename = path.join(startPath, files[i])
    const stat = await fs.promises.stat(filename)
    if (stat.isDirectory()) {
      paths = [...paths, ...(await fromDir(filename, filter))]
    } else if (filename.includes(filter)) {
      paths.push(filename)
    }
  }
  return paths
}

async function loadPosts(paths) {
  const posts = []
  for (const path of paths) {
    const { data, content } = matter(await fs.promises.readFile(path))
    posts.push({
      title: data.title,
      slug: path
        .replace(`${postsDir}/`, '')
        .replace(/(\/index)?\.md$/, ''),
      html: markdown.makeHtml(content)
    })
  }
  return posts
}

const posts = new Promise(async (resolve, reject) => {
  try {
    const paths = await fromDir(postsDir, '.md')
    resolve(await loadPosts(paths.sort((a, b) => a < b)))
  } catch (e) {
    reject(e)
  }
})

export default posts

export const postsLookup = new Promise(async resolve => {
  const lookup = new Map()
  for (const post of await posts) {
    lookup.set(post.slug, JSON.stringify(post))
  }
  resolve(lookup)
})
