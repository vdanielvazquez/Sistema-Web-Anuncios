import React from 'react';

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
export const ModalInfoNegocio: React.FC<{
  show: boolean;
  onClose: () => void;
  editForm: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  categorias: any[];
  subcategorias: any[];
}> = ({ show, onClose, editForm, onChange, onSubmit, categorias, subcategorias }) => {
  return (
    <Modal show={show} onClose={onClose} title="Editar">
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre Comercial</label>
          <input type="text" className="form-control" name="nombre_comercial" value={editForm.nombre_comercial || ''} onChange={onChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Descripcion</label>
          <input type="text" className="form-control" name="descripcion" value={editForm.descripcion || ''} onChange={onChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Teléfono</label>
          <input type="text" className="form-control" name="telefono" value={editForm.telefono || ''} onChange={onChange} />
        </div>
        <div className="mb-3">
          <select
            className="form-select"
            name="id_categoria"
            value={editForm.id_categoria || ''}
            onChange={e => {
              onChange(e);
              // Limpia subcategoria cuando cambia categoria
              editForm.id_subcategoria = '';
            }}
          >
            <option value="">Seleccione una categoría</option>
            {categorias.map(cat => (
              <option key={cat.id_categoria} value={cat.id_categoria}>
                {cat.nombre}
              </option>
            ))}
          </select>
          <select
            className="form-select"
            name="id_subcategoria"
            value={editForm.id_subcategoria || ''}
            onChange={onChange}
            disabled={!editForm.id_categoria}
          >
            <option value="">Seleccione una subcategoría</option>
            {subcategorias.map(sub => (
              <option key={sub.id_subcategoria} value={sub.id_subcategoria}>
                {sub.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
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
