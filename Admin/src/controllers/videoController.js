import VideoContent from '../models/VideoContent.js';

export const addVideo = async (req, res) => {
  try {
    const video = await VideoContent.create({
      ...req.body,
      addedBy: req.user._id
    });
    res.status(201).json(video);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getVideos = async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};
    const videos = await VideoContent.find(query).populate('addedBy', 'name');
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateVideo = async (req, res) => {
  try {
    const video = await VideoContent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteVideo = async (req, res) => {
  try {
    await VideoContent.findByIdAndDelete(req.params.id);
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};