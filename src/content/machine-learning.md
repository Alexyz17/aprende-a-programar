# Machine Learning con Python

> El *machine learning* (aprendizaje automático) consiste en que un programa aprenda patrones a partir de ejemplos en lugar de seguir reglas escritas a mano. En este curso recorrerás el proceso completo: entender los datos, prepararlos, entrenar modelos, evaluarlos con honestidad y ponerlos en producción. Necesitas [Python desde cero](/lecciones/python-basico).

## Qué es el machine learning

En programación tradicional escribes las reglas:

```text
datos + reglas  →  resultado
```

En machine learning le das ejemplos con su resultado y el algoritmo encuentra las reglas:

```text
datos + resultados conocidos  →  modelo (reglas aprendidas)
modelo + datos nuevos         →  predicción
```

Tipos principales:

| Tipo | Qué aprende | Ejemplos |
| --- | --- | --- |
| Supervisado: **clasificación** | A asignar una categoría | ¿Spam o no? ¿Cliente que se dará de baja? |
| Supervisado: **regresión** | A predecir un número | Precio de una vivienda, demanda de mañana |
| No supervisado: **clustering** | A agrupar datos parecidos sin etiquetas | Segmentos de clientes |
| No supervisado: **reducción de dimensión** | A resumir muchas variables en pocas | Visualizar datos complejos |
| Por refuerzo | A actuar para maximizar una recompensa | Juegos, robótica |

> **Nota:** antes de usar machine learning, pregúntate si unas reglas simples resolverían el problema. Un modelo añade complejidad, necesita datos de calidad y hay que mantenerlo.

## Preparar el entorno

```bash
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install pandas numpy scikit-learn matplotlib jupyterlab joblib
jupyter lab
```

Los cuadernos de **Jupyter** son ideales para explorar: ejecutas el código por celdas y ves los resultados y gráficos al momento. Para producción, lleva el código a archivos `.py`.

## Explorar los datos con pandas

Usaremos un problema clásico: predecir si un cliente de una empresa de telecomunicaciones se dará de baja (*churn*).

```python
import pandas as pd

df = pd.read_csv("clientes.csv")

df.head()            # primeras filas
df.shape             # (filas, columnas)
df.info()            # tipos y valores nulos
df.describe()        # estadísticas de las columnas numéricas
df["baja"].value_counts(normalize=True)   # proporción de cada clase
```

Preguntas que debes hacerte siempre:

- ¿Qué significa cada columna? ¿Hay columnas que no estarían disponibles en el momento de predecir?
- ¿Hay valores nulos o imposibles (edades negativas, fechas futuras)?
- ¿Las clases están equilibradas? Si solo el 5 % se da de baja, un modelo que siempre diga "no" acierta el 95 % y no sirve para nada.

```python
import matplotlib.pyplot as plt

df.groupby("tipo_contrato")["baja"].mean().plot(kind="bar")
plt.ylabel("Tasa de baja")
plt.show()

df.select_dtypes("number").corr()["baja"].sort_values()
```

## Preparar los datos

Los modelos necesitan números sin huecos. Las transformaciones típicas:

| Problema | Solución |
| --- | --- |
| Valores nulos | Imputar (media, mediana, la categoría más frecuente) o eliminar filas |
| Texto categórico (`"mensual"`, `"anual"`) | *One-hot encoding*: una columna 0/1 por categoría |
| Escalas muy distintas (edad frente a ingresos) | Estandarizar (media 0, desviación 1) |
| Columnas que "chivan" el resultado | Eliminarlas (fuga de datos) |

### Separar entrenamiento y test

**La regla más importante del machine learning**: evalúa siempre con datos que el modelo **no ha visto** durante el entrenamiento.

```python
from sklearn.model_selection import train_test_split

X = df.drop(columns=["baja", "id_cliente"])
y = df["baja"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
```

`stratify=y` mantiene la misma proporción de clases en ambos conjuntos.

### Pipelines

Un **pipeline** encadena la preparación y el modelo. Así la preparación se "aprende" solo con los datos de entrenamiento y se aplica igual a los nuevos, sin fugas.

```python
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder, StandardScaler

numericas = ["meses_cliente", "cargo_mensual", "llamadas_soporte"]
categoricas = ["tipo_contrato", "metodo_pago", "tiene_fibra"]

preparacion = ColumnTransformer([
    ("num", Pipeline([
        ("imputar", SimpleImputer(strategy="median")),
        ("escalar", StandardScaler()),
    ]), numericas),
    ("cat", Pipeline([
        ("imputar", SimpleImputer(strategy="most_frequent")),
        ("onehot", OneHotEncoder(handle_unknown="ignore")),
    ]), categoricas),
])
```

## Tu primer modelo

```python
from sklearn.linear_model import LogisticRegression

modelo = Pipeline([
    ("prep", preparacion),
    ("clf", LogisticRegression(max_iter=1000, class_weight="balanced")),
])

modelo.fit(X_train, y_train)
predicciones = modelo.predict(X_test)
probabilidades = modelo.predict_proba(X_test)[:, 1]
```

`class_weight="balanced"` da más peso a la clase minoritaria para que el modelo no la ignore.

Empieza siempre con un **modelo de referencia** sencillo (o incluso uno que siempre prediga la clase más frecuente) para saber si los modelos complejos aportan algo de verdad.

## Evaluar con honestidad

### Clasificación

```python
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score

print(confusion_matrix(y_test, predicciones))
print(classification_report(y_test, predicciones))
print("ROC AUC:", roc_auc_score(y_test, probabilidades))
```

La **matriz de confusión**:

```text
                 Predice NO    Predice SÍ
Realmente NO     Verd. neg.    Falso positivo
Realmente SÍ     Falso neg.    Verd. positivo
```

| Métrica | Pregunta que responde |
| --- | --- |
| Exactitud (*accuracy*) | ¿Qué porcentaje acierta en total? Engaña con clases desequilibradas |
| Precisión | De los que marco como "baja", ¿cuántos lo son? |
| Exhaustividad (*recall*) | De todas las bajas reales, ¿cuántas detecto? |
| F1 | Equilibrio entre precisión y recall |
| ROC AUC | ¿Ordena bien a los clientes por riesgo? (0,5 = azar, 1 = perfecto) |

Qué métrica importa depende del **coste de cada error**. Para detectar fraude, un falso negativo (fraude no detectado) suele ser mucho más caro que un falso positivo (revisar una operación legítima).

### Regresión

```python
from sklearn.metrics import mean_absolute_error, root_mean_squared_error, r2_score

mae = mean_absolute_error(y_test, pred)    # error medio en las unidades del problema (p. ej. euros)
rmse = root_mean_squared_error(y_test, pred)  # penaliza más los errores grandes
r2 = r2_score(y_test, pred)                # proporción de la variación explicada
```

### Validación cruzada

Un único reparto entrenamiento/test puede tener suerte. La **validación cruzada** entrena y evalúa varias veces con repartos distintos:

```python
from sklearn.model_selection import cross_val_score

puntuaciones = cross_val_score(modelo, X_train, y_train, cv=5, scoring="roc_auc")
print(puntuaciones.mean(), puntuaciones.std())
```

## Modelos más potentes

Los **árboles de decisión** hacen preguntas sucesivas sobre los datos ("¿contrato mensual?", "¿más de 3 llamadas a soporte?"). Combinados en grupo son de los mejores modelos para datos en tabla:

```python
from sklearn.ensemble import RandomForestClassifier, HistGradientBoostingClassifier

bosque = Pipeline([("prep", preparacion), ("clf", RandomForestClassifier(n_estimators=300, random_state=42))])
boosting = Pipeline([("prep", preparacion), ("clf", HistGradientBoostingClassifier(random_state=42))])

for nombre, m in [("Random Forest", bosque), ("Gradient Boosting", boosting)]:
    auc = cross_val_score(m, X_train, y_train, cv=5, scoring="roc_auc").mean()
    print(f"{nombre}: {auc:.3f}")
```

Librerías como **XGBoost**, **LightGBM** y **CatBoost** implementan *gradient boosting* aún más optimizado y dominan las competiciones con datos tabulares.

### Ajustar hiperparámetros

```python
from sklearn.model_selection import RandomizedSearchCV

busqueda = RandomizedSearchCV(
    boosting,
    param_distributions={
        "clf__learning_rate": [0.03, 0.05, 0.1],
        "clf__max_depth": [None, 4, 6, 8],
        "clf__max_iter": [200, 400, 800],
    },
    n_iter=20, cv=5, scoring="roc_auc", random_state=42, n_jobs=-1,
)
busqueda.fit(X_train, y_train)
print(busqueda.best_params_, busqueda.best_score_)
mejor = busqueda.best_estimator_
```

El conjunto de test se usa **una sola vez al final**, con el modelo elegido. Si lo consultas para tomar decisiones, deja de ser una evaluación honesta.

## Sobreajuste e interpretabilidad

**Sobreajuste** (*overfitting*): el modelo memoriza los datos de entrenamiento y falla con los nuevos. Señal típica: resultado excelente en entrenamiento y mucho peor en test.

Remedios: más datos, modelos más simples, regularización, menos variables, validación cruzada.

**Subajuste**: el modelo es demasiado simple y falla en ambos. Remedios: más variables útiles o un modelo más potente.

Entender **por qué** predice el modelo es importante para confiar en él y detectar errores:

```python
from sklearn.inspection import permutation_importance

r = permutation_importance(mejor, X_test, y_test, n_repeats=10, random_state=42, scoring="roc_auc")
importancias = pd.Series(r.importances_mean, index=X_test.columns).sort_values(ascending=False)
print(importancias.head(10))
```

Si la variable más importante es una que no debería serlo (por ejemplo, el identificador del cliente), probablemente hay una fuga de datos.

## Aprendizaje no supervisado

Agrupar clientes por comportamiento sin etiquetas previas:

```python
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

columnas = ["cargo_mensual", "meses_cliente", "llamadas_soporte"]
X_esc = StandardScaler().fit_transform(df[columnas])

kmeans = KMeans(n_clusters=4, random_state=42, n_init="auto")
df["segmento"] = kmeans.fit_predict(X_esc)
df.groupby("segmento")[columnas].mean()
```

Después hay que **interpretar** cada grupo con conocimiento del negocio ("clientes nuevos con muchas incidencias", "clientes fieles de bajo consumo"…).

## Llevar el modelo a producción

Guarda el pipeline completo (preparación + modelo):

```python
import joblib

joblib.dump(mejor, "modelo_bajas.joblib")
```

Sírvelo con una API usando **FastAPI**:

```python
# api.py
import joblib
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(title="Predicción de bajas")
modelo = joblib.load("modelo_bajas.joblib")

class Cliente(BaseModel):
    meses_cliente: int = Field(ge=0)
    cargo_mensual: float = Field(ge=0)
    llamadas_soporte: int = Field(ge=0)
    tipo_contrato: str
    metodo_pago: str
    tiene_fibra: bool

@app.post("/predecir")
def predecir(cliente: Cliente):
    datos = pd.DataFrame([cliente.model_dump()])
    probabilidad = float(modelo.predict_proba(datos)[0, 1])
    return {"probabilidad_baja": round(probabilidad, 3), "riesgo": "alto" if probabilidad > 0.6 else "normal"}
```

```bash
pip install fastapi uvicorn
uvicorn api:app --reload
# Documentación interactiva en http://localhost:8000/docs
```

Empaquétala con [Docker](/lecciones/docker) para desplegarla.

### Después del despliegue

- **Monitoriza** las predicciones y, cuando llegue, el resultado real.
- Vigila la **deriva de datos**: si los clientes nuevos se parecen poco a los de entrenamiento, el modelo empeora.
- **Reentrena** periódicamente con datos recientes y versiona los modelos (por ejemplo con MLflow).
- Registra qué versión del modelo hizo cada predicción.

## Ética y sesgos

Un modelo aprende de los datos históricos, **incluidos sus sesgos**. Si en el pasado se concedieron menos créditos a un grupo, el modelo puede reproducir esa discriminación aunque no uses la variable directamente (otras variables pueden actuar como sustituto).

Buenas prácticas:

- Evalúa las métricas **por grupos** (edad, género, zona) cuando el modelo afecte a personas.
- Documenta los datos, sus limitaciones y el uso previsto del modelo.
- Mantén a una persona en el bucle para decisiones importantes.
- Cumple la normativa: en la Unión Europea, el Reglamento de IA y el RGPD imponen obligaciones según el riesgo del sistema.

## Proyecto

Con un conjunto de datos público (por ejemplo de Kaggle o del repositorio UCI):

1. Explora los datos y documenta tres hallazgos con gráficos.
2. Crea un pipeline de preparación sin fugas de datos.
3. Compara un modelo de referencia, una regresión logística y un modelo de *gradient boosting* con validación cruzada.
4. Evalúa el mejor una única vez en test y explica qué métrica elegiste y por qué.
5. Sírvelo con FastAPI en un contenedor Docker.

> **Reto:** publica el proyecto en GitHub con un README que explique el problema, las decisiones y los resultados, incluidas las limitaciones. Es una de las piezas de portfolio que mejor demuestran criterio. Para trabajar con modelos de lenguaje, sigue con [Programación con IA](/lecciones/ia-programacion) y [Fine-tuning de modelos](/lecciones/fine-tuning).
