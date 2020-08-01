import React,{useState,useEffect} from 'react';
import Slider from './components/slider';
import {Container,Grid,AppBar,Toolbar,Typography} from '@material-ui/core';
import * as d3 from 'd3';

import './App.css';
import salaryFile from './dataprocess/data/salaries-proccesed.csv'
//let salaryData=null;


const maxSalary=1000000000
const englishLevels=['ninguno','básico (puede leer documentación y código en inglés)','intermedio (puede pasar una entrevista de programación en inglés)','avanzado (puede liderar una reunion de varias personas en inglés)','nativo']
const educationTitles=['ninguno','bachiller','técnico, tecnología, bachiller técnico','pregrado','maestria','doctorado','post-doctorado'];
function App() {

  const [loading, setLoading] = useState(true);
  const [salaryMean, setSalaryMean] = useState(0);
  const [numberOfPeople, setNumberOfPeople] = useState(0);
  const [salaryData, setSalaryData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [filters, setFilters] = React.useState({
    "exchangeRate": 3000,
    "experience":0,
    "english-level":1,
    "max-title":1
  });
  const processData=()=>{
    d3.csv(salaryFile, (d)=> {
      return {
        "currency":d["currency"],
        "min-experience": +d["min-experience"],
        "max-experience": +d["max-experience"],
        "english-level": +d["english-level"],
        "max-title": +d["max-title"],
        "income-in-currency": +d["income-in-currency"] 
      };
    })
    .then((csv)=>{

      //console.log("csv",csv[0])
      setSalaryData(csv);
      setLoading(false);

    })
    .catch((error)=>{
       // handle error   
    })
  }


  const updateChart=(name,value)=>{
    setFilters(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  useEffect(
    () => {
      processData(setSalaryData,setLoading)
           
    },
    []
  );

  useEffect(
    () => {
      if(salaryData){
        let newSalaryData=salaryData.map(d=>{
            d["income-cop"]=d["currency"]==="pesos"?d["income-in-currency"]:d["income-in-currency"]*filters.exchangeRate;
            return d;
          })

        newSalaryData=newSalaryData.filter(
          d=>(d["income-cop"]<=maxSalary &&
          (filters.experience>=d["min-experience"] && filters.experience<=d["max-experience"]) &&
          (filters['english-level']===d["english-level"]) &&
          (filters['max-title']===d["max-title"])
          )
        )

        setFilteredData(newSalaryData)
        setSalaryMean(d3.mean(newSalaryData, d => d["income-cop"]))
        setNumberOfPeople(newSalaryData.length);
      }
          
    },
    [filters]
  );

  return (
    <div className="App">
    <AppBar position="static">
      <Toolbar>
        <Typography className="title" variant="h6">
          Visualización de Salarios de Desarrolladores Colombianos 2020. Fuente: Colombia Dev Community
        </Typography>
      </Toolbar>
    </AppBar>
      {!loading && 
      <Container>
        <br/>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
          <b>¿Qué tasa de conversión de dólar deseas utilizar?</b>
          <Slider variable="exchangeRate" updateChart={updateChart} min={3000} defaultValue={3730} max={4000} step={10} />
          <b>¿Cuántos años de experiencia tienes?</b>
          <Slider variable="experience" updateChart={updateChart}  min={0} defaultValue={5} max={15} step={1} />
          <b>¿Cuál es tu nivel de ingles?</b>
          <Slider variable="english-level" updateChart={updateChart}  min={0} defaultValue={2} max={4} step={1} ordinalScale={englishLevels} />
          <b>¿Cuál es tu máximo nivel de formación?</b>
          <Slider variable="max-title" updateChart={updateChart}  min={0} defaultValue={3} max={6} step={1} ordinalScale={educationTitles} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <br/>
          <h2>
            <span>Hay {numberOfPeople} personas de la comunidad con un perfil parecido al tuyo</span>
            {numberOfPeople>0 && <span> y ganan en promedio al año</span>}
          </h2>
          <h2>
          {numberOfPeople>0 && <span>el equivalente a <h1>{d3.format("($,.0f")(salaryMean)} pesos</h1></span>}
          </h2>
          </Grid>
        </Grid>
      </Container>
       
      }
    </div>
  );
}

export default App;
