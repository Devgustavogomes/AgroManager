# AgroManager – Sistema de Cadastro de Produtores Rurais

> **Atenção:** Projeto ainda em desenvolvimento. Algumas funcionalidades podem não estar completas.

---

## 🎯 Objetivo

O **AgroManager** é uma plataforma fullstack destinada ao gerenciamento de **produtores rurais, propriedades, safras e culturas plantadas**.  
O objetivo principal é substituir registros manuais, permitindo **cadastrar, editar e gerar relatórios detalhados** de produtores, áreas cultiváveis e culturas, facilitando o acompanhamento de dados agrícolas e decisões estratégicas.

---

## 🛠 Tecnologias e Ferramentas

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS (ou biblioteca de UI a definir)  
- **Backend:** NestJS, TypeScript, JWT (Autenticação), Swagger (Documentação da API)  
- **Banco de Dados:** PostgreSQL (queries SQL puras ou query builder leve, sem ORM)  
- **Infraestrutura:** Docker, Docker Compose (backend, db)  
- **Testes:** Jest (backend unitário e integração)  
- **CI/CD:** GitHub Actions (testes, build e deploy automático)   

---

## 🚀 Funcionalidades Planejadas

- Cadastro, edição e exclusão de **produtores rurais**  
- Cadastro e gestão de **propriedades** de cada produtor  
- Registro de **safras** e múltiplas **culturas plantadas** por safra  
- Validações importantes:
  - CPF ou CNPJ válido para produtores  
  - Soma das áreas agricultável e de vegetação não ultrapassando a área total da propriedade  
- **Relatórios e dashboards**:
  - Total de fazendas cadastradas  
  - Total de hectares registrados  
  - Gráficos de pizza:
    - Por estado  
    - Por cultura plantada  
    - Por uso do solo (área agricultável vs vegetação)  
- API documentada com **Swagger**  
- Testes unitários e de integração para garantir confiabilidade  
- Logs estruturados para observabilidade do sistema  

---

## 📈 Objetivos de Aprendizado

- Dominar **NestJS e TypeScript** para backend completo  
- Construir e consultar dados com **PostgreSQL sem ORM**  
- Implementar **autenticação segura e roles**  
- Validar regras de negócio e constraints do banco  
- Criar **testes unitários e de integração**  
- Usar **Docker + Docker Compose** para ambientes isolados  
- Documentar a API com **Swagger**  
- Configurar **CI/CD automatizado** e deploy em nuvem  

---

## ⚠️ Status

- Projeto atualmente em **desenvolvimento inicial**.  
- Funcionalidades de dashboard e relatórios detalhados ainda em construção.  
- README atualizado conforme o projeto evoluirá.
