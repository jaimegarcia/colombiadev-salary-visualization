import pandas as pd
import numpy as np

salaryData=pd.read_csv("~/colombiadev-salary-visualization/src/dataprocess/data/salaries-basedata.csv", sep=',',encoding='utf-8')

salaryData['min-experience']=salaryData['experience'].replace(['menos de 1 año','1+ año','2+ años','3 - 5 años','5 - 10 años','10 - 15 años','más de 15 años'], [0,1,2,3,5,10,15]).astype(int)
salaryData['max-experience']=salaryData['experience'].replace(['menos de 1 año','1+ año','2+ años','3 - 5 años','5 - 10 años','10 - 15 años','más de 15 años'], [0,1,2,4,9,14,15]).astype(int)


salaryData['english-level']=salaryData['english-level'].replace(['ninguno','básico (puede leer documentación y código en inglés)','intermedio (puede pasar una entrevista de programación en ingles cómodamente)','avanzado (puede liderar una reunion de varias personas en ingles comodamente)','nativo'], [0,1,2,3,4]).astype(int)

salaryData['max-title']=salaryData['max-title'].replace(['ninguno','bachiller','técnico, tecnología, bachiller técnico','pregrado','maestria','doctorado','post-doctorado'],[0,1,2,3,4,5,6]).astype(int)

salaryData['income-in-currency'] = salaryData['income-in-currency'].replace('[\$,]', '', regex=True).astype(float)
salaryData['main-programming-language']=salaryData['main-programming-language'].replace(["ninguno, por que soy manager 😭","no puedo decir, revelaría mi identidad secreta."],["Ninguno","Sin Respuesta"])
salaryData['main-programming-language']=salaryData['main-programming-language'].fillna("Sin Respuesta")
salaryData['workmode']=salaryData['workmode'].replace(['presencial (ocupa más del 60% de su tiempo en una oficina)',
 'remoto (ocupa más del 70% de su tiempo trabajando en casa, cowork o un cafe)',
 'remoto (en casa o en un cafe)',
 'flexible (va a la oficina, pero puede trabajar desde casa cuando quiera)',
 'presencial (ocupa más del 70% de su tiempo en una oficina)',
 'presencial (ocupaba mas del 70% de su tiempo en una oficina)',
 'flexible (tenia oficina, pero podia trabajar desde casa cuando quisiera)',
 'remoto (ocupaba mas del 70% de su tiempo trabajando en casa, cowork o un cafe)'],['Presencial','Remoto','Remoto','Flexible','Presencial','Presencial','Flexible','Remoto'])
salaryData['workmode']=salaryData['workmode'].fillna("Sin Respuesta")
print(salaryData['main-programming-language'].unique())

salaryData.to_csv("~/colombiadev-salary-visualization/src/dataprocess/data/salaries-proccesed.csv",index=False)
