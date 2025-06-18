// src/componentes/ModalesAjustes.tsx
import React from 'react';

interface ModalCategoriaProps {
  show: boolean;
  descripcion: string;
  onChange: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
}

export const ModalCategoria: React.FC<ModalCategoriaProps> = ({ show, descripcion, onChange, onClose, onSave }) => {
  if (!show) return null;

  return (
    <div className="modal show fade d-block" tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Agregar Categoría</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">
            <input
              type="text"
              className="form-control"
              placeholder="Descripción de la categoría"
              value={descripcion}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button className="btn btn-success" onClick={onSave}>Guardar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ModalSubcategoriaProps {
  show: boolean;
  categorias: { idcategoria: number; descripcion: string }[];
  idCategoria?: number;
  descripcion: string;
  onCategoriaChange: (id: number | undefined) => void;
  onDescripcionChange: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
}

export const ModalSubcategoria: React.FC<ModalSubcategoriaProps> = ({
  show,
  categorias,
  idCategoria,
  descripcion,
  onCategoriaChange,
  onDescripcionChange,
  onClose,
  onSave,
}) => {
  if (!show) return null;

  return (
    <div className="modal show fade d-block" tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Agregar Subcategoría</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">
            <select
              className="form-control mb-3"
              value={idCategoria ?? ''}
              onChange={(e) =>
                onCategoriaChange(e.target.value ? Number(e.target.value) : undefined)
              }
            >
              <option value="">Seleccione una categoría</option>
              {categorias.map((cat) => (
                <option key={cat.idcategoria} value={cat.idcategoria}>
                  {cat.descripcion}
                </option>
              ))}
            </select>
            <input
              type="text"
              className="form-control"
              placeholder="Descripción de la subcategoría"
              value={descripcion}
              onChange={(e) => onDescripcionChange(e.target.value)}
            />
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button className="btn btn-success" onClick={onSave}>Guardar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ModalSuscripcionProps {
  show: boolean;
  descripcion: string;
  precio: string;
  onDescripcionChange: (value: string) => void;
  onPrecioChange: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
}

export const ModalSuscripcion: React.FC<ModalSuscripcionProps> = ({
  show,
  descripcion,
  precio,
  onDescripcionChange,
  onPrecioChange,
  onClose,
  onSave,
}) => {
  if (!show) return null;

  return (
    <div className="modal show fade d-block" tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Agregar Suscripción</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) => onDescripcionChange(e.target.value)}
            />
            <input
              type="number"
              className="form-control"
              placeholder="Precio"
              value={precio}
              onChange={(e) => onPrecioChange(e.target.value)}
              min="0"
            />
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn btn-success" onClick={onSave}>
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
