import { useEffect, useState } from 'react';
import Formulario from './components/Formulario';
import ListadoImagenes from './components/ListadoImagenes';

function App() {

  const [ busqueda, guardarBusqueda ]= useState(''); 
  const [ imagenes, guardarImagenes ]= useState([]); 
  const [ paginaActual, guardarPaginaActual] =  useState(1);
  const [ totalPaginas, guardarTotalPaginas] = useState (5);

  //el use efect se ejecuta cuando se modifican busqueda o paginaactual
  useEffect(() => {
    
    const consultarAPI = async () => {
      if(busqueda ==='') return;
      
      const imagenesPorPagina =30;
      const key ='15053597-314839e8afc72ab12217cc7b9';
      const url= `https://pixabay.com/api/?key=${key}&q=${busqueda}&per_page=${imagenesPorPagina}&page=${paginaActual}`;
      
      const respuesta = await fetch(url);
      const resultado = await respuesta.json();

      guardarImagenes(resultado.hits);
      
      //calcular el total de paginas
      const calcularTotalPaginas = Math.ceil(resultado.totalHits / imagenesPorPagina)
      guardarTotalPaginas(calcularTotalPaginas);

      //Mover la pantalla hacia arriba cuando se seleeciona siguiente
      const jumbotron = document.querySelector('.jumbotron');
      jumbotron.scrollIntoView({behavior: 'smooth'})


    }
    consultarAPI();
  },[busqueda, paginaActual])


//defimir la pagina anterior 

const paginaAnterior= () =>{
  const nuevaPaginaActual = paginaActual -1;
  if(nuevaPaginaActual===0){
    return;
  }
  guardarPaginaActual(nuevaPaginaActual);
}

const paginaSiguiente= () =>{
  const nuevaPaginaActual = paginaActual  +1;
  if(nuevaPaginaActual > totalPaginas) return;
  guardarPaginaActual(nuevaPaginaActual);
}

  return (
      <div className="container">
          <div className="jumbotron">
            <p className="lead text-center">
              Buscador de imagenes 
            </p>
            <Formulario
              guardarBusqueda={guardarBusqueda}
            />
          </div>
          <div className="row justify-content-center">
              <ListadoImagenes
                imagenes={imagenes}
              />
          </div>

          { (paginaActual ===1) ? null : 
            <button
            type="button"
            onClick={paginaAnterior}
            className="btn btn-info mr-1"
            >&laquo;Anterior </button>
          
          }
          { (paginaActual ===totalPaginas) ? null : 
            <button
            type="button"
            className="btn btn-info"
            onClick={paginaSiguiente}
            >Siguiente &raquo;</button>
          
          }
          
          
      </div>
  );
}

export default App;
