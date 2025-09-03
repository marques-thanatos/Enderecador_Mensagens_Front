import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { convertKeyValueToObject } from '../../../utils/helpers';
import UrlEditor from '../../Panes/RequestUrl/UrlEditor';
import RequestTabGroup from '../../Tab-Groups/RequestTabGroup';
import { useEffect } from "react";

const keyPairInitState = [
  {
    id: uuidv4(),
    keyItem: '',
    valueItem: '',
  },
];

export default function Request({ setResponse, setLoading, loading }) {
  const [url, setUrl] = useState(
    'https://graph.facebook.com/v18.0/122606874271372/messages' //224508930747583
  );

  const cabecalho = {
    headers: {
        Accept: 'text/plain',
        'Content-Type': 'text/plain',
    }
  };

  const [reqMethod, setReqMethod] = useState('POST');
  const [queryParams, setQueryParams] = useState(keyPairInitState);
  const [headers, setHeaders] = useState(keyPairInitState);
  const [body, setBody] = useState('{\n\t\n}');

  const handleOnInputSend = async (e) => {
    setLoading(true);
    //e.preventDefault(); 

    console.log('http method', reqMethod);
    console.log('headers', headers);
    console.log('query params ', queryParams);
    console.log('body ', body);//requestBody

      try{
        const res = await fetch('http://localhost:3002/ultimoRegistroRobos', { mode: 'cors' })
        const ultimo_id = await res.json();
        console.log("Maior id da tabela:\n");
        let ultimo_registro_tb = +ultimo_id[0].Id.toString();//Converte pra string e depois para numeral
        console.log(ultimo_registro_tb);

        if(ultimo_registro_tb > 5){
            console.log("Não há nenhum registro na tabela.");
            alert("dismissed");
        } else{
            const res = await fetch('http://localhost:3002/robos', { mode: 'cors' })
            const infoRobo = await res.json();
            console.log("Ultimo reg: \n");         
            console.log(infoRobo);//typeof  
            
            if (infoRobo) {                               
              var vetor = 0;

              infoRobo.forEach(async (info) => {                              
               const evento = infoRobo[vetor].Evento;
               const horarioInicial = infoRobo[vetor].HorarioInicial;
               const horarioFinal = infoRobo[vetor].HorarioFinal;
               vetor += 1;                                                              

                console.log("Vlr capturado do vetor depois: \n");         
                console.log(vetor);//typeof   

                const response = await fetch('/telefones.txt', cabecalho); // Path to your text file
                                  
                if (response.ok) {
                  const text = await response.text();
                  const todosTelefones = text.split(/\r\n|\n/);
                  var indice = 0;                                             
              
                  // Reading line by line
                  todosTelefones.forEach(async (numero) => {   
                    console.log("Vlr do Robo : \n");         
                    console.log(evento);//typeof 
                    console.log('Valor do indice ', todosTelefones[indice]);

                    const conteudoBody = buscarInfoRobo(todosTelefones, evento, horarioFinal, horarioInicial, indice)                       
                    indice += 1;
                    let data;                       
                    try {
                      data = JSON.parse(conteudoBody);//requestBody
                    } catch (e) {
                        alert('Algo errado com os dados do JSON.');
                    }
                                        
                    try {
                      const response = await axios({
                        url: url,
                        method: reqMethod,
                        params: convertKeyValueToObject(queryParams),
                        headers: convertKeyValueToObject(headers),
                        data,
                      });

                        console.log("Retorno do Facebook:\n");
                        console.log(response);
                                  
                        setResponse(response);
                    } catch (e) {
                        console.log(e);
                        setResponse(e);
                    }
                              
                  });
                                    
                     console.log('File general content: ',text); // Log the text content
              } else {
                  console.error('Failed to fetch data:', response.status);
              }                            
                                 
              });
                                                           
                } else {
                   console.log("Item not found.");
                }
                            
              }
              
        } catch(err){
            console.log(err)
        }               
    
    setLoading(false);
  };

  useEffect(() => {
    //const interval = 
    setInterval(()=>{
      try {
        handleOnInputSend();
      } catch (error) {
        console.error('Error in handleOnInputSend:', error);
      }
    }, 10000);
    setInterval(handleOnInputSend, 10000);
  //return () => clearInterval(interval);
    
  /*const handleClick = () => {
      setInterval(() => {
          
      }, 10000);/*///Gatilho p/ o handle quando o botão é clicado
    //handleClick();//Initial invocation when component mounts 
  }, []);

  return (
    <>
      <UrlEditor
        url={url}
        setUrl={setUrl}
        reqMethod={reqMethod}
        setReqMethod={setReqMethod}
        onInputSend={handleOnInputSend}
      />
      <RequestTabGroup
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        headers={headers}
        setHeaders={setHeaders}
        body={'{\n\t\n}'}
        setBody={setBody}
        //defaultValue={'"type": "template",\n"template":\n{"name": "bullest_business",\n"language": {\n "code": "pt_BR"}},\n'}//{\n\t\n}
      />
    </>
  );
}

async function verificaTabelaRobos(){
  
}

function buscarInfoRobo(todosTelefones, evento, horarioFinal, horarioInicial, indice){
      let inicio = `{\n "messaging_product": "whatsapp",\n "to": "${todosTelefones[indice]}",\n`;
      let inicioBody = inicio.toString();
      //const restanteBody = body.toString();//Conteudo digitado na área de texto do Mensageria
      let item1 = ` "type": "template",\n "template":{\n\t\t"name": "bullest_business",\n\t\t"language":{\n\t\t\t"code": "pt_BR"\n\t\t`;
      let item2 = `},\n\t\t"components": [\n\t\t  {\n\t\t\t\t"type": "body",\n\t\t\t\t"parameters": [\n\t\t\t\t  {\n\t\t\t\t\t"type": `;
      let item3 = `"text",\n\t\t\t\t\t"text": "${evento}"\n\t\t\t\t  },\n\t\t\t\t  {\n\t\t\t\t\t"type": "text",\n\t\t\t\t\t`;
      let item4 = `"text": "${horarioInicial}"\n\t\t\t\t  },\n\t\t\t\t  {\n\t\t\t\t\t"type": "text",\n\t\t\t\t\t"text": "${horarioFinal}"\n\t\t\t\t  }\n\t\t\t\t `;
      let item5 = `]\n\t\t  }\n\t\t]\n }\n}`;

      //Concatenando os itens do array pra formar o Json completo
      const bodyCompleto = `${inicioBody}${item1}${item2}${item3}${item4}${item5}`;
      console.log("Resultado concatenação:\n");
      console.log(bodyCompleto);

    return bodyCompleto;
}

function addTelefone(){

  let saveFile = () => {
    	
    // Get the data from each element on the form.
    const name = document.getElementById('txtName');
    const age = document.getElementById('txtAge');
    const email = document.getElementById('txtEmail');
    const country = document.getElementById('selCountry');
    const msg = document.getElementById('msg');
    
    // This variable stores all the data.
    let data = 
        '\r Name: ' + name.value + ' \r\n ' + 
        'Age: ' +age.value + ' \r\n ' + 
        'Email: ' + email.value + ' \r\n ' + 
        'Country: ' + country.value + ' \r\n ' + 
        'Message: ' + msg.value;
    
    // Convert the text to BLOB.
    const textToBLOB = new Blob([data], { type: 'text/plain' });
    const sFileName = 'formData.txt';	   // The file to save the data.

    let newLink = document.createElement("a");
    newLink.download = sFileName;

    if (window.webkitURL != null) {
        newLink.href = window.webkitURL.createObjectURL(textToBLOB);
    }
    else {
        newLink.href = window.URL.createObjectURL(textToBLOB);
        newLink.style.display = "none";
        document.body.appendChild(newLink);
    }

    newLink.click(); 
  }
}
