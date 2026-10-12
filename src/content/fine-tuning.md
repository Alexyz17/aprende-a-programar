# Fine-tuning de modelos

> El *fine-tuning* (ajuste fino) consiste en seguir entrenando un modelo de lenguaje ya entrenado con tus propios ejemplos para especializarlo en una tarea. Es potente, pero muchas veces no es la primera herramienta que necesitas. En este curso aprenderás cuándo merece la pena, cómo preparar los datos, cómo entrenar con LoRA y cómo evaluar el resultado. Conviene haber hecho [Programación con IA](/lecciones/ia-programacion) y [Machine Learning con Python](/lecciones/machine-learning).

## Cuándo hacer fine-tuning (y cuándo no)

Antes de entrenar nada, recorre esta escalera de menos a más esfuerzo:

1. **Mejorar el prompt**: instrucciones claras, ejemplos de entrada y salida (*few-shot*), formato de respuesta definido.
2. **RAG** (*retrieval-augmented generation*): buscar la información relevante en tus documentos y dársela al modelo junto con la pregunta.
3. **Fine-tuning**: cambiar el comportamiento del modelo con ejemplos.

| Quieres… | Mejor opción |
| --- | --- |
| Que responda con información de tus documentos, que cambia a menudo | RAG |
| Que cite fuentes concretas | RAG |
| Un estilo, tono o formato muy consistente | Fine-tuning (o un buen prompt) |
| Que aprenda una tarea muy específica y repetitiva (clasificar tickets, extraer campos) | Fine-tuning |
| Usar un modelo pequeño y barato con la calidad de uno grande en **tu** tarea | Fine-tuning (destilación) |
| Que "sepa" datos nuevos | RAG. El fine-tuning es un mal método para enseñar hechos |

> **Importante:** el fine-tuning enseña **comportamiento**, no conocimiento fiable. Si entrenas con documentación interna esperando que el modelo la recuerde, inventará detalles con mucha seguridad. Para conocimiento, usa RAG.

## Conceptos básicos

- **Modelo base**: entrenado para predecir texto. No sigue instrucciones bien.
- **Modelo instruct / chat**: un modelo base ajustado para seguir instrucciones y conversar. Normalmente partirás de uno de estos.
- **Fine-tuning supervisado (SFT)**: entrenar con pares "entrada → salida ideal".
- **Ajuste por preferencias (DPO y similares)**: entrenar con pares "respuesta mejor / respuesta peor" para afinar el estilo o la calidad.
- **Ajuste completo**: se modifican todos los parámetros. Muy caro en memoria.
- **LoRA / QLoRA**: se congelan los pesos originales y se entrenan pequeñas matrices adicionales. Necesita una fracción de la memoria y los resultados suelen ser muy buenos.

### Dos caminos

| | Fine-tuning en la API de un proveedor | Fine-tuning de un modelo abierto |
| --- | --- | --- |
| Ejemplos | Proveedores de modelos comerciales que ofrecen ajuste en su plataforma | Llama, Mistral, Qwen, Gemma… con Hugging Face |
| Necesitas GPU | No | Sí (propia o alquilada) |
| Control | Limitado | Total: pesos, despliegue, privacidad |
| Esfuerzo | Bajo | Medio-alto |

Revisa siempre la documentación actual del proveedor: los modelos que admiten fine-tuning, los formatos y los precios cambian con frecuencia, y no todos los proveedores lo ofrecen para todos sus modelos.

## Preparar los datos

Los datos son el 80 % del trabajo. Calidad mucho mejor que cantidad: **unos cientos de ejemplos excelentes** suelen funcionar mejor que miles mediocres.

Formato habitual: JSONL (un objeto JSON por línea) con mensajes de conversación.

```json
{"messages": [{"role": "system", "content": "Clasifica el ticket de soporte. Responde solo con JSON."}, {"role": "user", "content": "No puedo entrar, me dice contraseña incorrecta pero la acabo de cambiar"}, {"role": "assistant", "content": "{\"categoria\": \"acceso\", \"prioridad\": \"alta\", \"resumen\": \"Fallo de login tras cambio de contraseña\"}"}]}
{"messages": [{"role": "system", "content": "Clasifica el ticket de soporte. Responde solo con JSON."}, {"role": "user", "content": "¿Podéis enviarme la factura de septiembre con el CIF de mi empresa?"}, {"role": "assistant", "content": "{\"categoria\": \"facturacion\", \"prioridad\": \"baja\", \"resumen\": \"Solicita factura de septiembre con CIF\"}"}]}
```

Lista de comprobación:

- **Representativos**: cubre la variedad real de entradas, incluidos casos difíciles y ambiguos.
- **Consistentes**: el mismo tipo de entrada debe tener el mismo tipo de salida. Si tus ejemplos se contradicen, el modelo aprenderá a dudar.
- **Equilibrados**: si el 90 % son de una categoría, el modelo tenderá a responder esa.
- **Limpios de datos personales**: anonimiza nombres, emails, teléfonos y cualquier dato sensible. Comprueba que tienes derecho a usar esos datos.
- **Separa un conjunto de validación y otro de test** (por ejemplo 80/10/10) que el entrenamiento nunca vea.

```python
import json, random

with open("tickets.jsonl", encoding="utf-8") as f:
    ejemplos = [json.loads(l) for l in f]

random.seed(42)
random.shuffle(ejemplos)
n = len(ejemplos)
particiones = {
    "train": ejemplos[: int(n * 0.8)],
    "valid": ejemplos[int(n * 0.8): int(n * 0.9)],
    "test": ejemplos[int(n * 0.9):],
}
for nombre, datos in particiones.items():
    with open(f"{nombre}.jsonl", "w", encoding="utf-8") as f:
        f.writelines(json.dumps(e, ensure_ascii=False) + "\n" for e in datos)
```

> **Consejo:** puedes usar un modelo grande para generar o ampliar ejemplos (datos sintéticos), pero **revísalos a mano**. Los errores del generador se convierten en errores del modelo ajustado.

## Medir antes de entrenar

Define cómo vas a medir el éxito **antes** de entrenar y mide el punto de partida con el mejor prompt que consigas.

```python
def evaluar(modelo_fn, ejemplos):
    aciertos = formato_ok = 0
    for e in ejemplos:
        esperado = json.loads(e["messages"][-1]["content"])
        respuesta = modelo_fn(e["messages"][:-1])
        try:
            obtenido = json.loads(respuesta)
            formato_ok += 1
            aciertos += obtenido.get("categoria") == esperado["categoria"]
        except json.JSONDecodeError:
            pass
    return {"formato_valido": formato_ok / len(ejemplos), "exactitud_categoria": aciertos / len(ejemplos)}
```

Para tareas abiertas (resúmenes, redacción), combina métricas automáticas con **evaluación humana** a ciegas o con un modelo evaluador guiado por una rúbrica clara.

Si el prompt ya alcanza el objetivo, no necesitas fine-tuning.

## Entrenar con LoRA y Hugging Face

Necesitas una GPU con suficiente memoria. Para modelos de 7–8 mil millones de parámetros con QLoRA (cuantización a 4 bits), bastan unos 16–24 GB de VRAM. Puedes alquilar GPU por horas en plataformas en la nube o usar cuadernos en línea con GPU.

```bash
pip install torch transformers datasets peft trl accelerate bitsandbytes
```

```python
import torch
from datasets import load_dataset
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
from peft import LoraConfig
from trl import SFTConfig, SFTTrainer

base = "un-modelo-instruct-abierto"   # elige uno con licencia compatible con tu uso

tokenizer = AutoTokenizer.from_pretrained(base)
modelo = AutoModelForCausalLM.from_pretrained(
    base,
    quantization_config=BitsAndBytesConfig(load_in_4bit=True, bnb_4bit_compute_dtype=torch.bfloat16),
    device_map="auto",
)

datos = load_dataset("json", data_files={"train": "train.jsonl", "validation": "valid.jsonl"})

lora = LoraConfig(
    r=16,                 # rango: tamaño de las matrices añadidas
    lora_alpha=32,
    lora_dropout=0.05,
    target_modules="all-linear",
    task_type="CAUSAL_LM",
)

config = SFTConfig(
    output_dir="salida-lora",
    num_train_epochs=3,
    per_device_train_batch_size=4,
    gradient_accumulation_steps=4,
    learning_rate=2e-4,
    eval_strategy="steps",
    eval_steps=50,
    logging_steps=10,
    save_strategy="steps",
    save_steps=50,
    load_best_model_at_end=True,
    bf16=True,
)

trainer = SFTTrainer(
    model=modelo,
    args=config,
    train_dataset=datos["train"],
    eval_dataset=datos["validation"],
    processing_class=tokenizer,
    peft_config=lora,
)
trainer.train()
trainer.save_model("adaptador-tickets")
```

`SFTTrainer` aplica la plantilla de chat del modelo a tus mensajes automáticamente. Los nombres exactos de algunos parámetros cambian entre versiones de las librerías: consulta su documentación si algo falla.

### Hiperparámetros clave

| Parámetro | Efecto | Punto de partida |
| --- | --- | --- |
| `learning_rate` | Tamaño de los pasos de aprendizaje | 1e-4 a 2e-4 con LoRA |
| `num_train_epochs` | Vueltas completas a los datos | 1–3; más suele sobreajustar |
| `r` (rango LoRA) | Capacidad del adaptador | 8–32 |
| Tamaño de lote efectivo | Estabilidad del entrenamiento | 16–32 (lote × acumulación) |

## Vigilar el entrenamiento

Observa la **pérdida** (*loss*) de entrenamiento y de validación:

- Ambas bajan: va bien.
- La de entrenamiento baja y la de validación sube: **sobreajuste**. Para antes, reduce épocas o añade datos.
- Ninguna baja: tasa de aprendizaje inadecuada o datos con problemas de formato.

Después, ejecuta tu evaluación con el conjunto de **test** y compárala con el punto de partida. Revisa también ejemplos a mano: las métricas no lo ven todo.

Comprueba que el modelo no ha perdido capacidades generales que necesitas (el llamado *olvido catastrófico*): pruébalo con algunas peticiones fuera de tu tarea.

## Usar y desplegar el modelo

Con LoRA obtienes un **adaptador** pequeño (decenas de MB) que se carga sobre el modelo base:

```python
from peft import PeftModel

base_model = AutoModelForCausalLM.from_pretrained(base, device_map="auto", torch_dtype=torch.bfloat16)
modelo = PeftModel.from_pretrained(base_model, "adaptador-tickets")

mensajes = [
    {"role": "system", "content": "Clasifica el ticket de soporte. Responde solo con JSON."},
    {"role": "user", "content": "La app se cierra al subir una foto desde el móvil"},
]
entrada = tokenizer.apply_chat_template(mensajes, add_generation_prompt=True, return_tensors="pt").to(modelo.device)
salida = modelo.generate(entrada, max_new_tokens=120, do_sample=False)
print(tokenizer.decode(salida[0][entrada.shape[1]:], skip_special_tokens=True))
```

Para producción:

- Fusiona el adaptador con el modelo (`merge_and_unload()`) o sirve varios adaptadores sobre un mismo modelo base.
- Usa servidores de inferencia optimizados como **vLLM**, **TGI** o, para uso local, **Ollama** / **llama.cpp** con modelos cuantizados (GGUF).
- Expón una API y aplica los mismos controles que a cualquier servicio: autenticación, límites de uso y registros.

## Riesgos y buenas prácticas

- **Licencias**: comprueba que la licencia del modelo base permite tu uso (comercial, redistribución) y que tienes derecho a usar los datos de entrenamiento.
- **Privacidad**: un modelo puede memorizar y reproducir fragmentos de sus datos de entrenamiento. Nunca entrenes con datos personales sin anonimizar.
- **Seguridad**: el ajuste puede debilitar las salvaguardas del modelo original. Evalúa también respuestas a peticiones inapropiadas.
- **Versionado**: guarda la versión del modelo base, de los datos, del código y de los hiperparámetros de cada entrenamiento para poder reproducirlo.
- **Coste total**: suma el entrenamiento, la infraestructura de inferencia y el mantenimiento. A veces un modelo comercial con un buen prompt es más barato.

## Proyecto

Clasificador de tickets de soporte:

1. Reúne o genera (y revisa) 300–500 tickets etiquetados con categoría y prioridad.
2. Mide un modelo con prompt *few-shot* como punto de partida.
3. Ajusta un modelo abierto pequeño con QLoRA.
4. Compara exactitud, formato válido, latencia y coste por petición.
5. Escribe una conclusión honesta: ¿compensa el fine-tuning en este caso?

> **Reto:** combina ambos enfoques. Usa el modelo ajustado para clasificar el ticket y RAG sobre tu base de conocimiento para proponer una respuesta al cliente. Automatiza el flujo con [n8n](/lecciones/n8n).
