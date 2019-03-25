import dataUrl from 'data-urls'
import Jimp from 'jimp'
import fileType from 'file-type'
import mkdirp from 'mkdirp'
import fs from 'fs'

interface Image {
  name: string,
  mime: string,
  orderNo: number,
  path: string,
  size: number,
  body: any,
  data: any
}

const checkFileType = {
  image: (parsedFile: any) => {
    const acceptedTypes: string[] = [
      'image/jpeg',
      'image/gif',
      'image/webp',
      'image/png'
    ]
    return acceptedTypes.includes(fileType(parsedFile.body).mime)
  }
}

export const parse = {
  images: (imageArr: any[], maxWidth: number) => {
    const parsedImages = imageArr.reduce((acc: any[], image: any) => {
      if (image._id) {
        acc.push(image)
        return acc
      }
      const parsedImage = dataUrl(image.data)
      if (!checkFileType.image(parsedImage)) return acc
      const imageType = fileType(parsedImage.body)
      parsedImage.name = parse.fileName(image.name, imageType.ext)
      parsedImage.mime = imageType.mime
      acc.push(parsedImage)
      return acc
    }, [])

    return parse.processImages(parsedImages, maxWidth)
  },
  fileArrSize (fileArr: Image[]): number {
    return fileArr.reduce((acc: number, file: Image) => acc + file.size, 0)
  },
  fileName: (fileName: string, ext: string, len = 5) => {
    let newFileName = fileName.replace('.' + ext, '').replace(/[^a-z0-9]|\s+|\r?\n|\r/gmi, '')
    newFileName = String(newFileName).length >= len ? newFileName.substr(0, 5) : Math.random().toString(36).substring(len)
    return newFileName.toLowerCase() + (new Date().getTime()) + '.' + ext
  },
  processImages: async (parsedImages: Image[], maxWidth: number) => {
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
    images.compressable = await process.compressableImages(images.saveDir, images.compressable, maxWidth)
    return {
      saveDir: images.saveDir,
      files: images.compressable.concat(images.inCompressable).sort((img1, img2) => img1.orderNo - img2.orderNo)
    }
  }
}

const process = {
  compressableImages: async (imageDir: string, imageArr: Image[], maxWidth: number) => {
    const jimpImages = await Promise.all(imageArr.map((image: any) => {
      return image.body ? Jimp.read(image.body) : image
    }))
    return Promise.all(jimpImages.map(async (image, imageIndex) => {
      const newImage: any = {
        name: imageArr[imageIndex].name,
        mime: imageArr[imageIndex].mime,
        orderNo: imageArr[imageIndex].orderNo,
        path: image.path || imageDir,
        size: image.size
      }
      if (image._id) return newImage
      newImage.data = image.bitmap.width >= maxWidth ? (await image.resize(maxWidth, Jimp.AUTO).quality(80)) : (await image.quality(80))
      newImage.size = (await image.getBufferAsync(Jimp.AUTO)).byteLength
      return newImage
    }))
  },
  inCompressableImages: (imageDir: string, imageArr: Image[]) => {
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
  images: async (saveDir: string, imageArr: Image[]) => {
    try {
      if (!fs.existsSync(saveDir)) await mkdirp.sync(saveDir)

      return Promise.all(imageArr.map((image: Image): any => {
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

export const deleteFile = (filePath: string) => {
  if (!fs.existsSync(filePath)) return
  return fs.unlinkSync(filePath)
}
