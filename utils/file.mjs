import parseDataURL from 'data-urls'
import Jimp from 'jimp'
import fileType from 'file-type'
import mkdirp from 'mkdirp'
import fs from 'fs'

const checkFileType = {
  image: (parsedFile) => {
    const acceptedTypes = [
      'image/jpeg',
      'image/gif',
      'image/webp',
      'image/png'
    ]
    return acceptedTypes.includes(fileType(parsedFile.body).mime)
  }
}

export const parse = {
  images: (imageArr) => {
    const parsedImages = imageArr.reduce((acc, image) => {
      if (image._id) {
        acc.push(image)
        return acc
      }
      const parsedImage = parseDataURL(image.data)
      if (!checkFileType.image(parsedImage)) return acc
      const imageType = fileType(parsedImage.body)
      parsedImage.name = parse.fileName(image.name, imageType.ext)
      parsedImage.mime = imageType.mime
      acc.push(parsedImage)
      return acc
    }, [])

    return parse.processImages(parsedImages)
  },
  fileArrSize (fileArr) {
    return fileArr.reduce((acc, file) => acc + file.size, 0)
  },
  fileName: (fileName, ext, len = 6) => {
    let newFileName = fileName.replace('.' + ext, '').replace(/[^a-z0-9]|\s+|\r?\n|\r/gmi, '')
    newFileName = String(newFileName).length >= len ? newFileName.substr(0, 5) : Math.random().toString(36).substring(len)
    return newFileName.toLowerCase() + (new Date().getTime()) + '.' + ext
  },
  processImages: async (parsedImages) => {
    const compressableTypes = [
      'image/jpeg',
      'image/png'
    ]
    const images = parsedImages.reduce((acc, image, index) => {
      image.orderNo = index
      const isCompressable = compressableTypes.includes(image.mime)
      if (isCompressable) acc.compressable.push(image)
      else acc.inCompressable.push(image)
      return acc
    }, {
      saveDir: getFileDir(),
      compressable: [],
      inCompressable: []
    })
    images.inCompressable = process.inCompressableImages(images.saveDir, images.inCompressable)
    images.compressable = await process.compressableImages(images.saveDir, images.compressable)
    return {
      saveDir: images.saveDir,
      files: images.compressable.concat(images.inCompressable).sort((img1, img2) => img1.orderNo - img2.orderNo)
    }
  }
}

const process = {
  compressableImages: async (imageDir, imageArr) => {
    const jimpImages = await Promise.all(imageArr.map((image) => {
      return image.body ? Jimp.read(image.body) : image
    }))
    return Promise.all(jimpImages.map(async (image, imageIndex) => {
      const newImage = {
        name: imageArr[imageIndex].name,
        mime: imageArr[imageIndex].mime,
        orderNo: imageArr[imageIndex].orderNo,
        path: image.path || imageDir,
        size: image.size
      }
      if (image._id) return newImage
      newImage.data = image.bitmap.width >= 600 ? (await image.resize(600, Jimp.AUTO).quality(80)) : (await image.quality(80))
      newImage.size = (await image.getBufferAsync(Jimp.AUTO)).byteLength
      return newImage
    }))
  },
  inCompressableImages: (imageDir, imageArr) => {
    return imageArr.map((image) => {
      return {
        name: image.name,
        size: image.size || image.body.length,
        mime: image.mime,
        orderNo: image.orderNo,
        path: image.path || imageDir,
        data: image.body
      }
    })
  }
}

const getFileDir = () => {
  const newDate = new Date()
  const month = (newDate).getMonth() + 1
  const day = (newDate).getDate()
  const year = (newDate).getFullYear()
  return './media/images/' + year + '/' + month + '/' + day + '/'
}

export const saveFiles = {
  images: async (saveDir, images) => {
    try {
      if (!fs.existsSync(saveDir)) await mkdirp.sync(saveDir)

      return Promise.all(images.map(image => {
        const imagePath = image.path + image.name
        if (!fs.existsSync(imagePath)) {
          return image.data instanceof Jimp ? image.data.writeAsync(imagePath) : fs.writeFileSync(imagePath, image.data)
        }
      }))
    } catch (err) {
      throw err
    }
  }
}

export const deleteFile = (filePath) => {
  if (!fs.existsSync(filePath)) return
  return fs.unlinkSync(filePath)
}
