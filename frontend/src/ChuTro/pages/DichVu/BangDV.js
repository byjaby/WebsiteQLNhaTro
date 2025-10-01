import DichVuRow from "./DichVuRow";
import "../../Css/DichVu/BangDV.css";

function BangDV({ dichVuList, setDichVuList, editingId, setEditingId }) {
  return (
    <table className="dichvu-table">
      <thead>
        <tr>
          <th>Tên dịch vụ</th>
          <th>Đơn vị</th>
          <th>Đơn giá (VNĐ)</th>
          <th>Mô tả</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {dichVuList.length > 0 ? (
          dichVuList.map((dv) => (
            <DichVuRow
              key={dv._id}
              dv={dv}
              dichVuList={dichVuList}
              setDichVuList={setDichVuList}
              editingId={editingId}
              setEditingId={setEditingId}
            />
          ))
        ) : (
          <tr>
            <td colSpan="5" style={{ textAlign: "center" }}>
              Chưa có dịch vụ nào
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default BangDV;
