import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// ── Fallback responses — sem necessidade de OpenAI ────────────────────────────
const RESPONSES: Record<string, string[]> = {
  busy: [
    "Recebi, pode deixar. Estou gerenciando algumas prioridades concorrentes agora, mas isso está no meu radar — te retorno assim que abrir uma janela aqui.",
    "Perfeito, já estou em cima disso. Tenho algumas coisas críticas na fila agora, mas coloco isso na stack com prioridade e te dou um retorno até o final do dia.",
    "Entendido. Estou em cima de bastante coisa aqui, mas nada que não dê pra endereçar. Deixa eu organizar os próximos passos e já te passo um update.",
    "Certo, anotado. Momento pesado aqui com outras demandas críticas, mas já está no meu backlog. Assim que liberar uma janela te trago um posicionamento claro.",
    "Recebi. Estou em paralelo com algumas issues críticas agora, mas já joguei isso na lista com prioridade. Te aciono assim que tiver algo concreto.",
    "Entendido, anotei aqui. Vou endereçar isso assim que fechar o que está aberto agora — não deve demorar. Qualquer novidade já te aviso.",
    "Certo. Estou num momento de alta demanda aqui, mas essa issue não foge. Já deixei marcado para tratar logo que abrir espaço — te retorno em breve.",
    "Anotado. Estou com a agenda pesada essa manhã, mas já deixei isso sinalizado. Te trago um update assim que conseguir respirar um pouco aqui.",
    "Recebi. Muita coisa acontecendo aqui em paralelo, mas já sinalizei internamente. Não deixo passar — te mando um status ainda hoje.",
    "Perfeito. Vai entrar na fila de prioridades agora. Estou resolvendo algumas coisas urgentes aqui, mas já aciono você com um update em breve.",
  ],

  aligning: [
    "Perfeito, vou alinhar com o time e te trago esse consolidado até o final do dia. Qualquer blocker que surgir no meio do caminho, já te sinalizo.",
    "Entendido. Deixa eu validar internamente com as partes envolvidas e consolido um direcionamento. Já levo isso pro próximo touch point com contexto completo.",
    "Recebi. Vou fazer um alinhamento rápido com o time responsável e trazer isso estruturado para você. Qualquer coisa que bloquear, já escalo de imediato.",
    "Certo. Preciso validar alguns pontos internamente antes de trazer uma resposta assertiva. Já coloco isso na agenda do próximo sync e garantimos o alinhamento.",
    "Perfeito. Vou levar isso pra discussão com as partes corretas e te trago um posicionamento consolidado. Não deve demorar muito.",
    "Entendido. Deixa eu puxar as pessoas certas pra essa conversa e garantir que estamos todos na mesma página antes de trazer uma resposta definitiva.",
    "Recebi. Vou calibrar isso com o time antes de trazer um retorno para você — quero garantir que a resposta venha com o contexto correto das partes envolvidas.",
    "Certo. Preciso fazer um alinhamento rápido internamente para garantir que estamos todos com o mesmo entendimento. Te retorno ainda hoje com algo mais concreto.",
    "Entendido. Vou validar com quem tem ownership disso e garantir que a informação que te passo é precisa. Alinhamento feito, já te aciono.",
    "Perfeito. Antes de te dar um retorno, preciso consolidar isso com o time para não trazer uma resposta pela metade. Já coloco isso em movimento.",
    "Recebi. Vou sincronizar com as áreas envolvidas e trazer isso de forma estruturada. Garanto o alinhamento necessário e te retorno com clareza.",
    "Certo, já está sendo levado para as pessoas certas. Vou garantir que todos estejam alinhados antes de te passar um posicionamento definitivo.",
  ],

  followup: [
    "Isso já está sendo endereçado. Vou fazer um follow-up formal até o final do dia e te trago o status consolidado. Fica tranquilo que estou de olho.",
    "Já está no meu radar e sendo monitorado de perto. Vou te dar um follow-up detalhado assim que tiver mais contexto para compartilhar.",
    "Já existe um andamento nisso. Deixa eu pegar o status atualizado e te passo um follow-up estruturado até amanhã de manhã com tudo mapeado.",
    "Recebi, e já há movimento nisso. Vou consolidar as informações e fazer um follow-up completo. Qualquer ação imediata necessária, já te sinalizo.",
    "Estou monitorando isso de perto. Vou fazer um follow-up com as partes envolvidas e te trazer um status atualizado ainda hoje.",
    "Já está sendo tratado. Vou acompanhar de perto e te dar um retorno completo com o status de tudo até o final do expediente.",
    "Esse item já está na minha lista de acompanhamento. Faço um follow-up agora e te retorno com uma visão consolidada do que está acontecendo.",
    "Recebi. Já tem andamento nisso, só preciso consolidar as informações mais recentes. Te mando um follow-up estruturado em breve com tudo atualizado.",
    "Vou seguir de perto e fazer um follow-up formal até hoje à tarde. Qualquer movimento relevante que acontecer antes disso, já te aviso.",
    "Está no meu acompanhamento. Faço o follow-up com as partes envolvidas e consolido um status claro para você ainda hoje.",
  ],

  escalating: [
    "Já escalei para o time com ownership desse assunto. Eles estão cientes e vão trazer um posicionamento em breve. Te mantenho no loop assim que tiver retorno.",
    "Recebi e já acionei as pessoas certas para tratar isso com a devida prioridade. Coloquei as partes relevantes na mesma thread para ter visibilidade total.",
    "Entendido. Isso está sendo escalado para quem tem o contexto técnico necessário. Garantí que está sendo tratado como prioridade e te atualizo com o retorno.",
    "Já acionei o time responsável e a issue está sendo tratada no nível correto. Monitoro de perto e te trago o update assim que houver posicionamento definitivo.",
    "Escalei para a liderança da área responsável. Eles têm o contexto e a autonomia para resolver isso da forma mais rápida. Te incluo no retorno.",
    "Isso foi escalado para quem pode resolver com mais agilidade e contexto. Já garantí visibilidade em nível de gestão e o retorno vem logo.",
    "Já levei isso para um nível acima para garantir a priorização correta. O time certo está ciente e trabalhando nisso. Te mantenho informado.",
    "Recebi. Escalei internamente para quem tem poder de decisão sobre isso. Não deve demorar para ter um posicionamento. Te aviso assim que vier.",
    "Isso foi endereçado diretamente para o time com responsabilidade sobre essa área. Eles estão cientes da urgência e já estão tratando.",
    "Já acionei as partes necessárias em nível de escalada. O assunto está com quem pode resolver definitivamente. Te incluo no update.",
  ],

  delegating: [
    "Já redirecionei para quem tem o ownership correto dessa demanda. Eles estão sendo briefados agora e vão entrar em contato diretamente com mais contexto.",
    "Delegado para o time com a expertise necessária para endereçar isso da forma mais eficiente. Já coloquei eles a par e garantí que está sendo tratado.",
    "Recebi e já direcionei para a pessoa certa. Passei todo o contexto necessário para que consigam resolver sem perda de informação. Te mantenho atualizado.",
    "Isso já está com quem pode resolver de forma mais assertiva. Garanti o repasse completo do contexto e já está sendo tratado. Te incluo no próximo update.",
    "Já passei essa demanda para o responsável direto, com todo o contexto necessário. Eles vão te contatar para dar sequência de forma mais eficiente.",
    "Transferi para o time com a capacidade técnica correta para isso. Repassei todas as informações e eles já estão trabalhando. Te incluo no loop.",
    "Essa responsabilidade foi delegada para quem tem o know-how específico. Já briefei completamente e garantí o entendimento. Resultado vem em breve.",
    "Redirecionei internamente para o dono do processo. Passei o contexto completo e garantí que está como prioridade na agenda deles. Te aviso do andamento.",
    "Essa demanda foi formalmente delegada com contexto completo. O responsável já está ciente e vai acionar você diretamente para dar continuidade.",
    "Já encaminhei para a pessoa com ownership correto. Fiz o briefing completo e garantí que está sendo tratado com a prioridade que merece.",
  ],
};

// Keywords que indicam urgência na mensagem
const URGENCY_KEYWORDS = [
  'urgente', 'urgência', 'agora', 'imediato', 'imediatamente', 'rápido',
  'preciso já', 'hoje', 'asap', 'crítico', 'emergência', 'prazo',
  'atrasado', 'atrasou', 'vencendo', 'deadline',
];

function detectUrgency(message: string): 'high' | 'medium' | 'low' {
  const lower = message.toLowerCase();
  const matches = URGENCY_KEYWORDS.filter(kw => lower.includes(kw)).length;
  if (matches >= 2 || lower.includes('urgente') || lower.includes('asap')) return 'high';
  if (matches === 1) return 'medium';
  return 'low';
}

// Prefixos de urgência que são adicionados quando urgência é alta
const URGENCY_PREFIXES: Record<string, string[]> = {
  high: [
    "Entendido — prioridade máxima aqui. ",
    "Recebi, já estou em cima disso agora mesmo. ",
    "Certo, tratando como prioridade imediata. ",
    "Visto. Já está sendo tratado com urgência máxima. ",
  ],
  medium: [
    "Recebi e já está no meu radar. ",
    "Entendido, vou priorizar isso. ",
  ],
  low: [""],
};

function getResponse(tone: string, urgency: string): string {
  const responses = RESPONSES[tone] ?? RESPONSES.aligning;
  const base = responses[Math.floor(Math.random() * responses.length)];

  const prefixes = URGENCY_PREFIXES[urgency] ?? URGENCY_PREFIXES.low;
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];

  // Only add prefix if response doesn't already start with a similar acknowledgment
  if (urgency === 'high' && prefix && !base.startsWith("Recebi") && !base.startsWith("Entendido") && !base.startsWith("Certo")) {
    return prefix + base.charAt(0).toLowerCase() + base.slice(1);
  }

  return base;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { message, tone = "aligning" } = body;
    let { urgency } = body;

    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "Campo 'message' é obrigatório" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Auto-detect urgency from message if not provided
    if (!urgency) {
      urgency = detectUrgency(message);
    }

    const response = getResponse(tone, urgency);

    return new Response(JSON.stringify({ response, urgency_detected: urgency }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro interno";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
