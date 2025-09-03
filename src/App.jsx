import React, { useState } from 'react';
import { useEffect } from "react";
import Layout from './components/Layout/Layout';
import Request from './components/Workspace/Request/RequestPanel';
import Response from './components/Workspace/Response/ResponsePanel';

/*Codigo anterior
const App = () => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
*/

function App() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    const fetchVlrsJson = async () => {
        try{
            const res = await fetch('http://localhost:3002/robos', { mode: 'cors' })
            //console.log("Result of the get: \n")
            const infoRobo = await res.json();
 
            const filteredJsonArrayValues = infoRobo[0];
            //const filteredJsonArrayValues = infoRobo.find(item => item.Evento === "Passivo CETIP");//item. seguido pela chave dentro do Json, neste caso
            if (filteredJsonArrayValues) {  
              const horarioFinal = filteredJsonArrayValues.HorarioInicial;                                                 // é Evento
              console.log("Vlr capturado: \n");         
              console.log(horarioFinal);//typeof
            } else {
              console.log("Item not found.");
            }
        } catch(err){
            console.log(err)
        }
    }
    fetchVlrsJson()
  }, []) 

  //handleOnInputSend={handleOnInputSend} 
  return (
    <>
      <Layout>
        <Request setResponse={setResponse} setLoading={setLoading} />
        <Response response={response} loading={loading} />
      </Layout>
    </>
  );
};

export default App;
