# SkillHub – Plataforma de Perfis Profissionais para Desenvolvedores

> **Atenção:** Projeto ainda em desenvolvimento. Algumas funcionalidades podem não estar completas.

---

## 🎯 Objetivo

O **SkillHub** é uma plataforma fullstack destinada a desenvolvedores criarem perfis profissionais, exibirem suas **skills**, projetos e currículos, além de interagirem por meio de **chat privado** em tempo real.  
O objetivo principal é servir como **portfólio dinâmico e interativo**, demonstrando habilidades técnicas no desenvolvimento frontend, backend, banco de dados e infraestrutura.

---

## 🛠 Tecnologias e Ferramentas

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS (ou biblioteca de UI a definir)  
- **Backend:** NestJS, TypeScript, JWT + Refresh Tokens (Autenticação), WebSockets (Chat em tempo real)  
- **Banco de Dados:** PostgreSQL (queries SQL puras ou query builder leve)  
- **Cache:** Redis (para buscas e dados de alto acesso)  
- **Documentação da API:** Swagger  
- **Infraestrutura:** Docker, Docker Compose (frontend, backend, db, redis, nginx opcional)  
- **Testes:** Jest + React Testing Library (frontend), Jest (backend unitário e integração)  
- **CI/CD:** GitHub Actions (testes, build e deploy automático)  
- **Deploy:**  
  - Frontend → Vercel  
  - Backend + DB + Redis → Railway, Render ou VPS com Docker  

---

## 🚀 Funcionalidades Planejadas

- Cadastro e login de usuários com autenticação segura (JWT + Refresh Token)  
- Perfis públicos com:
  - Foto, bio e informações pessoais  
  - Skills (tagueamento)  
  - Projetos (descrição, links, screenshots)  
  - Currículo (upload PDF)  
- Busca de usuários por skills, com cache Redis para performance  
- Chat privado em tempo real entre usuários (via WebSockets)  
- Dashboard de edição de perfil, adição de projetos e gerenciamento de currículos  
- Histórico de alterações em projetos e tarefas  
- API documentada com Swagger  
- Testes unitários e de integração para frontend e backend  
- Deploy automatizado via CI/CD  

---
## 📈 Objetivos de Aprendizado

- Dominar **Next.js e React** com TypeScript  
- Construir um **backend completo** com NestJS  
- Modelar e consultar dados com **PostgreSQL sem ORM**  
- Implementar **autenticação JWT e roles**  
- Trabalhar com **WebSockets para funcionalidades em tempo real**  
- Usar **cache com Redis**  
- Documentar API com **Swagger**  
- Criar **testes unitários e integração**  
- Configurar **Docker + Docker Compose**  
- Implementar **CI/CD automatizado** e deploy em nuvem  

---

## ⚠️ Status

- Projeto atualmente em **desenvolvimento inicial**.  
- Funcionalidades de chat, upload de currículo e dashboard ainda em construção.  
- README atualizado conforme o projeto evoluirá.  

---

