const fs = require('fs')
const Jimp = require("jimp")
delete require.cache[require.resolve("slugify")]
const slugify = require("slugify")
const nodemailer = require("nodemailer")
const generateUnique = require("generate-unique-id")


// Make Slug
const Slug = data => {
    let newSlug = slugify(data, { 
        replacement: '-',  // replace spaces with replacement character, defaults to `-`
        remove: /[`/|*+~.()'"!:@]/g, // remove characters that match regex, defaults to `undefined`
        lower: true,      // convert to lower case, defaults to `false`
        strict: false,     // strip special characters except replacement, defaults to `false`
        locale: 'vi'  
    })
    newSlug = newSlug + '-' + Date.now()
    return newSlug
}

//get Host Url
const Host = req => {
    return req.protocol + '://' + req.get('host') + '/'
}

// Single file upload
const FileUpload = async (data, path) => {
    try {
        const image = data

        const newName = Date.now() + '.jpg'
        uploadPath = path + newName
        const moveFile = image.mv(uploadPath)

        if (moveFile) return newName
    } catch (error) {
        if (error) return error
    }
}

// Resize to 200x200 & upload
const SmFileUpload = async (file, uploadpath) => {
    try {
        // Recived file data
        let image = await Jimp.read(file.data)
        await image.resize(200, 200)
        await image.quality(50)
        const newFile = 'product-' + Date.now() + '.jpg'
        await image.write(uploadpath + '/' + newFile)
        return newFile
    } catch (error) {
        if (error) return error
    }
}

// Resize to 800x800 & upload
const LgFileUpload = async (file, uploadpath) => {
    try {
        // Recived file data
        let image = await Jimp.read(file.data)
        await image.resize(800, 800)
        await image.quality(50)
        const newFile = 'product-' + Date.now() + '.jpg'
        await image.write(uploadpath + '/' + newFile)
        return newFile
    } catch (error) {
        if (error) return error
    }
}

// Delete file from directory
const DeleteFile = (destination, file) => {
    fs.unlink(destination + file, function (error) {
        if (error) {
            return error
        }
        return
    })
}

// Copy file to another directory
const CopyFile = async (from, to) => {
    try {
        await fs.copyFileSync(from, to)
        return true
    } catch (error) {
        if (error) return false
    }
}

// Extract route group name
const RouteGroupName = path => {
    return path.replace(/\//g, " ").split(" ")[1]
}

// Mail send
const SendEmail = async (data) => {
    try {
        // Mail transporter
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'mhmamun166009@gmail.com',
                pass: '1118964208'
            }
        })

        // send mail with defined transport object
        const mailService = await transporter.sendMail({
            from: data.from, // sender address
            to: data.to, // list of receivers
            subject: data.subject, // Subject line
            html: data.body // html body
        })

        if (!mailService) return false

        return true
    } catch (error) {
        if (error) return false
    }
}

// Unique code generate
const UniqueCode = async (length) => {
    try {
        const code = generateUniqueId({ length: length, useLetters: false })
        return code
    } catch (error) {
        return error
    }
}

module.exports = {
    Slug,
    Host,
    FileUpload,
    SmFileUpload,
    LgFileUpload,
    CopyFile,
    DeleteFile,
    RouteGroupName,
    SendEmail,
    UniqueCode
}