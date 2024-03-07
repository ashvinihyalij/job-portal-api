import fs from 'fs';
import morgan from 'morgan';
import path from 'path';
import rfs from 'rotating-file-stream';
import { fileURLToPath } from 'url'; // Node.js 12.0.0 or later

const setupMorgan = (app) => {
    //const logDirectory = path.join(__dirname, '../../logs');  
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const logDirectory = path.join(__dirname, '../../logs');
    fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

    fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
  
    const accessLogStream = rfs.createStream("access.log", {
      interval: '1d',
      path: logDirectory
    });
    
    app.use(morgan('combined', {stream: accessLogStream}))

    
}
export default setupMorgan;