import { Injectable } from '@nestjs/common'
import archiver, { type Archiver } from 'archiver'
import { PassThrough } from 'node:stream'

interface BufferArchive {
  archive: Archiver
  completed: Promise<Buffer>
}

@Injectable()
export class ZipBuilderService {
  createArchive(): BufferArchive {
    const archive = archiver('zip', { zlib: { level: 9 } })
    const stream = new PassThrough()
    const chunks: Buffer[] = []

    const completed = new Promise<Buffer>((resolve, reject) => {
      stream.on('data', (chunk: Buffer) => chunks.push(Buffer.from(chunk)))
      stream.once('end', () => resolve(Buffer.concat(chunks)))
      stream.once('error', reject)
      archive.once('error', reject)
    })

    archive.pipe(stream)

    return { archive, completed }
  }

  appendBuffer(archive: Archiver, buffer: Buffer, name: string) {
    archive.append(buffer, { name })
  }

  async finalize(archive: Archiver, completed: Promise<Buffer>) {
    await archive.finalize()
    return completed
  }
}
