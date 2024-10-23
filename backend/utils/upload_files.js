import { v2 as cloudinary } from 'cloudinary';

export const uploadFile = async (filename, mime, buffer) => {
  try {
    const base64Data = buffer.toString('base64');
    const dataUri = `data:${mime};base64,${base64Data}`;
    const originalName = filename.replace(/\.[^/.]+$/, '');

    const public_id = `linkUp/${originalName}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      overwrite: true,
      resource_type: 'auto',
      public_id,
    });

    if (mime.startsWith('image')) {
      const autoCropUrl = cloudinary.url(public_id, {
        crop: 'auto',
        gravity: 'auto',
        width: 500,
        height: 500,
      });
      return autoCropUrl;
    }
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('File upload failed');
  }
};
