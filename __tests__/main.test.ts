import * as path from 'path'
import {File, getFiles} from '../src/util'

test('returns folder contents', async () => {
  const fileArray = ['test1.txt', 'test2.txt']

  for await (const fileObject of getFiles(
    path.join(__dirname, '..', 'dummydata', 'testFolder'),
    path.resolve(__dirname, '..', 'dummydata', 'testFolder')
  ) as AsyncIterable<File>) {
    expect(fileArray).toContain(fileObject.filename)
  }
})

test('returns folder contents recursively', async () => {
  const fileArray = [
    '/test.txt',
    'sub1/test.txt',
    'sub1/subsub1/test.txt',
    'sub2/test.txt'
  ]

  for await (const fileObject of getFiles(
    path.join(__dirname, '..', 'dummydata', 'testFolderRecursive'),
    path.resolve(__dirname, '..', 'dummydata', 'testFolderRecursive')
  ) as AsyncIterable<File>) {
    expect(fileArray).toContain(`${fileObject.folder}/${fileObject.filename}`)
  }
})
