import { Injectable } from '@nestjs/common'
import archiver, { type Archiver } from 'archiver'
import type { Response } from 'express'

@Injectable()
export class ZipBuilderService {
  createArchive(response: Response) {
    const archive = archiver('zip', { zlib: { level: 9 } })
    archive.pipe(response)
    return archive
  }

  appendBuffer(archive: Archiver, buffer: Buffer, name: string) {
    archive.append(buffer, { name })
  }

  async finalize(archive: Archiver) {
    await archive.finalize()
  }
}
