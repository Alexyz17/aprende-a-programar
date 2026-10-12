# Máquinas virtuales con Linux

> Una máquina virtual (VM) es un ordenador completo que funciona dentro de tu ordenador. Es la forma más segura de practicar administración de sistemas: puedes romperlo todo y volver atrás en segundos. En este curso montarás servidores Linux virtuales, configurarás su red, te conectarás por SSH y automatizarás su creación.

## Qué es la virtualización

Un **hipervisor** reparte los recursos físicos (CPU, memoria, disco, red) entre varias máquinas virtuales aisladas. Cada VM cree que tiene su propio hardware y ejecuta su propio sistema operativo.

| Tipo | Funciona sobre | Ejemplos | Uso típico |
| --- | --- | --- | --- |
| Tipo 1 (*bare metal*) | El hardware directamente | KVM, Proxmox VE, VMware ESXi, Hyper-V | Servidores, centros de datos, nube |
| Tipo 2 (alojado) | Un sistema operativo | VirtualBox, VMware Workstation, UTM, GNOME Boxes | Escritorio, laboratorio personal |

Las instancias que alquilas en AWS, Google Cloud o cualquier proveedor son máquinas virtuales sobre hipervisores de tipo 1.

### VM frente a contenedor

| | Máquina virtual | Contenedor ([Docker](/lecciones/docker)) |
| --- | --- | --- |
| Incluye | Sistema operativo completo con su núcleo | Solo la aplicación y sus librerías; comparte el núcleo del host |
| Arranque | Decenas de segundos | Menos de un segundo |
| Tamaño | Gigas | Megas |
| Aislamiento | Muy fuerte | Fuerte, pero comparte núcleo |
| Ideal para | Probar sistemas operativos, laboratorios, aislar entornos completos | Empaquetar y desplegar aplicaciones |

No compiten: en producción es muy habitual ejecutar contenedores **dentro** de máquinas virtuales.

## Requisitos e instalación

1. Activa la **virtualización por hardware** en la BIOS/UEFI (Intel VT-x o AMD-V). En Windows, el Administrador de tareas → Rendimiento → CPU indica si está habilitada.
2. Instala un hipervisor:
   - **Windows / Linux (Intel/AMD)**: [VirtualBox](https://www.virtualbox.org/) (gratuito).
   - **Mac con Apple Silicon**: [UTM](https://mac.getutm.app/) o VMware Fusion. Usa imágenes **ARM64** de Linux.
   - **Linux**: KVM con `virt-manager` ofrece el mejor rendimiento.
3. Descarga una imagen ISO de **Ubuntu Server LTS** o **Debian**.

Recursos razonables para un servidor de prácticas: 2 CPU, 2–4 GB de RAM y 20 GB de disco dinámico (solo ocupa lo que se usa).

## Crear tu primera VM

En VirtualBox:

1. **Nueva** → nombre `web01`, tipo Linux, versión Ubuntu (64-bit), selecciona la ISO.
2. Asigna memoria y CPU.
3. Crea un disco virtual VDI de reserva dinámica.
4. Arranca e instala Ubuntu Server. Durante la instalación:
   - Marca **Install OpenSSH server**.
   - Crea tu usuario con una contraseña robusta.
5. Al terminar, reinicia y entra con tu usuario.

Primeros comandos en cualquier servidor nuevo:

```bash
sudo apt update && sudo apt full-upgrade -y   # actualizar el sistema
hostnamectl                                   # nombre y versión del sistema
ip -brief address                             # direcciones IP
df -h                                         # espacio en disco
free -h                                       # memoria
```

Si todavía no te mueves con soltura por la terminal, repasa [Introducción a Linux](/lecciones/linux-esencial).

## Redes virtuales

La configuración de red decide **quién puede hablar con la VM**.

| Modo | La VM sale a internet | El host llega a la VM | Otras VM | Para qué |
| --- | --- | --- | --- | --- |
| NAT | Sí | Solo con redirección de puertos | No | Lo más sencillo, por defecto |
| Red NAT | Sí | Con redirección de puertos | Sí | Varias VM que se ven entre sí |
| Solo anfitrión (*host-only*) | No | Sí | Sí | Laboratorio aislado |
| Adaptador puente (*bridged*) | Sí | Sí | Sí | La VM aparece como un equipo más de tu red |
| Red interna | No | No | Sí | Redes totalmente aisladas |

Configuración recomendada para prácticas: **dos adaptadores**.

- Adaptador 1: **NAT** (para tener internet).
- Adaptador 2: **Solo anfitrión** (para conectarte desde tu ordenador con una IP fija).

### IP fija con Netplan (Ubuntu)

```yaml
# /etc/netplan/50-lab.yaml
network:
  version: 2
  ethernets:
    enp0s8:                    # el segundo adaptador (compruébalo con ip -brief link)
      dhcp4: false
      addresses: [192.168.56.10/24]
```

```bash
sudo chmod 600 /etc/netplan/50-lab.yaml
sudo netplan try      # aplica y revierte solo si pierdes la conexión
sudo netplan apply
```

Desde tu ordenador: `ping 192.168.56.10`.

## Conectarte por SSH

Trabajar en la ventana de la VM es incómodo. Lo normal es conectarse por **SSH** desde tu terminal (en Windows, PowerShell o Windows Terminal ya traen el cliente).

```bash
ssh alex@192.168.56.10
```

### Claves SSH en lugar de contraseñas

```bash
# En tu ordenador
ssh-keygen -t ed25519 -C "alex@portatil"
ssh-copy-id alex@192.168.56.10      # en Windows: copia ~/.ssh/id_ed25519.pub a mano en ~/.ssh/authorized_keys
```

Crea un alias en `~/.ssh/config`:

```text
Host web01
    HostName 192.168.56.10
    User alex
    IdentityFile ~/.ssh/id_ed25519
```

Ahora basta con `ssh web01`. Copiar archivos:

```bash
scp informe.txt web01:/home/alex/
rsync -avz ./mi-web/ web01:/var/www/mi-web/
```

### Endurecer SSH

Una vez que entras con clave, desactiva las contraseñas y el acceso directo de root:

```text
# /etc/ssh/sshd_config.d/10-seguro.conf
PasswordAuthentication no
PermitRootLogin no
```

```bash
sudo sshd -t && sudo systemctl reload ssh   # comprueba la sintaxis antes de recargar
```

> **Atención:** antes de desactivar las contraseñas, comprueba en **otra terminal** que puedes entrar con tu clave. Si te equivocas, en una VM local siempre puedes entrar por la consola; en un servidor remoto te quedarías fuera.

## Instantáneas y clonación

Las **instantáneas** (*snapshots*) guardan el estado completo de la VM en un momento dado.

Flujo de trabajo recomendado:

1. Instala el sistema y actualízalo.
2. Haz una instantánea: "Sistema base".
3. Practica lo que quieras (instalar servicios, romper configuraciones…).
4. Si algo sale mal, **restaura** la instantánea y vuelves al estado limpio en segundos.

Desde la línea de comandos de VirtualBox:

```bash
VBoxManage snapshot web01 take "base" --description "Ubuntu recién instalado"
VBoxManage snapshot web01 restore "base"
VBoxManage clonevm web01 --name web02 --register --mode machine
```

> **Nota:** las instantáneas no son copias de seguridad: dependen del disco original. Para conservar una VM, expórtala (`Archivo → Exportar servicio virtualizado`, formato OVA).

## Montar un servidor web

Convierte la VM en un servidor real:

```bash
sudo apt install -y nginx
sudo systemctl enable --now nginx
systemctl status nginx
```

Abre `http://192.168.56.10` en el navegador de tu ordenador y verás la página de bienvenida de Nginx.

Publica tu propia web:

```bash
sudo mkdir -p /var/www/miweb
echo '<h1>Hola desde mi VM</h1>' | sudo tee /var/www/miweb/index.html
```

```nginx
# /etc/nginx/sites-available/miweb
server {
    listen 80;
    server_name _;
    root /var/www/miweb;
    index index.html;
}
```

```bash
sudo ln -s /etc/nginx/sites-available/miweb /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

### Cortafuegos

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx HTTP'
sudo ufw enable
sudo ufw status verbose
```

Regla de oro: **permite primero SSH y después activa el cortafuegos**.

## Gestionar servicios y registros

```bash
systemctl status nginx          # estado
sudo systemctl restart nginx    # reiniciar
sudo systemctl enable nginx     # arrancar al iniciar el sistema
journalctl -u nginx -f          # registros en tiempo real
journalctl -p err --since today # solo errores de hoy
ss -tulpn                       # qué procesos escuchan en qué puertos
```

Para tu propia aplicación, crea un servicio de systemd:

```ini
# /etc/systemd/system/miapp.service
[Unit]
Description=Mi API en Node.js
After=network.target

[Service]
User=www-data
WorkingDirectory=/opt/miapp
ExecStart=/usr/bin/node src/server.js
Restart=on-failure
Environment=NODE_ENV=production PORT=3000

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now miapp
```

## Automatizar con Vagrant

Crear VMs a mano no escala. **Vagrant** describe la máquina en un archivo de texto y la crea con un comando, igual en el ordenador de cualquier persona del equipo.

```ruby
# Vagrantfile
Vagrant.configure("2") do |config|
  config.vm.box = "bento/ubuntu-24.04"
  config.vm.hostname = "web01"
  config.vm.network "private_network", ip: "192.168.56.10"
  config.vm.synced_folder "./sitio", "/var/www/miweb"

  config.vm.provider "virtualbox" do |vb|
    vb.memory = 2048
    vb.cpus = 2
  end

  config.vm.provision "shell", inline: <<-SHELL
    apt-get update
    apt-get install -y nginx
    systemctl enable --now nginx
  SHELL
end
```

```bash
vagrant up          # crea y configura la VM
vagrant ssh         # entra
vagrant halt        # apaga
vagrant destroy -f  # borra
```

Varias máquinas en el mismo archivo permiten simular una arquitectura real (balanceador, dos servidores web y una base de datos) en tu portátil.

> **Consejo:** para configuraciones más complejas, el siguiente paso es **Ansible**: describes el estado deseado de tus servidores (paquetes, archivos, servicios) en YAML y lo aplicas a una o a cien máquinas. Funciona igual con VMs locales que con servidores en la nube.

## Rendimiento y solución de problemas

| Problema | Causa probable | Solución |
| --- | --- | --- |
| La VM va muy lenta | Falta virtualización por hardware o poca RAM | Actívala en la BIOS; en Windows, revisa conflictos con Hyper-V |
| No hay internet en la VM | Adaptador NAT desactivado | Revisa la configuración de red y `ip route` |
| No llego a la VM desde el host | Falta el adaptador solo anfitrión o el cortafuegos bloquea | `ip -brief address`, `sudo ufw status` |
| El disco se ha llenado | Disco virtual pequeño | Amplíalo con `VBoxManage modifymedium --resize` y luego el sistema de archivos |
| La pantalla tiene baja resolución | Faltan las Guest Additions | Instálalas (en servidores sin entorno gráfico no hacen falta) |

## Proyecto: laboratorio de tres máquinas

Construye con Vagrant:

1. **db01**: PostgreSQL escuchando solo en la red privada.
2. **app01**: una API (por ejemplo la de [Node.js y Express](/lecciones/node-express)) como servicio de systemd que se conecta a `db01`.
3. **proxy01**: Nginx como proxy inverso hacia `app01`, único con el puerto 80 accesible.

Requisitos: acceso solo por clave SSH, cortafuegos activo en las tres y una instantánea de cada máquina antes de cada cambio grande.

> **Reto:** destruye el laboratorio con `vagrant destroy -f` y recréalo con `vagrant up`. Si todo vuelve a funcionar sin pasos manuales, has conseguido **infraestructura reproducible**, la base de todo el trabajo de DevOps. Sigue con [Docker desde cero](/lecciones/docker).
