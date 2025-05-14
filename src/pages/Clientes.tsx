import  { useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/cliente.css';


const Clientes = () => {
  const [showModalClienteN, setShowModalClienteN] = useState(false);
  const [loading] = useState(false);

  

  return (
    <div className="divprincipal">
      <h2 className="text-center my-4">Listado de Clientes</h2>
      <div className="divclientes mx-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <input className="form-control w-50 me-3" type="search" placeholder="Buscar" />
          <button className="btn btn-success" onClick={() => setShowModalClienteN(true)}>
            Nuevo cliente
          </button>
        </div>

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <table className="table table-bordered table-striped">
            <thead className="thead-dark">
              <tr>
                <th>Cliente</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModalClienteN && (
        <div className="modal show fade d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form >
                <div className="modal-header">
                  <h5 className="modal-title">Nuevo Cliente</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModalClienteN(false)} />
                </div>
                <div className="modal-body">
                  
                  <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input type="text" className="form-control" name="nombre"  required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="telefono" className="form-label">Teléfono</label>
                    <input type="text" className="form-control" name="telefono"  required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="correo" className="form-label">Correo</label>
                    <input type="email" className="form-control" name="correo" required />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModalClienteN(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary" >
                   
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clientes;
