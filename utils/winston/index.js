import { createLogger, transports, format } from 'winston';
import fs from 'fs';
import 'winston-daily-rotate-file';
import path from 'path';
import { fileURLToPath } from 'url'; // Node.js 12.0.0 or later
const env = process.env.DEV_MODE || 'development';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDirectory = path.join(__dirname, '../../logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const transport = new transports.DailyRotateFile({
    filename: `${logDirectory}/%DATE%-errors.log`,
    datePattern: 'YYYY-MM-DD',
    exitOnError: false,
    level: 'verbose',
    maxSize: '20m',
    format: format.combine(format.timestamp(), format.json())
});

export default createLogger({
    transports: [
        new transports.Console({
            colorize: true,
            level: env === 'development' || 'test' ? 'verbose' : 'info',
            exitOnError: false,
            handleExceptions: !(env === 'development' || 'test'),
            format: format.combine(format.timestamp(), format.simple())
        }),
        transport
    ]
});
