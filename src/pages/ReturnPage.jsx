import { useState } from "react";
import { createReturn } from "../api";

export default function ReturnPage() {
  const [form, setForm] = useState({
    order_number: "",
    return_reason: "",
    customer_name: "",
    picture_proof: null,
    bank_number: "",
    bank_name: "",
    name_bank_number: "",
    resi: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

    try {
      await createReturn(data);
      alert("Pengajuan retur berhasil dikirim!");
      setForm({
        order_number: "",
        return_reason: "",
        customer_name: "",
        picture_proof: null,
        bank_number: "",
        bank_name: "",
        name_bank_number: "",
        resi: "",
        notes: "",
      });
    } catch {
      alert("Gagal mengirim data retur.");
    }
    setLoading(false);
  }

  return (
    <div className="container py-4" style={{ maxWidth: 600 }}>
      <h2 className="mb-4">Formulir Pengajuan Retur Barang</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">Nomor Pesanan*</label>
          <input
            name="order_number"
            maxLength={50}
            className="form-control"
            required
            placeholder="Masukkan nomor pesanan Anda"
            value={form.order_number}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Alasan Retur*</label>
          <input
            name="return_reason"
            className="form-control"
            required
            placeholder="Contoh: Barang rusak, tidak sesuai, dll."
            value={form.return_reason}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Nama Pelanggan*</label>
          <input
            name="customer_name"
            className="form-control"
            required
            placeholder="Nama lengkap Anda"
            value={form.customer_name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Bukti Foto*</label>
          <input
            name="picture_proof"
            type="file"
            className="form-control"
            required
            accept="image/*"
            onChange={handleChange}
          />
          <div className="form-text">
            Unggah foto produk sebagai bukti retur.
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Nomor Rekening (opsional)</label>
          <input
            name="bank_number"
            className="form-control"
            placeholder="Nomor rekening untuk pengembalian dana"
            value={form.bank_number}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Nama Bank (opsional)</label>
          <input
            name="bank_name"
            className="form-control"
            placeholder="Nama bank Anda"
            value={form.bank_name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Nama Pemilik Rekening (opsional)</label>
          <input
            name="name_bank_number"
            className="form-control"
            placeholder="Nama sesuai buku tabungan"
            value={form.name_bank_number}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">
            Nomor Resi Pengembalian (opsional)
          </label>
          <input
            name="resi"
            maxLength={50}
            className="form-control"
            placeholder="Nomor resi pengiriman barang retur"
            value={form.resi}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Catatan Tambahan (opsional)</label>
          <textarea
            name="notes"
            className="form-control"
            placeholder="Tulis catatan tambahan jika ada"
            value={form.notes}
            onChange={handleChange}
          />
        </div>
        <button className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Mengirim..." : "Kirim Pengajuan Retur"}
        </button>
      </form>
    </div>
  );
}
