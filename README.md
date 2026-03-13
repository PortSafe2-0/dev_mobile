# 📱 PortSafe Mobile

Aplicativo mobile do ecossistema **PortSafe 2.0**, desenvolvido como
parte do **Projeto Interdisciplinar (PI3)**.

O aplicativo permite que moradores e entregadores interajam com o
sistema de **armários inteligentes conectados via IoT**, possibilitando
o gerenciamento e retirada de encomendas em condomínios de forma
**segura, automatizada e monitorada em tempo real**.

------------------------------------------------------------------------

# 🚀 Sobre o Projeto

O **PortSafe 2.0** é uma plataforma inteligente para gestão de entregas
em condomínios que integra:

-   📱 Aplicativo Mobile
-   🤖 Armários inteligentes (IoT)
-   ☁️ Infraestrutura em nuvem (AWS)
-   📡 Comunicação em tempo real via MQTT
-   🔔 Notificações push

O aplicativo mobile é a interface principal entre **usuários e o
sistema**, permitindo registrar entregas, receber notificações e abrir
armários inteligentes.

------------------------------------------------------------------------

# 🎯 Objetivo do Módulo Mobile

O aplicativo tem como objetivo permitir que:

### 👤 Moradores

-   Realizem login no sistema
-   Recebam **notificações quando uma encomenda chegar**
-   Visualizem **QR Code para retirada**
-   Consultem **histórico de entregas**
-   Realizem **abertura remota do armário**

### 🚚 Entregadores

-   Busquem moradores pelo **número do apartamento**
-   Registrem **entregas no sistema**
-   Escaneiem **QR Codes**
-   Confirmem entregas realizadas

------------------------------------------------------------------------

# 🧠 Arquitetura do Sistema

O aplicativo faz parte de uma arquitetura distribuída baseada em **IoT +
Cloud + Mobile**.

Sensores / Armário IoT ↓ MQTT Broker ↓ Backend API ↓ Cloud (AWS) ↓
Aplicativo Mobile ↓ Usuário (Morador / Entregador)

------------------------------------------------------------------------

# 🏗 Tecnologias Utilizadas

Tecnologias previstas para o desenvolvimento do aplicativo:

-   React Native
-   Expo
-   Firebase Cloud Messaging (FCM) -- Push notifications
-   Axios -- Consumo de APIs
-   React Navigation -- Navegação entre telas
-   QR Code Scanner
-   API REST

------------------------------------------------------------------------

# 🔄 Fluxo de Funcionamento

### 📦 Registro de entrega

1.  Entregador registra entrega no aplicativo\
2.  O aplicativo envia os dados para a **API Backend**\
3.  O backend registra no banco de dados\
4.  O morador recebe **notificação push**

### 📦 Retirada da encomenda

1.  Morador abre o aplicativo\
2.  Visualiza a encomenda recebida\
3.  Escaneia o **QR Code do armário**\
4.  O aplicativo envia solicitação para a API\
5.  O backend envia comando via **MQTT**\
6.  O **ESP32 abre o armário automaticamente**

------------------------------------------------------------------------

# 🔔 Notificações

O sistema utiliza **Firebase Cloud Messaging (FCM)** para envio de
notificações como:

-   📦 Nova encomenda recebida
-   ⏰ Lembrete de retirada
-   ⚠️ Problema no armário

------------------------------------------------------------------------

# ☁️ Integração com a Nuvem

O aplicativo se comunica com a infraestrutura em nuvem:

-   API Gateway
-   Backend
-   Banco de dados (PostgreSQL / RDS)
-   Serviços de IoT

------------------------------------------------------------------------

# 🔗 Integração com Outros Módulos

Este repositório faz parte do ecossistema **PortSafe 2.0**, que possui
os seguintes módulos:

  Módulo      Função
  ----------- -----------------------------------------
  IoT         Controle dos armários inteligentes
  Backend     APIs e lógica de negócio
  Cloud       Infraestrutura em nuvem
  Mobile      Interface para moradores e entregadores
  Dashboard   Monitoramento administrativo

------------------------------------------------------------------------

# 🎓 Projeto Acadêmico

Este projeto foi desenvolvido para a disciplina de **Desenvolvimento
Mobile**, integrando o **Projeto Interdisciplinar (PI3)** do curso de
tecnologia.

------------------------------------------------------------------------

# 📌 Status do Projeto

🚧 Em desenvolvimento
