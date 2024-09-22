import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(__dirname + '/uploads'))
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now()
        const originalname = file.originalname
        const ext = path.extname(originalname)
        cb(null, `${timestamp}-${originalname}`)
    }
})

export const upload = multer({ storage });

export default __dirname