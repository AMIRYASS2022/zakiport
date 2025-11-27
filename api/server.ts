import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Create uploads directory for gallery images
const uploadsDir = path.join(__dirname, '../uploads/gallery');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `gallery-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please fill all fields correctly.' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please enter a valid email address.' 
      });
    }

    // For now, let's simulate email sending and log the message
    // This will work until you set up the Gmail App Password
    console.log('=== CONTACT FORM SUBMISSION ===');
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Message: ${message}`);
    console.log('================================');
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Try to send actual email if credentials are configured
    if (process.env.EMAIL_PASS && process.env.EMAIL_PASS !== 'your-app-password-here') {
      try {
        const nodemailer = await import('nodemailer');
        
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER || 'dahbaoui2010@gmail.com',
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_USER || 'dahbaoui2010@gmail.com',
          to: 'dahbaoui2010@gmail.com',
          subject: `New Contact Form Message from ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">New Contact Form Message</h2>
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p style="background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid #007bff;">
                  ${message.replace(/\n/g, '<br>')}
                </p>
              </div>
              <p style="color: #666; font-size: 12px;">
                This message was sent from your portfolio website contact form.
              </p>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
      } catch (emailError) {
        console.error('Email sending failed (using console log instead):', emailError);
      }
    } else {
      console.log('Email credentials not configured - using console log only');
    }

    res.status(200).json({ 
      success: true, 
      message: 'Message sent successfully!' 
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send message. Please try again later.' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Gallery endpoints
app.get('/api/gallery/images', (req, res) => {
  try {
    const images = fs.readdirSync(uploadsDir)
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
      })
      .map(file => ({
        filename: file,
        url: `/api/gallery/images/${file}`,
        size: fs.statSync(path.join(uploadsDir, file)).size,
        uploadDate: fs.statSync(path.join(uploadsDir, file)).birthtime
      }));
    
    res.status(200).json({ 
      success: true, 
      images: images,
      count: images.length 
    });
  } catch (error) {
    console.error('Error reading gallery images:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to load gallery images' 
    });
  }
});

// Serve gallery images
app.get('/api/gallery/images/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filepath = path.join(uploadsDir, filename);
    
    // Security check - prevent directory traversal
    if (!filepath.startsWith(uploadsDir)) {
      return res.status(403).json({ 
        success: false, 
        error: 'Access denied' 
      });
    }
    
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ 
        success: false, 
        error: 'Image not found' 
      });
    }
    
    res.sendFile(filepath);
  } catch (error) {
    console.error('Error serving gallery image:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to serve image' 
    });
  }
});

// Upload gallery images
app.post('/api/gallery/upload', upload.array('images', 10), (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'No images uploaded' 
      });
    }
    
    const uploadedImages = files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      url: `/api/gallery/images/${file.filename}`,
      size: file.size
    }));
    
    res.status(200).json({ 
      success: true, 
      message: `${files.length} images uploaded successfully`,
      images: uploadedImages
    });
  } catch (error) {
    console.error('Error uploading gallery images:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to upload images' 
    });
  }
});

// Delete gallery image
app.delete('/api/gallery/images/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filepath = path.join(uploadsDir, filename);
    
    // Security check - prevent directory traversal
    if (!filepath.startsWith(uploadsDir)) {
      return res.status(403).json({ 
        success: false, 
        error: 'Access denied' 
      });
    }
    
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ 
        success: false, 
        error: 'Image not found' 
      });
    }
    
    fs.unlinkSync(filepath);
    
    res.status(200).json({ 
      success: true, 
      message: 'Image deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete image' 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Contact form endpoint: http://localhost:${PORT}/api/contact`);
  console.log(`Gallery endpoints:`);
  console.log(`  - GET  /api/gallery/images     - List all gallery images`);
  console.log(`  - GET  /api/gallery/images/:filename - Serve specific image`);
  console.log(`  - POST /api/gallery/upload     - Upload new images (multipart/form-data)`);
  console.log(`  - DELETE /api/gallery/images/:filename - Delete specific image`);
  console.log('Note: Emails will be logged to console until Gmail App Password is configured');
});

export default app;