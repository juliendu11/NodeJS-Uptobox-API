const axios = require('axios')
const fs  =require('fs')
const FormData = require('form-data');
const path =require('path')

const baseUri = 'https://uptobox.com';


/**
 * @param {string} apiToken API Token (API key)
 * @returns {string} Return upload url
 */
async function getUploadLink(apiToken){
    try {
        const getUploadLink = await axios({
            method: 'get',
            url: `${baseUri}/api/upload?token=${apiToken}`
          });
          if (getUploadLink.status >= 200 && getUploadLink.status < 300 && getUploadLink.data.statusCode == 0) {
              return getUploadLink.data.data.uploadLink;
          }
          else{
              throw Error(`Bad status code: ${getUploadLink.status}, message: ${getUploadLink.data.data.message ? getUploadLink.data.data.message: ''}`)
          }
    } catch (error) {
        throw Error(error)
    }
}

/**
 * @typedef {Object} Result
 * @property {string} name - File name
 * @property {string} size - File size
 * @property {string} url - Download url
 * @property {string} deleteUrl - Delete url
 */

/**
 * @param {string} apiToken API Token (API key)
 * @param {string} filePath File path for upload
 * @returns {Result} {
 *          name,
 *          size,
 *          url,
 *          deleteUrl
 * }
 */
async function uploadOneFile(apiToken, filePath){
    try {
        const getLink = await getUploadLink(apiToken)
        const filename = path.basename(filePath)

        try {
            return await uploadFile(getLink,filePath, filename)
        } catch (error) {
            throw new Error(error)
        }
    } catch (error) {
        throw new Error(error)
    }
}


/**
 * @param {string} apiToken API Token (API key)
 * @param {string[]} filesPath File path for upload
 * @returns {Result[]} {
 *          name,
 *          size,
 *          url,
 *          deleteUrl
 * }
 */
async function uploadMutlipleFiles(apiToken, filesPath){
  let result = []

    try {
        if (filesPath.length ==0){
            throw new Error('No files path in array')
        }
        const getLink = await getUploadLink(apiToken)

        for (const file of filesPath){
            const filename = path.basename(file)
            try {
                const uploadFiles = await uploadFile(getLink,file, filename)
                result.push(uploadFiles)
            } catch (error) {
                throw new Error(error)
            }
        }

        return result;

    } catch (error) {
        throw new Error(error)
    }
}

/**
 * @param {string} uploadLink
 * @param {BinaryType} filePath file path
 * @param {string} fileName File name
 * @returns {Result} {
 *          name,
 *          size,
 *          url,
 *          deleteUrl
 * }
 */
async function uploadFile(uploadLink,filePath, fileName){
    let formData = new FormData();
    formData.append('files[]', fs.createReadStream(filePath), {filename: fileName});
    const upload = await axios({
        method: 'POST',
        url: 'https:' +uploadLink,
        data:formData,
        headers: { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36',
                    'content-type': formData.getHeaders()['content-type'] },
    });
    if(upload.status >= 200 && upload.status < 300){
        return upload.data.files[0]
     }
     else{
         throw new Error(upload.data)
     }
}

module.exports = {
    uploadOneFile,
    uploadMutlipleFiles
}
