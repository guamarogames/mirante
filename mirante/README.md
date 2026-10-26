# Mirante Pizza Bar · site

Site de uma página da Mirante Pizza Bar (pizza no forno a lenha, Mairiporã, SP). O vídeo do início roda sozinho, em loop, sem depender da rolagem da página.

HTML, CSS e JavaScript puros. Sem build, sem dependências.

```
mirante/               ← a pasta que vai para o ar (só ela)
  index.html
  assets/
    styles.css
    main.js
    hero-loop.mp4      ← o vídeo do logo, com emenda suave para o loop (3 s, sem áudio, 780 KB)
    hero-poster.jpg    ← primeiro quadro, aparece enquanto o vídeo carrega
    fatia-loop.mp4     ← os 4 primeiros segundos do vídeo da fatia, recortados no centro (seção 01)
    fatia-poster.jpg   ← primeiro quadro desse vídeo
    foto-fatia.jpg, foto-margherita.jpg ← fotos da seção de sabores (quadros dos dois vídeos)
    fogo.jpg           ← recorte das chamas do vídeo (fundos das seções)
    terraco.jpg        ← o terraço de dia
    terraco-noite.jpg  ← o terraço à noite
    logo.png, favicon.png, og.jpg
```

## Ver no computador

Dois cliques no `index.html` já mostram o site. Para ver exatamente como fica no ar, rode um servidor simples:

```
npx http-server mirante -p 8080
```

e abra `http://localhost:8080`.

## Onde trocar as informações

- **Fotos dos sabores**: troque `assets/foto-fatia.jpg` e `assets/foto-margherita.jpg` por fotos reais com o mesmo nome (qualquer tamanho, de preferência 1000 px ou mais).
- **Link de pedido**: no começo de `assets/main.js`, `ORDER_URL`. Todos os botões de pedido usam esse endereço.
- **Endereço, horário, WhatsApp**: na seção `id="visite"` e no rodapé do `index.html`.

## Antes de publicar

Em `index.html`, procure o comentário `DEPLOY STEP` e troque `https://SEU-DOMINIO/` pelo endereço real do site nas tags `og:url` e `og:image` (é o que faz a prévia do link aparecer bonita no WhatsApp e no Instagram).

## Quem vê o quê

- Todos os aparelhos: o vídeo em loop no topo e o vídeo da fatia na seção 01. Cada vídeo só é baixado quando aparece na tela e pausa quando sai dela. No celular em pé, o vídeo do topo aparece largo com o logo inteiro, sobre um fundo de chamas desfocadas.
- Quem pede menos movimento no sistema: as imagens paradas, sem baixar nenhum vídeo.
- Na seção do terraço, um toque troca a foto da frente entre dia e noite.
