# express-js

This Rest API are developed for education purpose from Telkom Digital Challenge.

**Rest API Hackernews** 
 
Tools yang digunakan :
- CMD
- Visual Studio
- Postman
- Github Desktop

Cara Install Dependencies :
- Download Node.js

Cara Menjalankan Aplikasi : 
- Masuk ke folder aplikasi
- Buka cmd dari folder
- Ketik "npm run start"
- Akses Rest API menggunakan aplikasi Postman

**Akses REST API**

*API Repository :*
- Refresh data story terbaru :
http://localhost:8000/repository/getstory
- Refresh data story detail terbaru berdasarkan id story dari database SQLite
http://localhost:8000/repository/getstorydetail

*API Business Logic :*
- Menampilkan API TOP Story dari database SQLite
http://localhost:8000/api/story
- Menampilkan API Story berdasarkan id dari database SQLite
http://localhost:8000/api/story/{$id}
- Menandai satu Story sebagai favorite
http://localhost:8000/api/story/{$id}/addfav
- Menampilkan seluruh id Story yang ditandai sebagai favorite
http://localhost:8000/api/showfav

**Framework**
- [Express.js](https://expressjs.com/)

**Library used**
- [got](https://github.com/sindresorhus/got)
- [body-parser](https://www.npmjs.com/package/body-parser)
- [sqlite3](https://www.npmjs.com/package/sqlite3)