import Message from '../models/Message.js';
import JobSeeker from '../models/JobSeeker.js';
import Company from '../models/Company.js';

// Get conversation between company and applicant
export const getConversation = async (req, res) => {
  try {
    const companyId = req.user.userId;
    const applicantId = req.params.applicantId;
    const messages = await Message.find({ companyId, applicantId }).sort('createdAt');
    return res.json({ success: true, messages });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return res.status(500).json({ success: false, message: 'Error fetching conversation', error: error.message });
  }
};

// Send a message from company to applicant
export const sendMessage = async (req, res) => {
  try {
    const companyId = req.user.userId;
    const applicantId = req.params.applicantId;
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }
    const message = await Message.create({ companyId, applicantId, sender: 'Company', content });
    return res.status(201).json({ success: true, message });
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ success: false, message: 'Error sending message', error: error.message });
  }
};

// Get conversation for seeker side
export const getConversationSeeker = async (req, res) => {
  try {
    const applicantId = req.user.userId;
    const companyId = req.params.companyId;
    const messages = await Message.find({ companyId, applicantId }).sort('createdAt');
    return res.json({ success: true, messages });
  } catch (error) {
    console.error('Error fetching conversation for seeker:', error);
    return res.status(500).json({ success: false, message: 'Error fetching conversation', error: error.message });
  }
};

// Send message from seeker to company
export const sendMessageSeeker = async (req, res) => {
  try {
    const applicantId = req.user.userId;
    const companyId = req.params.companyId;
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }
    const message = await Message.create({ companyId, applicantId, sender: 'JobSeeker', content });
    return res.status(201).json({ success: true, message });
  } catch (error) {
    console.error('Error sending message by seeker:', error);
    return res.status(500).json({ success: false, message: 'Error sending message', error: error.message });
  }
};

// List chat threads for seeker (distinct companies)
export const getThreadsForSeeker = async (req, res) => {
  try {
    const applicantId = req.user.userId;
    const companyIds = await Message.distinct('companyId', { applicantId });
    const companies = await Company.find({ _id: { $in: companyIds } }).select('fullName');
    return res.json({ success: true, companies });
  } catch (error) {
    console.error('Error fetching chat threads:', error);
    return res.status(500).json({ success: false, message: 'Error fetching threads', error: error.message });
  }
};
