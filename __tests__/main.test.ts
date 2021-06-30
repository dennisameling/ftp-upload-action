import * as path from 'path'
import {File, getFiles} from '../src/util'

test('returns folder contents', async () => {
  const fileArray = ['test1.txt', 'test2.txt']

  for await (const fileObject of getFiles(
    path.join(__dirname, 'testFolder'),
    path.resolve('testFolder')
    // eslint-disable-next-line no-undef
  ) as AsyncIterable<File>) {
    const validFile = fileArray.includes(fileObject.filename)
    await expect(validFile).toEqual(true)
  }
})
