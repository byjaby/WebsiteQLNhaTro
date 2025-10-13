import "../../Css/Phong/ImageManager.css";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Component con SortableImageItem có thể nằm ngay trong file này
function SortableImageItem({ image, index, isCover, onRemove, onSetCover }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`image-preview-item ${isCover ? "is-cover" : ""} ${
        isDragging ? "is-dragging" : ""
      }`}
      {...attributes}
      {...listeners}
      onClick={() => onSetCover(image.id)}
    >
      <img
        src={image.preview || `http://localhost:5000${image.url}`}
        alt={`Preview ${index + 1}`}
      />
      {isCover ? (
        <span className="cover-badge">Bìa</span>
      ) : (
        <span className="number-badge">{index + 1}</span>
      )}
      <button
        type="button"
        className="remove-image-btn"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(image.id);
        }}
      >
        &times;
      </button>
    </div>
  );
}

// Component chính của file này
function ImageManager({
  images,
  coverImageId,
  onImagesChange,
  onReorderImages,
  onRemoveImage,
  onSetCoverImage,
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  );

  return (
    <div className="form-group image-upload-section">
      <label>
        Quản lý hình ảnh (Click để chọn ảnh bìa, kéo thả để sắp xếp)
      </label>
      <input
        type="file"
        id="editRoomImages"
        multiple
        accept="image/*"
        onChange={onImagesChange}
        className="file-input"
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onReorderImages}
      >
        <SortableContext
          items={images.map((i) => i.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="image-preview-container">
            {images.map((image, index) => (
              <SortableImageItem
                key={image.id}
                image={image}
                index={index}
                isCover={image.id === coverImageId}
                onRemove={onRemoveImage}
                onSetCover={onSetCoverImage}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default ImageManager;
