import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('upload')
export class UploadController {
  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // ছবিগুলো প্রোজেক্টের uploads ফোল্ডারে সেভ হবে
        filename: (req, file, callback) => {
          // ফাইলের নাম ইউনিক করার জন্য সময়ের সাথে একটি র‍্যান্ডম নাম্বার জুড়ে দিচ্ছি
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        // শুধু ইমেজ ফাইল অ্যালাউ করা হচ্ছে
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
          return callback(new BadRequestException('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded or invalid file format');
    }

    // ব্রাউজারে দেখার জন্য ছবির ডাইরেক্ট লিংক তৈরি করে দিচ্ছি
    const fileUrl = `http://localhost:5000/uploads/${file.filename}`;
    
    return {
      message: 'Image uploaded successfully! 🖼️',
      url: fileUrl,
    };
  }
}