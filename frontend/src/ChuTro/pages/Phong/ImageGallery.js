import { useState, useEffect, useRef } from "react";
import "../../Css/Phong/ImageGallery.css"; // Tạo file CSS riêng cho component này

function ImageGallery({ images = [], coverImage }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [sortedImages, setSortedImages] = useState([]);

  // State và logic cho Lightbox
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const imageRef = useRef(null);
  const startPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (images.length > 0) {
      const otherImages = images.filter((img) => img !== coverImage);
      const finalSortedImages = coverImage
        ? [coverImage, ...otherImages]
        : [...images];
      setSortedImages(finalSortedImages);
      setSelectedImage(finalSortedImages[0]);
    }
  }, [images, coverImage]);

  // --- Tất cả các hàm xử lý Lightbox (open, close, zoom, drag) được chuyển vào đây ---
  const openLightbox = () => {
    if (selectedImage) {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
      setIsLightboxOpen(true);
    }
  };
  const closeLightbox = () => setIsLightboxOpen(false);
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 1));
  const handleResetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };
  const handleMouseDown = (e) => {
    if (zoom > 1) {
      e.preventDefault();
      setIsDragging(true);
      startPos.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
    }
  };
  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1) {
      e.preventDefault();
      setPosition({
        x: e.clientX - startPos.current.x,
        y: e.clientY - startPos.current.y,
      });
    }
  };
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  if (sortedImages.length === 0) {
    return <p>Chưa có hình ảnh cho phòng này.</p>;
  }

  return (
    <>
      <div className="image-gallery-container">
        <div className="main-image-wrapper" onClick={openLightbox}>
          <img
            src={`http://localhost:5000${selectedImage}`}
            alt="Ảnh chính phòng trọ"
            className="main-image"
          />
          <div className="zoom-indicator">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {" "}
              <circle cx="11" cy="11" r="8"></circle>{" "}
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>{" "}
              <line x1="11" y1="8" x2="11" y2="14"></line>{" "}
              <line x1="8" y1="11" x2="14" y2="11"></line>{" "}
            </svg>
          </div>
        </div>
        {sortedImages.length > 1 && (
          <div className="thumbnail-strip">
            {sortedImages.map((imgUrl, index) => (
              <div
                key={index}
                className={`thumbnail-item ${
                  imgUrl === selectedImage ? "active" : ""
                }`}
                onClick={() => setSelectedImage(imgUrl)}
              >
                <img
                  src={`http://localhost:5000${imgUrl}`}
                  alt={`Ảnh thumbnail ${index + 1}`}
                />
                {index === 0 && <span className="cover-tag">Bìa</span>}
                {index > 0 && <span className="number-tag">{index}</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {isLightboxOpen && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          {/* Toàn bộ JSX của Lightbox (toolbar, image, etc.) được chuyển vào đây */}
          <button className="lightbox-close-btn" onClick={closeLightbox}>
            &times;
          </button>
          <div className="lightbox-toolbar">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleZoomOut();
              }}
              disabled={zoom <= 1}
            >
              {" "}
              <svg viewBox="0 0 24 24">
                {" "}
                <path d="M19 13H5v-2h14v2z"></path>{" "}
              </svg>{" "}
            </button>{" "}
            <span className="zoom-level">{Math.round(zoom * 100)}%</span>{" "}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleZoomIn();
              }}
              disabled={zoom >= 3}
            >
              {" "}
              <svg viewBox="0 0 24 24">
                {" "}
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>{" "}
              </svg>{" "}
            </button>{" "}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleResetZoom();
              }}
              disabled={zoom === 1 && position.x === 0 && position.y === 0}
            >
              {" "}
              <svg viewBox="0 0 24 24">
                {" "}
                <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"></path>{" "}
              </svg>{" "}
            </button>
          </div>
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={`http://localhost:5000${selectedImage}`}
              alt="Ảnh phóng to"
              className="lightbox-image"
              style={{
                transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
                cursor:
                  zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default",
                transition: isDragging ? "none" : "transform 0.2s ease",
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default ImageGallery;
