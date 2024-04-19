let Client  = require(`@veryfi/veryfi-sdk`);

// # get your keys here: https://hub.veryfi.com/api/
const client_id = 'your_client_id';
const client_secret = 'your_client_secret';
const username = 'your_username';
const api_key = 'your_password';

let my_client = Client(client_id, client_secret, username, api_key);

let file_path = `./Moaserat.pdf`;
let response = async() => await my_client.process_document(file_path);
response().then(console.log);