const http = require('http');
const data = JSON.stringify({email:'ko.min@personal.com',password:'password123'});
const req = http.request({
  hostname: '192.168.100.101',
  port: 3000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, res => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body);
  });
});
req.write(data);
req.end();
