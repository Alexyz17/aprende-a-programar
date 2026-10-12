# Kubernetes desde cero

> Kubernetes (K8s) orquesta contenedores: decide en qué máquina se ejecuta cada uno, los reinicia si fallan, los escala con la carga y los actualiza sin cortes. Es el estándar para operar aplicaciones en producción a escala. Necesitas conocer [Docker](/lecciones/docker) antes de empezar.

## Por qué Kubernetes

Con Docker ejecutas contenedores en **una** máquina. En producción aparecen preguntas nuevas:

- ¿Qué pasa si el servidor se cae?
- ¿Cómo ejecuto 10 copias y reparto el tráfico?
- ¿Cómo actualizo a una versión nueva sin dejar de dar servicio?
- ¿Cómo gestiono la configuración y los secretos de 30 servicios?

Kubernetes responde a todas con un modelo **declarativo**: describes el estado que quieres ("3 réplicas de la imagen `api:1.4`, accesibles en el puerto 80") y Kubernetes trabaja continuamente para que la realidad coincida.

> **Nota:** Kubernetes añade bastante complejidad. Para una aplicación pequeña, un servidor con Docker Compose o una plataforma gestionada puede ser mejor opción. Kubernetes compensa cuando hay varios servicios, varios equipos o necesidades de alta disponibilidad.

## Arquitectura

```text
                 ┌────────────── Plano de control ───────────────┐
 kubectl ──────▶ │ API server · scheduler · controller manager · etcd │
                 └──────────────────────┬─────────────────────────┘
                                        │
          ┌─────────────────────────────┼─────────────────────────────┐
          ▼                             ▼                             ▼
   ┌─────────────┐              ┌─────────────┐               ┌─────────────┐
   │   Nodo 1    │              │   Nodo 2    │               │   Nodo 3    │
   │ kubelet     │              │ kubelet     │               │ kubelet     │
   │ [pod][pod]  │              │ [pod]       │               │ [pod][pod]  │
   └─────────────┘              └─────────────┘               └─────────────┘
```

- **API server**: la puerta de entrada; todo (incluido `kubectl`) habla con él.
- **etcd**: base de datos clave-valor con el estado del clúster.
- **Scheduler**: decide en qué nodo va cada pod.
- **Controllers**: bucles que comparan el estado deseado con el real y corrigen las diferencias.
- **Nodos**: las máquinas que ejecutan los contenedores; el **kubelet** de cada nodo arranca y vigila los pods.

## Un clúster para practicar

Opciones locales gratuitas:

- **kind** (Kubernetes in Docker): `kind create cluster`.
- **minikube**: `minikube start`.
- **k3d** / **k3s**: distribución ligera, ideal también para servidores pequeños.
- **Docker Desktop**: tiene una opción para activar Kubernetes.

Instala también `kubectl`, el cliente de línea de comandos:

```bash
kubectl version --client
kubectl cluster-info
kubectl get nodes
```

Comandos que usarás a diario:

```bash
kubectl get pods                       # listar (también: deploy, svc, ingress, all)
kubectl get pods -o wide -w            # más columnas y en tiempo real
kubectl describe pod <nombre>          # detalle y eventos: lo primero ante un problema
kubectl logs <pod> -f                  # registros
kubectl logs deploy/api --previous     # registros del contenedor anterior (tras un fallo)
kubectl exec -it <pod> -- sh           # entrar en el contenedor
kubectl apply -f k8s/                  # crear o actualizar desde archivos
kubectl delete -f k8s/
kubectl port-forward svc/api 8080:80   # acceder a un servicio desde tu ordenador
```

## Pods

El **pod** es la unidad mínima: uno o varios contenedores que comparten red y almacenamiento. Casi nunca se crean a mano, pero conviene ver uno:

```yaml
# pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: hola
  labels:
    app: hola
spec:
  containers:
    - name: web
      image: nginx:1.27-alpine
      ports:
        - containerPort: 80
```

```bash
kubectl apply -f pod.yaml
kubectl port-forward pod/hola 8080:80   # abre http://localhost:8080
kubectl delete pod hola
```

Si borras un pod creado así, desaparece para siempre. Para que Kubernetes lo mantenga vivo se usa un Deployment.

## Deployments

Un **Deployment** mantiene un número de réplicas de un pod y gestiona las actualizaciones.

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  labels:
    app: api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
        - name: api
          image: registry.gitlab.com/mi-usuario/api:1.4.0
          ports:
            - containerPort: 3000
          resources:
            requests: { cpu: 100m, memory: 128Mi }
            limits: { memory: 256Mi }
          readinessProbe:
            httpGet: { path: /health, port: 3000 }
            periodSeconds: 5
          livenessProbe:
            httpGet: { path: /health, port: 3000 }
            initialDelaySeconds: 10
            periodSeconds: 10
```

- Las **etiquetas** (`labels`) conectan las piezas: el Deployment gestiona los pods con `app: api`.
- **requests**: recursos garantizados (el scheduler los usa para elegir nodo). **limits**: máximo permitido; si el contenedor supera la memoria, se reinicia.
- **readinessProbe**: el pod no recibe tráfico hasta que responde bien.
- **livenessProbe**: si deja de responder, Kubernetes lo reinicia.

### Actualizaciones sin cortes

```bash
kubectl set image deploy/api api=registry.gitlab.com/mi-usuario/api:1.5.0
kubectl rollout status deploy/api      # sigue el despliegue
kubectl rollout history deploy/api
kubectl rollout undo deploy/api        # vuelve a la versión anterior
kubectl scale deploy/api --replicas=5
```

Por defecto la estrategia es **RollingUpdate**: crea pods nuevos, espera a que estén listos (readiness) y retira los viejos poco a poco.

> **Consejo:** usa siempre etiquetas de imagen concretas (`1.5.0` o el hash del commit), nunca `latest`. Así sabes exactamente qué versión está desplegada y puedes volver atrás.

## Services: red estable

Los pods aparecen y desaparecen, y cada uno tiene una IP distinta. Un **Service** da una dirección estable y reparte el tráfico entre los pods que coinciden con su selector.

```yaml
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: api
spec:
  selector:
    app: api
  ports:
    - port: 80          # puerto del servicio
      targetPort: 3000  # puerto del contenedor
```

Dentro del clúster, cualquier pod puede llamar a `http://api` (o `http://api.<namespace>.svc.cluster.local`) gracias al DNS interno.

| Tipo de Service | Accesible desde |
| --- | --- |
| `ClusterIP` (por defecto) | Solo dentro del clúster |
| `NodePort` | Un puerto alto en cada nodo |
| `LoadBalancer` | Una IP pública del proveedor cloud |

## Ingress: entrada HTTP desde fuera

Un **Ingress** enruta el tráfico HTTP(S) externo a los servicios según el dominio y la ruta. Necesita un *ingress controller* instalado (ingress-nginx, Traefik…).

```yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt
spec:
  ingressClassName: nginx
  tls:
    - hosts: [app.ejemplo.com]
      secretName: app-tls
  rules:
    - host: app.ejemplo.com
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service: { name: api, port: { number: 80 } }
          - path: /
            pathType: Prefix
            backend:
              service: { name: frontend, port: { number: 80 } }
```

Con **cert-manager**, los certificados HTTPS de Let's Encrypt se emiten y renuevan solos.

> **Nota:** la nueva **Gateway API** es la evolución de Ingress, más expresiva y estandarizada. Muchos proyectos nuevos ya la usan; los conceptos (rutas por host y ruta hacia servicios) son los mismos.

## Configuración y secretos

Separa la configuración de la imagen: la misma imagen se despliega en desarrollo, pruebas y producción.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: api-config
data:
  LOG_LEVEL: info
  FEATURE_NUEVO_CHECKOUT: "false"
---
apiVersion: v1
kind: Secret
metadata:
  name: api-secrets
type: Opaque
stringData:
  DATABASE_URL: postgres://usuario:clave@db:5432/app
```

```yaml
# En el contenedor del Deployment
envFrom:
  - configMapRef: { name: api-config }
  - secretRef: { name: api-secrets }
```

> **Importante:** los Secrets solo están codificados en base64, no cifrados. No los subas a Git en claro. Opciones habituales: **Sealed Secrets**, **SOPS** o **External Secrets** conectado a un gestor de secretos (Vault, AWS Secrets Manager…).

## Almacenamiento persistente

Los contenedores pierden sus archivos al reiniciarse. Para datos que deben durar, se pide un volumen con un **PersistentVolumeClaim**:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: subidas
spec:
  accessModes: [ReadWriteOnce]
  resources:
    requests:
      storage: 5Gi
```

```yaml
# En el pod
volumes:
  - name: subidas
    persistentVolumeClaim: { claimName: subidas }
containers:
  - name: api
    volumeMounts:
      - name: subidas
        mountPath: /app/storage
```

Las bases de datos se ejecutan con **StatefulSets** (identidad y disco estables por réplica). Aun así, en muchos equipos se prefiere una base de datos gestionada fuera del clúster: operarla bien dentro de Kubernetes requiere experiencia.

## Namespaces y otros recursos

Los **namespaces** separan entornos o equipos dentro del mismo clúster:

```bash
kubectl create namespace staging
kubectl apply -f k8s/ -n staging
kubectl config set-context --current --namespace=staging
```

| Recurso | Para qué |
| --- | --- |
| `Job` | Una tarea que se ejecuta hasta terminar (una migración) |
| `CronJob` | Tareas programadas (copias de seguridad cada noche) |
| `DaemonSet` | Un pod en cada nodo (recolectores de logs, monitorización) |
| `HorizontalPodAutoscaler` | Escalar réplicas según CPU, memoria o métricas propias |
| `NetworkPolicy` | Qué pods pueden hablar con cuáles |

Autoescalado:

```bash
kubectl autoscale deploy/api --cpu-percent=70 --min=2 --max=10
```

## Helm: paquetes de Kubernetes

Una aplicación real tiene muchos archivos YAML casi iguales entre entornos. **Helm** los convierte en plantillas parametrizables (*charts*):

```text
api-chart/
├── Chart.yaml
├── values.yaml          # valores por defecto
├── values-prod.yaml     # valores de producción
└── templates/
    ├── deployment.yaml
    ├── service.yaml
    └── ingress.yaml
```

```yaml
# templates/deployment.yaml (fragmento)
spec:
  replicas: {{ .Values.replicaCount }}
  template:
    spec:
      containers:
        - name: api
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
```

```bash
helm install api ./api-chart -n staging
helm upgrade api ./api-chart -n prod -f values-prod.yaml --set image.tag=1.5.0
helm rollback api 1 -n prod
helm list -A
```

Helm también instala software de terceros con un comando: `helm install monitor prometheus-community/kube-prometheus-stack`.

## GitOps y CI/CD

En **GitOps**, el repositorio es la fuente de la verdad: lo que está en Git es lo que corre en el clúster. Herramientas como **Argo CD** o **Flux** vigilan el repositorio y aplican los cambios automáticamente.

Un flujo típico:

1. Haces push de código → la CI ejecuta tests y construye la imagen `api:<sha>`.
2. La CI actualiza la etiqueta de la imagen en el repositorio de despliegue (los `values` de Helm).
3. Argo CD detecta el cambio y sincroniza el clúster.
4. Volver atrás es tan sencillo como revertir un commit.

Lo puedes automatizar con [GitHub Actions](/lecciones/github-actions) o GitLab CI.

## Depurar problemas

| Estado del pod | Significa | Mira |
| --- | --- | --- |
| `Pending` | No hay nodo con recursos suficientes o falta el volumen | `kubectl describe pod` → Events |
| `ImagePullBackOff` | No puede descargar la imagen: nombre mal escrito o falta el secreto del registro | Nombre de la imagen, `imagePullSecrets` |
| `CrashLoopBackOff` | El contenedor arranca y se cae una y otra vez | `kubectl logs --previous` |
| `Running` pero sin tráfico | La readiness falla o el Service no selecciona los pods | `kubectl get endpoints api`, etiquetas |
| `OOMKilled` | Superó el límite de memoria | Sube el límite o corrige la fuga de memoria |

> **Consejo:** `kubectl describe` y `kubectl get events --sort-by=.lastTimestamp` resuelven la mayoría de los misterios. Léelos antes de buscar en internet.

## Proyecto final

Despliega en un clúster local con kind:

1. Una API (por ejemplo la de [Node.js y Express](/lecciones/node-express)) con 3 réplicas, probes y límites de recursos.
2. Una base de datos PostgreSQL con un PVC.
3. Configuración en un ConfigMap y la contraseña en un Secret.
4. Un Ingress que publique la API en `api.localhost`.
5. Un HorizontalPodAutoscaler.
6. Empaquétalo todo como un chart de Helm con valores para `dev` y `prod`.

> **Reto:** haz una actualización de versión mientras lanzas peticiones continuas con `while true; do curl -s api.localhost/health; done`. Si no aparece ningún error durante el despliegue, has conseguido un *zero-downtime deployment*. Después, estudia cómo dividir la aplicación en [Diseño de microservicios](/lecciones/microservicios-diseno).
