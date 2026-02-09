const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const app = express()

// Configure multer for file uploads with error handling
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const staticPath = path.join(__dirname, '../static/')
    console.log('Multer destination path:', staticPath);
    
    // Ensure directory exists
    try {
      if (!fs.existsSync(staticPath)) {
        fs.mkdirSync(staticPath, { recursive: true })
        console.log('Created static directory:', staticPath);
      }
      cb(null, staticPath)
    } catch (err) {
      console.error('Error creating directory:', err);
      cb(err, staticPath)
    }
  },
  filename: function (req, file, cb) {
    console.log('Processing file:', file.originalname);
    // Use original filename - clean it up
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, cleanName)
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept images and common file types
    console.log('File filter checking:', file.mimetype);
    cb(null, true);
  }
})

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

async function start () {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Portal data API endpoints
  const dataPath = path.join(__dirname, '../static/portal-data.json')
  
  // GET all portal data
  app.get('/api/portal-data', (req, res) => {
    try {
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
      res.json(data)
    } catch (error) {
      res.status(500).json({ error: 'Failed to read portal data' })
    }
  })
  
  // GET systems
  app.get('/api/systems', (req, res) => {
    try {
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
      res.json(data.systems)
    } catch (error) {
      res.status(500).json({ error: 'Failed to read systems data' })
    }
  })
  
  // GET desktop apps
  app.get('/api/desktop', (req, res) => {
    try {
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
      res.json(data.desktop)
    } catch (error) {
      res.status(500).json({ error: 'Failed to read desktop data' })
    }
  })
  
  // GET quick services
  app.get('/api/quick-services', (req, res) => {
    try {
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
      res.json(data.quickServices)
    } catch (error) {
      res.status(500).json({ error: 'Failed to read quick services data' })
    }
  })
  
  // GET latest news
  app.get('/api/latest-news', (req, res) => {
    try {
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
      res.json(data.latestNews)
    } catch (error) {
      res.status(500).json({ error: 'Failed to read latest news data' })
    }
  })

  // Middleware to parse JSON body when no file is uploaded
  const parseBody = (req, res, next) => {
    if (req.headers['content-type']?.includes('application/json')) {
      express.json({ limit: '10mb' })(req, res, next)
    } else {
      next()
    }
  }

  // Add item with optional file upload
  app.post('/api/add-item/:category', upload.single('file'), parseBody, (req, res) => {
    try {
      const { category } = req.params
      const validCategories = ['systems', 'desktop', 'quickServices', 'latestNews']
      
      if (!validCategories.includes(category)) {
        return res.status(400).json({ error: 'Invalid category' })
      }
      
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
      
      // Handle file upload and parse item data
      let newItem
      if (req.file) {
        // File was uploaded - parse data from form field
        const itemData = req.body.data ? JSON.parse(req.body.data) : req.body
        newItem = {
          ...itemData,
          logo: req.file.filename
        }
        console.log('File uploaded with item:', req.file.filename)
      } else {
        // No file uploaded - req.body is directly the item
        newItem = req.body
      }
      
      // Set default values
      if (!newItem.isOnline) {
        newItem.isOnline = false
      }
      
      // Generate ID if not provided (handle both name and title fields)
      if (!newItem.id) {
        const nameField = newItem.name || newItem.title || 'item'
        newItem.id = nameField.toLowerCase().replace(/[^a-z0-9]/g, '-')
      }
      
      data[category].push(newItem)
      
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2))
      res.json({ success: true, item: newItem })
    } catch (error) {
      console.error('Add item error:', error)
      res.status(500).json({ error: 'Failed to add item: ' + error.message })
    }
  })

  // Delete item from portal-data.json
  app.delete('/api/delete-item/:category/:id', (req, res) => {
    try {
      const { category, id } = req.params
      const validCategories = ['systems', 'desktop', 'quickServices', 'latestNews']
      
      if (!validCategories.includes(category)) {
        return res.status(400).json({ error: 'Invalid category' })
      }
      
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
      const itemIndex = data[category].findIndex(item => item.id === id)
      
      if (itemIndex === -1) {
        return res.status(404).json({ error: 'Item not found' })
      }
      
      const deletedItem = data[category].splice(itemIndex, 1)[0]
      
      // Delete associated image file if exists
      const imageFile = deletedItem.logo || deletedItem.image
      if (imageFile && imageFile !== 'city_logo.png' && imageFile !== 'news-image.jpg') {
        const imagePath = path.join(__dirname, '../static/', imageFile)
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath)
          console.log('Deleted image file:', imageFile)
        }
      }
      
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2))
      res.json({ success: true, item: deletedItem })
    } catch (error) {
      console.error('Delete error:', error)
      res.status(500).json({ error: 'Failed to delete item: ' + error.message })
    }
  })

  // Update item in portal-data.json
  app.put('/api/update-item/:category/:id', upload.single('file'), parseBody, (req, res) => {
    try {
      const { category, id } = req.params
      const validCategories = ['systems', 'desktop', 'quickServices', 'latestNews']
      
      if (!validCategories.includes(category)) {
        return res.status(400).json({ error: 'Invalid category' })
      }
      
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
      const itemIndex = data[category].findIndex(item => item.id === id)
      
      if (itemIndex === -1) {
        return res.status(404).json({ error: 'Item not found' })
      }
      
      // Handle file upload and parse item data
      let updatedItem
      if (req.file) {
        // File was uploaded - parse data from form field
        const itemData = req.body.data ? JSON.parse(req.body.data) : req.body
        updatedItem = {
          ...itemData,
          logo: req.file.filename
        }
        console.log('File uploaded with update:', req.file.filename)
      } else {
        // No file uploaded - req.body is directly the item
        updatedItem = req.body
      }
      
      // Preserve the original ID
      updatedItem.id = id
      
      // Set default values
      if (!updatedItem.isOnline) {
        updatedItem.isOnline = false
      }
      
      data[category][itemIndex] = updatedItem
      
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2))
      res.json({ success: true, item: updatedItem })
    } catch (error) {
      console.error('Update item error:', error)
      res.status(500).json({ error: 'Failed to update item: ' + error.message })
    }
  })

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
