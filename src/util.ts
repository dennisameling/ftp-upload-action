import {relative, resolve} from 'path'
import {readdirSync} from 'fs'

export interface File {
  folder: string
  filename: string
  fullPath: string
  dirLevel: number
}

/**
 * Gets files in the given directory.
 *
 * @param dir The directory to get files from.
 * @param absRoot The absolute root directory (so we can return relative paths)
 * @param dirLevel Directory level. Root = 0, subdirectory = 1, etc.
 */
export async function* getFiles(
  dir: string,
  absRoot: string,
  dirLevel = 0
  // eslint-disable-next-line no-undef
): File | AsyncIterable<File> {
  const dirents = readdirSync(dir, {withFileTypes: true})
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name)
    if (dirent.isDirectory()) {
      yield* getFiles(res, absRoot, dirLevel + 1)
    } else {
      yield {
        folder: relative(absRoot, dir),
        filename: dirent.name,
        fullPath: res,
        dirLevel
      }
    }
  }
}
