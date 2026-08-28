# Conversa — Estranhos

Projeto sem build usando HTML/CSS/JavaScript puro + Supabase, preparado para GitHub Pages.

## 1. Configuração

1. Crie um projeto no Supabase.
2. Ative **Anonymous Sign-Ins** em Authentication.
3. Abra o SQL Editor e execute `supabase-schema.sql`.
4. Abra `js/supabase.js`.
5. Coloque a URL do projeto e a chave pública/anon.
6. Publique os arquivos no GitHub Pages.

## 2. O que já está incluído

- Login anônimo.
- Nickname.
- Lista de pessoas online e disponíveis.
- Matchmaking aleatório.
- Conversa direta.
- Mensagens persistentes no banco.
- Histórico quando o usuário volta depois de estar offline.
- Contador de não lidas.
- Realtime para novas mensagens.
- Bloqueio e denúncia.
- RLS.
- Sem Vite, Node ou build.

## 3. Observação sobre notificações

A mensagem fica armazenada no Supabase mesmo quando o destinatário está offline. Push notifications do sistema operacional/navegador são uma etapa posterior; o histórico offline não depende delas.

## 4. GitHub Pages

Envie os arquivos para um repositório e ative Settings > Pages > Deploy from branch > main > / (root).

## 5. Presença
A lista online considera `last_seen` recente, para reduzir perfis presos como online quando a aba é fechada abruptamente. O navegador não garante execução de `beforeunload`; para produção, Supabase Realtime Presence é recomendado para presença mais precisa.
