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
        let getUploadLink = await axios({
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
async function uploadFile(apiToken, filePath){
    try {
        let getLink = await getUploadLink(apiToken)
        let filename = path.basename(filePath)

        let formData = new FormData();
        formData.append('files[]', fs.createReadStream(filePath), {filename: filename});

        let uploadFile = await axios({
            method: 'POST',
            url: 'https:' +getLink,
            data:formData,
            headers: { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36',
                        'content-type': formData.getHeaders()['content-type'] },
          });
    
        if(uploadFile.status >= 200 && uploadFile.status < 300){
           return uploadFile.data.files[0]
        }
        else{
            throw Error(uploadFile.data)
        }
    } catch (error) {
        throw Error(error)
    }
}


module.exports = {
    uploadFile
}
