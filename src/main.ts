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
      port,
      secureOptions: {
        maxVersion: 'TLSv1.2'
      }
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
      await retryRequest(
        async () =>
          await client.uploadFrom(fileObject.fullPath, fileObject.filename)
      )

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

  core.info('Closing connection...')
  client.close()
}

/**
 * retry a request
 *
 * @example retryRequest(async () => await item());
 */
async function retryRequest<T>(callback: () => Promise<T>): Promise<T> {
  try {
    return await callback()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (e.code >= 400 && e.code <= 499) {
      core.info(
        '400 level error from server when performing action - retrying...'
      )
      core.info(e)

      if (e.code === 426) {
        core.info(
          'Connection closed. This library does not currently handle reconnects'
        )
        throw e
      }

      return await callback()
    } else {
      throw e
    }
  }
}

run()
