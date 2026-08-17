const crypto = require('node:crypto')
const path = require('node:path')
const mongoose = require('mongoose')

let imageBucket = null

function getImageBucket() {
  if (mongoose.connection.readyState !== 1) {
    const error = new Error('MongoDB no está conectado.')
    error.statusCode = 503
    throw error
  }

  if (!imageBucket) {
    imageBucket = new mongoose.mongo.GridFSBucket(
      mongoose.connection.db,
      { bucketName: 'productImages' },
    )
  }

  return imageBucket
}

function buildStoredFilename(file) {
  const extension = path.extname(file.originalname).toLowerCase()
  return `${crypto.randomUUID()}${extension}`
}

function storeImage(file) {
  return new Promise((resolve, reject) => {
    const filename = buildStoredFilename(file)
    const uploadStream = getImageBucket().openUploadStream(filename, {
      contentType: file.mimetype,
      metadata: {
        originalName: file.originalname,
      },
    })

    uploadStream.on('error', reject)
    uploadStream.on('finish', () => {
      resolve({
        fileId: uploadStream.id,
        filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
      })
    })

    uploadStream.end(file.buffer)
  })
}

async function storeImages(files = []) {
  return Promise.all(files.map(storeImage))
}

async function deleteImage(fileId) {
  if (!mongoose.isObjectIdOrHexString(fileId)) {
    return
  }

  try {
    await getImageBucket().delete(new mongoose.Types.ObjectId(fileId))
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error
    }
  }
}

async function deleteImages(fileIds = []) {
  await Promise.all(fileIds.map(deleteImage))
}

function openImageDownloadStream(fileId) {
  return getImageBucket().openDownloadStream(
    new mongoose.Types.ObjectId(fileId),
  )
}

module.exports = {
  deleteImages,
  openImageDownloadStream,
  storeImages,
}
