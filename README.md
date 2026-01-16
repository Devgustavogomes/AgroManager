# AgroManager – Sistema de Cadastro de Produtores Rurais

> **Atenção:** Projeto ainda em desenvolvimento. Algumas funcionalidades podem não estar completas.

---

## 🎯 Objetivo

O **AgroManager** é uma plataforma fullstack destinada ao gerenciamento de **produtores rurais, propriedades, safras e culturas plantadas**.
Este repo é parte backend do projeto.
O objetivo principal é substituir registros manuais, permitindo **cadastrar, editar e gerar relatórios detalhados** de produtores, áreas cultiváveis e culturas, facilitando o acompanhamento de dados agrícolas e decisões estratégicas.

---
## 🌐 Acesse o site

O AgroManager está disponível online! Você pode conferir o deploy ou explorar a documentação da API:

- **Deploy do site:** [Clique aqui para acessar](https://agromanager-e1tb.onrender.com/)  
- **Documentação da API:** [Veja os endpoints e exemplos](https://agromanager-e1tb.onrender.com/api)  

Explore o site, teste as funcionalidades e consulte a documentação para entender todos os recursos disponíveis.

---
## 🛠 Tecnologias e Ferramentas

- **Backend:** NestJS, TypeScript, JWT (Autenticação), Swagger (Documentação da API)  
- **Banco de Dados:** PostgreSQL 
- **Infraestrutura:** Docker, Docker Compose, Nginx
- **Testes:** Vitest (Unitário, Integração e E2E) 
- **CI/CD:** GitHub Actions (testes, build e deploy automático)   

---

## 🚀 Funcionalidades Planejadas

- Cadastro, edição e exclusão de **produtores rurais**  
- Cadastro e gestão de **propriedades** de cada produtor  
- Registro de **safras** e múltiplas **culturas plantadas** por safra  
- Validações importantes:
  - CPF válido para produtores  
  - Soma das áreas agricultável e de vegetação não ultrapassando a área total da propriedade  
- **Relatório**:
  - Total de fazendas cadastradas  
  - Total de hectares registrados  
  - Gráfico:
    - Por estado  
    - Por cultura plantada  
    - Por uso do solo (área agricultável vs vegetação)  
- API documentada com **Swagger**  
- Testes unitários, integração e E2E para garantir confiabilidade  
- Logs estruturados para observabilidade do sistema  

---

## 📈 Objetivos de Aprendizado

- Dominar **NestJS e TypeScript** para backend completo  
- Construir e consultar dados para treinar SQL com **PostgreSQL**  
- Implementar **autenticação segura e roles**  
- Validar regras de negócio
- Criar **testes unitários,integração e E2E** de todos os modulos
- Usar **Docker + Docker Compose** para ambientes isolados  
- Documentar a API com **Swagger**  
- Configurar **CI/CD automatizado** e deploy em nuvem

Esse projeto como um todo é feito para eu treinar minhas hard skills, com um tempo vai haver bastante modificação, oque é natural e vai demonstrar minha evolução

---

## ⚠️ Status

- Projeto atualmente em **desenvolvimento inicial**.  
- Funcionalidades de relatórios detalhados ainda em construção.  
- README atualizado conforme o projeto evoluirá.
