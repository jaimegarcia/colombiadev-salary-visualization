import React,{useState,useEffect} from 'react';
import Slider from './components/slider';
import Container from '@material-ui/core/Container';
import * as d3 from 'd3';

import './App.css';
import salaryFile from './data/salaries.csv'
//let salaryData=null;


const maxSalary=1000000000


function App() {

  const [loading, setLoading] = useState(true);
  const [salaryMean, setSalaryMean] = useState(0);
  const [numberOfPeople, setNumberOfPeople] = useState(0);
  const [salaryData, setSalaryData] = useState(null);
  const [filters, setFilters] = React.useState({
    exchangeRate: 3000,
    experience:0,
  });
  const processData=()=>{
    d3.csv(salaryFile)
    .then((csv)=>{
      csv.map(d=>{
        d["income-in-currency"]=Number(d["income-in-currency"].replace(/[^0-9.-]+/g,""))
        switch(d["experience"]) {
          case "menos de 1 año":
            d['min-experience']=0;
            d['max-experience']=0;
            break;
          case "1+ año":
            d['min-experience']=1;
            d['max-experience']=1;
            break;
          case "2+ años":
            d['min-experience']=2;
            d['max-experience']=2;
            break;
          case "3 - 5 años":
            d['min-experience']=3;
            d['max-experience']=4;
            break;
          case "5 - 10 años":
            d['min-experience']=5;
            d['max-experience']=9;
            break; 
          case "10 - 15 años":
            d['min-experience']=10;
            d['max-experience']=14;
            break;      
          default:
            d['min-experience']=15;
            d['max-experience']=20;
        }

        ;return d;})
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

        newSalaryData=newSalaryData.filter(d=>d["income-cop"]<=maxSalary)

        newSalaryData=newSalaryData.filter(d=>(filters.experience>=d["min-experience"] && filters.experience<=d["max-experience"]));

        setSalaryMean(d3.mean(newSalaryData, d => d["income-cop"]))
        setNumberOfPeople(newSalaryData.length);
      }
          
    },
    [filters]
  );

  return (
    <div className="App">

      {!loading && 
      <Container>
        <h4>¿Qué tasa de conversión de dólar deseas utilizar?</h4>
        <Slider variable="exchangeRate" updateChart={updateChart} min={3000} max={4000} step={10} />
        <h4>¿Cuántos años de experiencia tienes?</h4>
        <Slider variable="experience" updateChart={updateChart}  min={0} max={15} step={1} />
        <h4>Hay {numberOfPeople} personas de la comunidad con un perfil parecido al tuyo y ganan en promedio</h4>
        el equivalente a {d3.format("($,.0f")(salaryMean)} pesos al año
      </Container>
       
      }
    </div>
  );
}

export default App;
