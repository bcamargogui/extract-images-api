const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Utils
const downloadImages = require('./src/utils/download-images');
const mongoDb = require('./src/utils/mongodb');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/images/:imageaddr', (req, res) => {
  const { imageaddr } = req.params;
  res.sendFile(__dirname + '/images/' + imageaddr);
});

io.on('connection', async (socket) => {
  console.log('a user connected');  

  socket.on('new link', async (link = false) => {
    if (!link) return;
    
    const savedImages = await downloadImages(link);

    for (const savedImage of savedImages) {
      const { imgLocation, parentPage } = savedImage;
      mongoDb.insertOne(imgLocation, parentPage);
      io.emit('new image', savedImage);
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  const allRecords = await mongoDb.fetchAll();
  io.emit('fill images', allRecords);
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});