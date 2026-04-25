import https from 'https';

const forms = [
  { name: 'Girişler', id: '261134527667966', key: 'b119f8e8fd7fe6fbdb3aa032cef23299' },
  { name: 'Mesajlar', id: '261133651963962', key: 'd129baeb6efa832415911485ef5d6dc1' },
  { name: 'Görüşler', id: '261133720555956', key: '5bea83dbf561ba3190f27373831ac2a7' },
  { name: 'Kişisel Notlar', id: '261134449238963', key: 'c3beedaed8344260d609b35b6437c604' },
  { name: 'Anonim İpuçları', id: '261134430330946', key: '6de24ff899b00a30e23431f89aee9e9d' }
];

function fetchForm(form) {
  return new Promise((resolve, reject) => {
    https.get(`https://api.jotform.com/form/${form.id}/submissions?apiKey=${form.key}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ name: form.name, data: parsed });
        } catch(e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  for (const form of forms) {
    try {
      const res = await fetchForm(form);
      console.log(`\n=== ${form.name} ===`);
      if (res.data.content && res.data.content.length > 0) {
        // Sadece ilk submission'ın answers objesini yazdıralım ki yapıyı görelim
        const sample = res.data.content[0].answers;
        for (const key in sample) {
           console.log(`${key}: ${sample[key].name} = ${sample[key].answer || sample[key].prettyFormat || 'BOŞ'}`);
        }
      } else {
        console.log('No submissions found or error:', res.data.message || res.data);
      }
    } catch (err) {
      console.error('Error fetching', form.name, err.message);
    }
  }
}

main();
