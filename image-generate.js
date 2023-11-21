const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Pixabay APIキーを設定
const PIXABAY_API_KEY = 'API Key';

// 犬の画像を検索するためのパラメータ
const searchQuery = 'dog';
const imageType = 'photo';
const perPage = 30;

// Pixabay APIから画像を取得する関数
async function getDogImages(apiKey, query, type, page) {
  const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=${type}&per_page=${page}`;
  const response = await axios.get(apiUrl);
  return response.data.hits;
}

// 画像をダウンロードする関数
async function downloadImages(images, outputFolder) {
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
  }

  for (let i = 0; i < images.length; i++) {
    const imageUrl = images[i].webformatURL;
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imagePath = path.join(outputFolder, `dog_${i + 1}.jpg`);
    fs.writeFileSync(imagePath, imageResponse.data);
  }
}

// Pixabay APIから犬の画像を取得
getDogImages(PIXABAY_API_KEY, searchQuery, imageType, perPage)
  .then((dogImages) => {
    // 画像をダウンロード
    const outputFolder = 'dog_images2';
    downloadImages(dogImages, outputFolder);
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });
