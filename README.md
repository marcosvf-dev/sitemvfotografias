# MV Fotografia — Site Profissional

Site completo com painel admin, formulário que envia e-mail, SEO otimizado e galeria avançada.

---

## 🚀 Como rodar localmente

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env`:
```
EMAIL_USER=seuemail@gmail.com
EMAIL_PASS=sua_app_password_do_gmail
EMAIL_TO=seuemail@gmail.com
ADMIN_PASSWORD=SuaSenhaSegura123
PORT=3000
```

#### Como obter o App Password do Gmail:
1. Acesse myaccount.google.com
2. Segurança → Verificação em duas etapas (ative se não tiver)
3. Senhas de app → Criar → Escolha "Outro" → nome "MV Fotografia"
4. Copie a senha de 16 caracteres e coloque em `EMAIL_PASS`

### 3. Rodar
```bash
npm start
# ou para desenvolvimento:
npm run dev
```

Site: http://localhost:3000  
Admin: http://localhost:3000/admin

---

## 📦 Deploy no Render (gratuito)

### 1. Enviar para GitHub
```bash
git init
git add .
git commit -m "Site MV Fotografia"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/mv-fotografia.git
git push -u origin main
```

### 2. Criar serviço no Render
1. Acesse render.com → New → Web Service
2. Conecte seu repositório GitHub
3. Configure:
   - **Name:** mv-fotografia
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`

### 3. Variáveis de ambiente no Render
Em "Environment Variables", adicione:
```
EMAIL_USER    → seuemail@gmail.com
EMAIL_PASS    → sua_app_password
EMAIL_TO      → seuemail@gmail.com
ADMIN_PASSWORD → SuaSenhaSegura123
NODE_ENV      → production
```

### 4. Deploy automático
A cada `git push`, o Render faz o deploy automaticamente.

---

## 🎛️ Painel Admin

Acesse `/admin` e use a senha definida em `ADMIN_PASSWORD`.

### O que você pode fazer no admin:
- ✅ Trocar foto do hero e sobre
- ✅ Editar todos os textos do site
- ✅ Criar múltiplas galerias
- ✅ Adicionar / remover fotos por galeria
- ✅ Reordenar fotos (arrastar e soltar)
- ✅ Editar títulos de cada foto
- ✅ Editar serviços (nome, descrição, itens)
- ✅ Adicionar / remover pacotes de preço
- ✅ Marcar itens ativos/inativos por pacote
- ✅ Editar depoimentos
- ✅ Atualizar contatos e redes sociais

---

## 📁 Estrutura do projeto

```
mv-fotografia/
├── server.js          # Backend Express
├── package.json
├── .env               # Suas configurações (não sobe pro Git)
├── .env.example       # Modelo de configuração
├── data/
│   └── site.json      # Todos os dados do site (editados pelo admin)
└── public/
    ├── index.html     # Site principal
    ├── admin.html     # Painel administrativo
    ├── css/
    │   └── style.css
    ├── js/
    │   └── main.js
    ├── img/           # Imagens fixas (logo, fotos iniciais)
    └── uploads/       # Fotos enviadas pelo admin
```

---

## 🔍 SEO incluído

- Meta tags completas (title, description, keywords)
- Open Graph para WhatsApp/Facebook
- Schema.org LocalBusiness com endereço, telefone e área de atendimento
- Palavras-chave para Divinópolis MG e região
- Sitemap manual recomendado após deploy

---

## 💡 Próximas melhorias sugeridas

- [ ] Vídeo de fundo no hero (adicionar arquivo .mp4 em /public)
- [ ] Blog com dicas para noivos (SEO extra)
- [ ] Galeria de stories verticais (formato Instagram)
- [ ] Calendário de disponibilidade
- [ ] Integração com Google Analytics
- [ ] Certificado SSL automático (Render oferece grátis)
