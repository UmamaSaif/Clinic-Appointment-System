import mongoose from 'mongoose';

const videoContentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  youtubeUrl: { type: String, required: true },
  category: { type: String },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: { type: String, default: 'active' }
}, { timestamps: true });

const VideoContent = mongoose.model('VideoContent', videoContentSchema);
export default VideoContent;