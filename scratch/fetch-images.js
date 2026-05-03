const https = require('https');

const searchGoogleBooks = (query) => {
  return new Promise((resolve) => {
    const url = 'https://www.googleapis.com/books/v1/volumes?q=' + encodeURIComponent(query);
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.items && json.items.length > 0) {
            for (let item of json.items) {
              if (item.volumeInfo && item.volumeInfo.imageLinks && item.volumeInfo.imageLinks.thumbnail) {
                // Return larger image if possible by replacing zoom level
                resolve(item.volumeInfo.imageLinks.thumbnail.replace('zoom=1', 'zoom=0').replace('http:', 'https:'));
                return;
              }
            }
          }
          resolve('NOT_FOUND');
        } catch (e) {
          resolve('ERROR');
        }
      });
    }).on('error', () => resolve('ERROR'));
  });
};

(async () => {
  const img1 = await searchGoogleBooks('intitle:Öteki inauthor:Dostoyevski');
  console.log('Oteki:', img1);

  const img2 = await searchGoogleBooks('intitle:Dorian Gray inauthor:Wilde Koridor');
  console.log('Dorian:', img2);

  const img3 = await searchGoogleBooks('intitle:Kumarbaz inauthor:Dostoyevski');
  console.log('Kumarbaz:', img3);
})();
