import * as core from '@actions/core'
import * as ftp from 'basic-ftp'
import * as path from 'path'
import {File, getFiles} from './util'

async function run(): Promise<void> {
  const server: string = core.getInput('server', {required: true})
  const username: string = core.getInput('username', {required: true})
  const password: string = core.getInput('password', {required: true})
  let port = Number(core.getInput('port'))
  const secureInput: string = core.getInput('secure')
  let localDir: string = core.getInput('local_dir')
  let serverDir: string = core.getInput('server_dir')
  const timeoutMs = 30000
  let secure = true

  const client = new ftp.Client(timeoutMs)

  if (!port) {
    port = 21
  }

  if (secureInput === 'false') {
    secure = false
  }

  if (localDir.length === 0) {
    localDir = './'
  }

  if (serverDir.length === 0) {
    serverDir = './'
  }

  try {
    core.info('Connecting to server...')

    if (core.isDebug()) {
      client.ftp.verbose = true
    }

    await client.access({
      host: server,
      user: username,
      password,
      secure,
      port
    })

    core.info(
      `Successfully connected to server. Starting upload from folder ${localDir}`
    )
  } catch (err) {
    core.setFailed(`Error while connecting to the server: ${err}`)
    return
  }

  try {
    const absRoot = path.resolve(localDir)

    core.debug(`Using this root directory: ${absRoot}`)

    for await (const fileObject of getFiles(
      localDir,
      absRoot
      // eslint-disable-next-line no-undef
    ) as AsyncIterable<File>) {
      const localCurrentDir = fileObject.folder.replace(localDir, '')
      core.info(`Uploading ${localCurrentDir}/${fileObject.filename}...`)
      const serverFolder = `${serverDir}${localCurrentDir}`

      core.debug(JSON.stringify(fileObject))

      await client.ensureDir(serverFolder)
      await client.uploadFrom(fileObject.fullPath, fileObject.filename)

      // Go back to the original folder
      if (fileObject.dirLevel > 0) {
        for (let i = 0; i < fileObject.dirLevel; i++) {
          core.debug('Going one folder up...')
          await client.cdup()
        }
      }
    }

    core.info('All done!')
  } catch (err) {
    core.setFailed(`Error while transferring one or more files: ${err}`)
  }

  client.close()
}

run()
