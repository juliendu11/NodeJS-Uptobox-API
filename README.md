# Node JS uptobox API

Upload file with node JS

## Install

```bash
npm i @juliendu11/uptoboxapi
```


# How to use ?

### Only one file

````javascript
  const uptoboxAPI = require('@juliendu11/uptoboxapi');
  (async () => {
    let value = await uptoboxAPI.uploadOneFile('{TOKEN}','{FILE}')
     console.log(value)
//{
//   name: 'filename',
//   size: filesize,
//   url: 'https://uptobox.com/rieo9f88dudx',
//   deleteUrl: 'https://uptobox.com/rieo9f88dudx?killcode=6gep5zig3g'
// }
})();
````

### Multiple files in same times

````javascript
  const uptoboxAPI = require('@juliendu11/uptoboxapi');
  (async () => {
     const filesPath =[
        './package.json',
        './package-lock.json'
    ]
    let value = await uptoboxAPI.uploadMutlipleFiles('{TOKEN}',filesPath)
    console.log(value)
})();
````

## Dependencies

- [form-data](https://www.npmjs.com/package/form-data)
- [axios](https://www.npmjs.com/package/axios)
