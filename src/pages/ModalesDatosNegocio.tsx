import React, { useEffect } from 'react';
import axios from 'axios';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

// Modal básico para reutilizar estilo modal Bootstrap
const Modal: React.FC<ModalProps & { title: string }> = ({ show, onClose, children, title }) => {
  if (!show) return null;

  return (
    <div className="modal show fade d-block" tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </div>
  );
};

// Modal Portada
export const ModalPortada: React.FC<{
  show: boolean;
  onClose: () => void;
  onUpload: (file: File | null) => void;
  onSubmit: () => void;
}> = ({ show, onClose, onUpload, onSubmit }) => {
  return (
    <Modal show={show} onClose={onClose} title="Agregar Portada">
      <div className="mb-2">
        <label>Imagen de portada:</label>
        <input type="file" className="form-control" onChange={e => onUpload(e.target.files?.[0] || null)} />
      </div>
      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={onClose}>
          Cancelar
        </button>
        <button type="button" className="btn btn-success" onClick={onSubmit}>
          Subir imágen
        </button>
      </div>
    </Modal>
  );
};
///logo
// Modal para subir logo
export const ModalLogo: React.FC<{
  show: boolean;
  onClose: () => void;
  onFileChange: (file: File | null) => void;
  onSubmit: () => void;
}> = ({ show, onClose, onFileChange, onSubmit }) => {
  if (!show) return null;
  return (
    <Modal show={show} onClose={onClose} title="Actualizar Logo del Negocio">
      <div className="mb-3">
        <label>Selecciona el nuevo logo:</label>
        <input
          type="file"
          className="form-control"
          accept="image/*"
          onChange={e => onFileChange(e.target.files?.[0] || null)}
        />
      </div>
      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={onClose}>
          Cancelar
        </button>
        <button className="btn btn-success" onClick={onSubmit}>
          Guardar Logo
        </button>
      </div>
    </Modal>
  );
};

// Modal Galería
export const ModalGaleria: React.FC<{
  show: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => void;
  onSubmit: () => void;
}> = ({ show, onClose, onUpload, onSubmit }) => {
  return (
    <Modal show={show} onClose={onClose} title="Agregar Fotos a la galería">
      <div className="mb-2">
        <label>Galería (puedes seleccionar varias):</label>
        <input
          type="file"
          className="form-control"
          multiple
          onChange={e => onUpload(Array.from(e.target.files || []))}
        />
      </div>
      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={onClose}>
          Cancelar
        </button>
        <button type="button" className="btn btn-success" onClick={onSubmit}>
          Subir imágenes de galería
        </button>
      </div>
    </Modal>
  );
};

// Modal para editar info negocio (formulario)

interface ModalEditarInfoNegocioProps {
  show: boolean;
  onClose: () => void;
  editForm: any;
  setEditForm: React.Dispatch<React.SetStateAction<any>>;
  categorias: any[];
  subcategorias: any[];
  setSubcategorias: React.Dispatch<React.SetStateAction<any[]>>;
  onSubmit: (e: React.FormEvent) => void;
}

export const ModalEditarInfoNegocio: React.FC<ModalEditarInfoNegocioProps> = ({
  show,
  onClose,
  editForm,
  setEditForm,
  categorias,
  subcategorias,
  setSubcategorias,
  onSubmit,
}) => {
  useEffect(() => {
    if (editForm.categoria) {
      axios
        .get(`https://sistemawebpro.com/api/subcategorias/categoria/${editForm.categoria}`)
        .then(response => {
          setSubcategorias(response.data.data);
        })
        .catch(error => {
          console.error("Error al cargar subcategorías:", error);
        });
    }
  }, [editForm.categoria, setSubcategorias]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const subcategoriasFiltradas = subcategorias.filter(
    sub => sub.idcategoria === Number(editForm.categoria)
  );

  if (!show) return null;

  return (
    <Modal show={show} onClose={onClose} title="Editar Información del Negocio">
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre Comercial</label>
          <input
            type="text"
            className="form-control"
            name="nombre_comercial"
            value={editForm.nombre_comercial || ''}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <input
            type="text"
            className="form-control"
            name="descripcion"
            value={editForm.descripcion || ''}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Promoción o Descuento</label>
          <input
            type="text"
            className="form-control"
            name="promocion"
            value={editForm.promocion || ''}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Condiciones</label>
          <input
            type="text"
            className="form-control"
            name="condicion"
            value={editForm.condicion || ''}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Teléfono</label>
          <input
            type="text"
            className="form-control"
            name="telefono"
            value={editForm.telefono || ''}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Categoría</label>
          <select
            className="form-select"
            value={editForm.categoria !== null && editForm.categoria !== undefined ? String(editForm.categoria) : ''}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              setEditForm({
                ...editForm,
                categoria: isNaN(value) ? null : value,
                subcategoria: null,
              });
            }}
          >
            <option value="">Seleccione categoría</option>
            {categorias.map(cat => (
              <option key={cat.idcategoria} value={String(cat.idcategoria)}>
                {cat.descripcion}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Subcategoría</label>
          <select
            className="form-select"
            value={editForm.subcategoria !== null && editForm.subcategoria !== undefined ? String(editForm.subcategoria) : ''}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              setEditForm({
                ...editForm,
                subcategoria: isNaN(value) ? null : value,
              });
            }}
            disabled={!editForm.categoria}
          >
            <option value="">Seleccione subcategoría</option>
            {subcategoriasFiltradas.map(sub => (
              <option key={sub.idsubcategoria} value={String(sub.idsubcategoria)}>
                {sub.descripcion}
              </option>
            ))}
          </select>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-success">
            Guardar Cambios
          </button>
        </div>
      </form>
    </Modal>
  );
};

// Modal para reemplazar imagen
export const ModalEditarImagen: React.FC<{
  show: boolean;
  onClose: () => void;
  onFileChange: (file: File | null) => void;
  onSubmit: () => void;
}> = ({ show, onClose, onFileChange, onSubmit }) => {
  if (!show) return null;
  return (
    <Modal show={show} onClose={onClose} title="Reemplazar Imagen">
      <label>Selecciona nueva imagen:</label>
      <input type="file" className="form-control" onChange={e => onFileChange(e.target.files?.[0] || null)} />
      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={onClose}>
          Cancelar
        </button>
        <button className="btn btn-success" onClick={onSubmit}>
          Guardar cambios
        </button>
      </div>
    </Modal>
  );
};
