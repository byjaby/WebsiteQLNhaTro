import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { arrayMove } from "@dnd-kit/sortable";

import PhongFormInputs from "./PhongFormInputs";
import ImageManager from "./ImageManager";
import EditActionButtons from "./EditActionButtons";

import "../../Css/Phong/SuaPhong.css";

function SuaPhong({ phong, setPhong, setIsEditing }) {
  const [formData, setFormData] = useState({ ...phong });
  const [loading, setLoading] = useState(false);

  // === IMAGE STATE AND LOGIC ===
  const [images, setImages] = useState(
    phong.images.map((url, index) => ({
      id: `existing-${url}-${index}`,
      url: url,
      preview: null,
      file: null,
    }))
  );

  const [coverImageId, setCoverImageId] = useState(() => {
    const coverImage = images.find((img) => img.url === phong.coverImage);
    return coverImage ? coverImage.id : images.length > 0 ? images[0].id : null;
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 10) {
      toast.warn("Chỉ có thể thêm tối đa 10 hình ảnh.");
      return;
    }
    const newImages = files.map((file) => ({
      id: `new-${Date.now()}-${Math.random()}`,
      url: null,
      preview: URL.createObjectURL(file),
      file: file,
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleRemoveImage = (idToRemove) => {
    const newImages = images.filter((img) => img.id !== idToRemove);
    setImages(newImages);
    if (coverImageId === idToRemove) {
      setCoverImageId(newImages.length > 0 ? newImages[0].id : null);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const formDataToSend = new FormData();

      // 1. Thêm dữ liệu text
      Object.keys(formData).forEach((key) => {
        if (key !== "images" && key !== "coverImage") {
          formDataToSend.append(key, formData[key]);
        }
      });

      // 2. Phân loại ảnh cũ còn lại và ảnh mới
      const existingImagesUrls = images
        .filter((img) => img.url) // Chỉ lấy những ảnh đã có trên server
        .map((img) => img.url);

      images.forEach((img) => {
        if (img.file) {
          // Thêm các file ảnh mới
          formDataToSend.append("newImages", img.file);
        }
      });

      // 3. Gửi danh sách URL ảnh cũ được giữ lại và thứ tự của chúng
      formDataToSend.append(
        "existingImages",
        JSON.stringify(existingImagesUrls)
      );

      // 4. Xác định ảnh bìa mới
      const newCoverImage = images.find((img) => img.id === coverImageId);
      if (newCoverImage) {
        // Nếu ảnh bìa là ảnh cũ, gửi URL. Nếu là ảnh mới, gửi index của nó.
        if (newCoverImage.url) {
          formDataToSend.append("coverImage", newCoverImage.url);
        } else {
          const newImagesFiles = images.filter((img) => img.file);
          const newCoverIndex = newImagesFiles.findIndex(
            (img) => img.id === coverImageId
          );
          formDataToSend.append("newCoverImageIndex", newCoverIndex);
        }
      }

      // 5. Gửi request
      const res = await axios.put(
        `http://localhost:5000/api/phong/${phong._id}`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("✅ Cập nhật thành công!");
      setPhong(res.data.phong);
      setIsEditing(false);
    } catch (err) {
      toast.error("❌ Lỗi khi cập nhật phòng!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="phong-info editing-mode">
      <PhongFormInputs formData={formData} onFormChange={handleChange} />

      <ImageManager
        images={images}
        coverImageId={coverImageId}
        onImagesChange={handleImageChange}
        onReorderImages={handleDragEnd}
        onRemoveImage={handleRemoveImage}
        onSetCoverImage={setCoverImageId}
      />

      <EditActionButtons
        onSave={handleSave}
        onCancel={() => setIsEditing(false)}
        isLoading={loading}
      />
    </div>
  );
}

export default SuaPhong;
