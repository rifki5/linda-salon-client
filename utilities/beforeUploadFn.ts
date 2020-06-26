import { UploadFile } from "antd/lib/upload/interface";
import { message } from 'antd'

const beforeUpload = (file: UploadFile) => {
  const isJPG = file.type === 'image/jpeg';
  if (!isJPG) {
    message.error('Kamu hanya di izinkan upload format jpg!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('gambar harus kurang dari 2MB!');
  }
  return isJPG && isLt2M;
}

export default beforeUpload