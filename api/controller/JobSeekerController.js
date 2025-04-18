import JobSeeker from '../models/JobSeeker.js';
import multer from 'multer';
import path from 'path';

// Configure multer for CV file upload
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed!'));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
}).single('cvFile');

class JobSeekerController {
    // Get job seeker profile
    static async getProfile(req, res) {
        try {
            const { id } = req.params;
            const jobSeeker = await JobSeeker.findById(id).select('-password');
            
            if (!jobSeeker) {
                return res.status(404).json({ message: 'Job seeker not found' });
            }
            
            res.json(jobSeeker);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Update job seeker profile
    static async updateProfile(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            
            // Remove password from update data if present
            delete updateData.password;
            
            const jobSeeker = await JobSeeker.findByIdAndUpdate(
                id,
                updateData,
                { new: true }
            ).select('-password');
            
            if (!jobSeeker) {
                return res.status(404).json({ message: 'Job seeker not found' });
            }
            
            res.json(jobSeeker);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Upload CV
    static async uploadCV(req, res) {
        upload(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ message: 'File upload error' });
            } else if (err) {
                return res.status(400).json({ message: err.message });
            }

            try {
                const { id } = req.params;
                
                if (!req.file) {
                    return res.status(400).json({ message: 'No file uploaded' });
                }

                const jobSeeker = await JobSeeker.findByIdAndUpdate(
                    id,
                    {
                        cvFile: {
                            data: req.file.buffer,
                            contentType: req.file.mimetype,
                            originalName: req.file.originalname
                        }
                    },
                    { new: true }
                ).select('-password');

                if (!jobSeeker) {
                    return res.status(404).json({ message: 'Job seeker not found' });
                }

                res.json({ message: 'CV uploaded successfully' });
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }

    // Remove CV
    static async removeCV(req, res) {
        try {
            const { id } = req.params;
            
            const jobSeeker = await JobSeeker.findByIdAndUpdate(
                id,
                { $unset: { cvFile: "" } },
                { new: true }
            ).select('-password');
            
            if (!jobSeeker) {
                return res.status(404).json({ message: 'Job seeker not found' });
            }
            
            res.json({ message: 'CV removed successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Download CV
    static async downloadCV(req, res) {
        try {
            const { id } = req.params;
            const jobSeeker = await JobSeeker.findById(id);
            
            if (!jobSeeker || !jobSeeker.cvFile || !jobSeeker.cvFile.data) {
                return res.status(404).json({ message: 'CV not found' });
            }
            
            res.set({
                'Content-Type': jobSeeker.cvFile.contentType,
                'Content-Disposition': `attachment; filename="${jobSeeker.cvFile.originalName}"`
            });
            
            res.send(jobSeeker.cvFile.data);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default JobSeekerController;
