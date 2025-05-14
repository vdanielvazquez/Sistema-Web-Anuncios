import 'bootstrap/dist/css/bootstrap.min.css';

const Negocios = () => {

  //const API_URL = 'https://sistemawebpro.com';
 
  return (
    <div className="container-fluid mt-5">
      <div className="div-custom">
        <h2 className="titulo">Listado de Negocios</h2>

        {/* Botón para registrar nuevo negocio */}
        <button className="btn btn-primary position-fixed bottom-0 end-0 m-5" style={{ zIndex: 1050 }}>
          Nuevo negocio
        </button>

        {/* Filtros */}
        <div className="row mb-4">
          <div className="col-12 col-md-4 mb-3">
            <input className="form-control fs-5"  type="search"  placeholder="Buscar negocio por nombre" aria-label="Buscar"  value={busqueda}  onChange={(e) => setBusqueda(e.target.value)}  />
          </div>
        </div>
        {/* Cards */}
        <div className="row">
         
            <div  className="col-xl-3 col-md-4 col-sm-6 col-12 mb-3" style={{ margin: 20 }}>
              <div className="card-portada h-100">
              {/*<img src={ negocio.portada ? `${API_URL}/uploads/${negocio.idnegocio}/${negocio.portada}` : 'default-image.jpg' } className="card-img-top rounded-4" alt="Negocio"/>
               */}
               <div className="card-body">
                  <h5 className="card-title"></h5>
                  <button className="btn btn-primary d-block mx-auto"> Ver más</button>
                </div>
              </div>
            </div>
       
            <p className="text-center">No hay negocios registrados aún.</p>
       
        </div>
      </div>
    </div>
  );
};
export default Negocios;

