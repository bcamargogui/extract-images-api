const Crawler = require("crawler");
const https = require("https");
const fs = require("fs");

const saveImageToDisk = async (url, localPath = "images/") => {
  const fileName = url.split("/").pop()
  const fullPath = `${localPath}/${fileName}`
  const file = fs.createWriteStream(fullPath);
  await https.get(url, response => response.pipe(file));
  return fullPath;
}

const downloadAndSaveImages = (link) => new Promise((resolve, reject) => {
  const c = new Crawler({
    maxConnections: 10,
    // This will be called for each crawled page
    callback: async function (error, res, done) {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        const images = res.$("img");
        const savedImages = [];
        for (let index = 0; index < images.length; index++) {
          const { src } = images[index].attribs;
         // Saving locally image
         const remoteImgLocation = `${link}/${src}`;
         await saveImageToDisk(remoteImgLocation);
         const imageName = remoteImgLocation.split('/').pop();
         const localImageLocation = `/images/${imageName}`;
         savedImages.push({ imgLocation: localImageLocation, parentPage: link }); 
        }
        resolve(savedImages);
      }
      done();
    }
  });

  // Queue just one URL, with default callback
  c.queue(link);
});

module.exports = downloadAndSaveImages;