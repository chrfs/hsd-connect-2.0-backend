import parseDataURL from 'data-urls'
import Jimp from 'jimp'
import fileType from 'file-type'
import mkdirp from 'mkdirp'
import fs from 'fs'
import Image from '../models/Image'

const checkFileType = {
  image: (parsedFile) => {
    const acceptedTypes = [
      'image/jpeg',
      'image/gif',
      'image/webp',
      'image/png'
    ]
    return acceptedTypes.includes(parsedFile.mimeType.toString())
  }
}

export const parse = {
  images: (imageArr) => {
    return imageArr.reduce((acc, image) => {
      const parsedFile = parseDataURL(image.data)
      if (!checkFileType.image(parsedFile)) return acc
      parsedFile.id = image.id
      acc.push(parsedFile)
      return acc
    }, [])
  },
  compressableImages: (parsedFile) => {
    const compressableTypes = [
      'image/jpeg',
      'image/png'
    ]
    const result = {
      compressable: [],
      notCompressable: []
    }
    return parsedFile.reduce((acc, image) => {
      const isCompressable = compressableTypes.includes(image.mimeType.toString())
      if (isCompressable) acc.compressable.push(image)
      else acc.notCompressable.push(image)
      return acc
    }, result)
  }
}

export const compress = {
  images: async (imageArr) => {
    const images = await Promise.all(imageArr.map((image) => (Jimp.read(image.body))))
    return images.map((image) => {
      if (image.bitmap.width <= 1000) {
        return image
      }
      return image.resize(600, Jimp.AUTO)
    })
  }
}

const getImageDir = () => {
  const newDate = new Date()
  const month = (newDate).getMonth() + 1
  const day = (newDate).getDate()
  const year = (newDate).getFullYear()
  return './media/images/' + year + '/' + month + '/' + day + '/'
}

export const save = {
  images: async (imagesArr) => {
    try {
      const imageDir = getImageDir()
      if (!fs.existsSync(imageDir)) {
        await mkdirp.sync(imageDir)
      }
      const imageBufferArr = parse.images(imagesArr)
      const images = parse.compressableImages(imageBufferArr)
      const compressedImages = await compress.images(images.compressable)

      const imagesPathArr = []
      await Promise.all(compressedImages.map((image, index) => {
        const imagePath = imageDir + imageBufferArr[index].id + '.' + image.getExtension()
        imagesPathArr.push(imagePath)
        return image.writeAsync(imagePath)
      }))

      await Promise.all(images.notCompressable.map((image) => {
        const imagePath = imageDir + image.id + '.' + fileType(image.body).ext
        imagesPathArr.push(imagePath)
        return fs.writeFileSync(imagePath, image.body)
      }))

      return await Promise.all(imagesPathArr.map(async (imgPath) => {
        const newImage = await (new Image({ path: imgPath })).save()
        return newImage._id
      }))
    } catch (err) {
      throw err
    }
  }
}
