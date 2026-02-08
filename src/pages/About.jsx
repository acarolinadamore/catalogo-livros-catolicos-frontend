/**
 * Página Sobre
 * Informações institucionais sobre a Biblioteca Católica
 */

function InstagramIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 130 130" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient fy="578.088" fx="158.429" gradientTransform="matrix(0 -1.98198 1.8439 0 -1031.399 454.004)" gradientUnits="userSpaceOnUse" href="#ig-a" r="65" cy="578.088" cx="158.429" id="ig-c" />
        <radialGradient fy="473.455" fx="147.694" gradientTransform="matrix(.17394 .86872 -3.5818 .71718 1648.351 -458.493)" gradientUnits="userSpaceOnUse" href="#ig-b" r="65" cy="473.455" cx="147.694" id="ig-d" />
        <linearGradient id="ig-b">
          <stop stopColor="#3771c8" offset="0" />
          <stop offset=".128" stopColor="#3771c8" />
          <stop stopOpacity="0" stopColor="#60f" offset="1" />
        </linearGradient>
        <linearGradient id="ig-a">
          <stop stopColor="#fd5" offset="0" />
          <stop stopColor="#fd5" offset=".1" />
          <stop stopColor="#ff543e" offset=".5" />
          <stop stopColor="#c837ab" offset="1" />
        </linearGradient>
      </defs>
      <path d="M65.033 0C37.891 0 29.953.028 28.41.156c-5.57.463-9.036 1.34-12.812 3.22-2.91 1.445-5.205 3.12-7.47 5.468-4.125 4.282-6.625 9.55-7.53 15.812-.44 3.04-.568 3.66-.594 19.188-.01 5.176 0 11.988 0 21.125 0 27.12.03 35.05.16 36.59.45 5.42 1.3 8.83 3.1 12.56 3.44 7.14 10.01 12.5 17.75 14.5 2.68.69 5.64 1.07 9.44 1.25 1.61.07 18.02.12 34.44.12 16.42 0 32.84-.02 34.41-.1 4.4-.207 6.955-.55 9.78-1.28a27.22 27.22 0 0017.75-14.53c1.765-3.64 2.66-7.18 3.065-12.317.088-1.12.125-18.977.125-36.81 0-17.836-.04-35.66-.128-36.78-.41-5.22-1.305-8.73-3.127-12.44-1.495-3.037-3.155-5.305-5.565-7.624-4.3-4.108-9.56-6.608-15.829-7.512C102.338.157 101.733.027 86.193 0z" fill="url(#ig-c)" />
      <path d="M65.033 0C37.891 0 29.953.028 28.41.156c-5.57.463-9.036 1.34-12.812 3.22-2.91 1.445-5.205 3.12-7.47 5.468-4.125 4.282-6.625 9.55-7.53 15.812-.44 3.04-.568 3.66-.594 19.188-.01 5.176 0 11.988 0 21.125 0 27.12.03 35.05.16 36.59.45 5.42 1.3 8.83 3.1 12.56 3.44 7.14 10.01 12.5 17.75 14.5 2.68.69 5.64 1.07 9.44 1.25 1.61.07 18.02.12 34.44.12 16.42 0 32.84-.02 34.41-.1 4.4-.207 6.955-.55 9.78-1.28a27.22 27.22 0 0017.75-14.53c1.765-3.64 2.66-7.18 3.065-12.317.088-1.12.125-18.977.125-36.81 0-17.836-.04-35.66-.128-36.78-.41-5.22-1.305-8.73-3.127-12.44-1.495-3.037-3.155-5.305-5.565-7.624-4.3-4.108-9.56-6.608-15.829-7.512C102.338.157 101.733.027 86.193 0z" fill="url(#ig-d)" />
      <path d="M65.003 17c-13.036 0-14.672.057-19.792.29-5.11.234-8.598 1.043-11.65 2.23-3.157 1.226-5.835 2.866-8.503 5.535-2.67 2.668-4.31 5.346-5.54 8.502-1.19 3.053-2 6.542-2.23 11.65C17.06 50.327 17 51.964 17 65s.058 14.667.29 19.787c.235 5.11 1.044 8.598 2.23 11.65 1.227 3.157 2.867 5.835 5.536 8.503 2.667 2.67 5.345 4.314 8.5 5.54 3.054 1.187 6.543 1.996 11.652 2.23 5.12.233 6.755.29 19.79.29 13.037 0 14.668-.057 19.788-.29 5.11-.234 8.602-1.043 11.656-2.23 3.156-1.226 5.83-2.87 8.497-5.54 2.67-2.668 4.31-5.346 5.54-8.502 1.18-3.053 1.99-6.542 2.23-11.65.23-5.12.29-6.752.29-19.788 0-13.036-.06-14.672-.29-19.792-.24-5.11-1.05-8.598-2.23-11.65-1.23-3.157-2.87-5.835-5.54-8.503-2.67-2.67-5.34-4.31-8.5-5.535-3.06-1.187-6.55-1.996-11.66-2.23-5.12-.233-6.75-.29-19.79-.29zm-4.306 8.65c1.278-.002 2.704 0 4.306 0 12.816 0 14.335.046 19.396.276 4.68.214 7.22.996 8.912 1.653 2.24.87 3.837 1.91 5.516 3.59 1.68 1.68 2.72 3.28 3.592 5.52.657 1.69 1.44 4.23 1.653 8.91.23 5.06.28 6.58.28 19.39s-.05 14.33-.28 19.39c-.214 4.68-.996 7.22-1.653 8.91-.87 2.24-1.912 3.835-3.592 5.514-1.68 1.68-3.275 2.72-5.516 3.59-1.69.66-4.232 1.44-8.912 1.654-5.06.23-6.58.28-19.396.28-12.817 0-14.336-.05-19.396-.28-4.68-.216-7.22-.998-8.913-1.655-2.24-.87-3.84-1.91-5.52-3.59-1.68-1.68-2.72-3.276-3.592-5.517-.657-1.69-1.44-4.23-1.653-8.91-.23-5.06-.276-6.58-.276-19.398s.046-14.33.276-19.39c.214-4.68.996-7.22 1.653-8.912.87-2.24 1.912-3.84 3.592-5.52 1.68-1.68 3.28-2.72 5.52-3.592 1.692-.66 4.233-1.44 8.913-1.655 4.428-.2 6.144-.26 15.09-.27zm29.928 7.97a5.76 5.76 0 105.76 5.758c0-3.18-2.58-5.76-5.76-5.76zm-25.622 6.73c-13.613 0-24.65 11.037-24.65 24.65 0 13.613 11.037 24.645 24.65 24.645C78.616 89.645 89.65 78.613 89.65 65S78.615 40.35 65.002 40.35zm0 8.65c8.836 0 16 7.163 16 16 0 8.836-7.164 16-16 16-8.837 0-16-7.164-16-16 0-8.837 7.163-16 16-16z" fill="#fff" />
    </svg>
  )
}

function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Cabeçalho */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
          Sobre a Biblioteca Católica
        </h1>
        <p className="text-lg text-gray-600">
          Plataforma de catalogação e consulta de livros religiosos católicos
        </p>
      </div>

      {/* Citação */}
      <div className="text-center mb-12 pb-8 border-b border-gray-200">
        <p className="text-lg text-gray-600 font-serif italic">
          "A leitura santa nos ilumina, a meditação nos alimenta, a oração nos
          eleva."
        </p>
        <p className="text-sm text-gray-500 mt-2">– São Bernardo de Claraval</p>
      </div>

      {/* Conteúdo */}
      <div className="prose prose-lg max-w-none">
        {/* O que é */}
        <section className="mb-10">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
            O que é a Biblioteca Católica
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            A Biblioteca Católica é uma plataforma digital de catalogação e
            consulta de livros religiosos católicos, criada com o objetivo de
            organizar e facilitar o acesso ao acervo pessoal do Pe. Carlos
            Alberto Pereira, promovendo o estudo, a formação e a vida
            espiritual.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            O projeto reúne obras de espiritualidade, teologia, catequese,
            liturgia, mariologia e vida dos santos, utilizadas no contexto do
            ministério sacerdotal e da atuação pastoral do sacerdote na
            Arquidiocese de Campo Grande – MS.
          </p>
          <p className="text-gray-700 leading-relaxed">
            A plataforma permite a busca por título, autor, palavra-chave e
            filtros específicos, oferecendo uma experiência simples, organizada
            e focada na consulta do acervo.
          </p>
        </section>

        {/* Pe. Carlos */}
        <section className="mb-10">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 text-center">
            Pe. Carlos Alberto Pereira
          </h2>

          {/* Foto do Pe. Carlos */}
          <div className="mb-6 flex justify-center">
            <img
              src="/PadreCarlos.jpg"
              alt="Pe. Carlos Alberto Pereira"
              className="rounded-lg shadow-lg w-full max-w-4xl"
            />
          </div>

          <div className="bg-primary-50 border-l-4 border-primary-600 rounded-r-lg p-6 mb-4">
            <p className="text-gray-700 leading-relaxed mb-2">
              <strong>
                Vigário Paroquial da Paróquia Pessoal Nossa Senhora da Saúde
              </strong>
            </p>
            <p className="text-gray-700 leading-relaxed mb-2">
              <strong>Arquidiocese:</strong> Campo Grande – MS
            </p>
            <p className="text-gray-700 leading-relaxed mb-2">
              <strong>Data de Nascimento:</strong> 18/01/1967
            </p>
            <p className="text-gray-700 leading-relaxed mb-2">
              <strong>Ordenação:</strong> 01/08/2013
            </p>
            <p className="text-gray-700 leading-relaxed mb-2">
              <strong>Atuação Pastoral:</strong>
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>
                Paróquia Pessoal Nossa Senhora da Saúde (Capelania Hospitalar)
              </li>
              <li>Paróquia Imaculado Coração de Maria</li>
            </ul>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">
            As obras aqui catalogadas refletem uma espiritualidade voltada para
            o cuidado, a consolação e o crescimento na fé.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Este catálogo reúne o acervo pessoal do Pe. Carlos Alberto Pereira,
            fruto de anos de estudo, ministério sacerdotal e acompanhamento
            pastoral, utilizado em sua atuação na capelania hospitalar e na
            formação de fiéis.
          </p>

          {/* Compartilhar */}
          <div className="flex items-center gap-3 mt-4">
            <span className="text-sm text-gray-600 font-medium">
              Contato:
            </span>
            <a
              href="https://api.whatsapp.com/send?text=*PE.%20CARLOS%20ALBERTO%20PEREIRA%20%7C%20Arquidiocese%20de%20Campo%20Grande*%0A%0Ahttps://arquidiocesedecampogrande.org.br/carlos-alberto-pereira/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-700 transition-colors"
              title="Compartilhar no WhatsApp"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </a>
            <a
              href="https://www.facebook.com/sharer.php?u=https://arquidiocesedecampogrande.org.br/carlos-alberto-pereira/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 transition-colors"
              title="Compartilhar no Facebook"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="https://x.com/intent/tweet?text=%20https://arquidiocesedecampogrande.org.br/carlos-alberto-pereira/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 hover:text-gray-700 transition-colors"
              title="Compartilhar no X (Twitter)"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </section>

        {/* Objetivo Pastoral */}
        <section className="mb-10">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
            Objetivo Pastoral
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Este catálogo tem como finalidade apoiar o ministério pastoral do
            Pe. Carlos Alberto Pereira, oferecendo recursos que auxiliem na
            formação, na evangelização e na vida espiritual dos fiéis:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>
              <strong>Formação:</strong> Apoiar a educação teológica e
              espiritual de seminaristas, catequistas e agentes pastorais.
            </li>
            <li>
              <strong>Evangelização:</strong> Facilitar o acesso a obras que
              contribuem para a catequese e o anúncio da fé.
            </li>
            <li>
              <strong>Vida Espiritual:</strong> Oferecer literatura que
              aprofunde a oração, a devoção e o crescimento na vida cristã.
            </li>
          </ul>
        </section>

        {/* Colaboração e Iniciativa */}
        <section className="mb-10">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
            Colaboração e Iniciativa
          </h2>

          <div className="flex gap-6 mb-4 items-center">
            {/* Foto do Antonio Tito */}
            <img
              src="/tito.png"
              alt="Antonio Tito"
              className="w-48 h-48 rounded-lg shadow-lg object-cover flex-shrink-0"
              style={{ backgroundColor: '#CCCBC6' }}
            />

            <div className="flex-1">
              <p className="text-gray-700 leading-relaxed mb-4">
                Este projeto nasceu a partir da iniciativa de{" "}
                <strong>Antonio Tito</strong>, que se dispôs a auxiliar o Pe. Carlos
                Alberto Pereira na organização de sua biblioteca pessoal.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Sua contribuição foi fundamental para viabilizar a organização
                inicial do acervo e reflete um gesto concreto de caridade e serviço
                ao próximo, colocando tempo e disposição a serviço da missão pastoral.
              </p>

              <div className="flex items-center gap-3 mt-4">
                <span className="text-sm text-gray-600 font-medium">Contato:</span>
                <a
                  href="https://wa.me/5567996633107"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 transition-colors"
                  title="WhatsApp"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/titotalksmedia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                  title="Facebook - Tito Media"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/@titomedianet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 hover:text-red-700 transition-colors"
                  title="YouTube - @titomedianet"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                <div className="flex items-center gap-1.5">
                  <a
                    href="https://www.instagram.com/titofps/"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Instagram - @titofps"
                  >
                    <InstagramIcon className="w-6 h-6" />
                  </a>
                  <a
                    href="https://www.instagram.com/titofps/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-medium text-blue-600 hover:text-blue-700"
                  >
                    titofps
                  </a>
                </div>
                <div className="flex items-center gap-1.5">
                  <a
                    href="https://www.instagram.com/titotalksmedia/"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Instagram - @titotalksmedia"
                  >
                    <InstagramIcon className="w-6 h-6" />
                  </a>
                  <a
                    href="https://www.instagram.com/titotalksmedia/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-medium text-blue-600 hover:text-blue-700"
                  >
                    titotalksmedia
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Desenvolvimento do Sistema */}
        <section className="mb-10">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
            Desenvolvimento do Sistema
          </h2>

          <div className="flex gap-6 mb-4 items-center">
            {/* Foto da Ana Carolina */}
            <img
              src="/ana-carolina.png"
              alt="Ana Carolina Damore"
              className="w-48 h-48 rounded-lg shadow-lg object-cover flex-shrink-0"
              style={{ backgroundColor: '#CCCBC6' }}
            />

            <div className="flex-1">
              <p className="text-gray-700 leading-relaxed mb-4">
                Este sistema foi idealizado e desenvolvido por{" "}
                <strong>Ana Carolina Damore</strong>, com foco em uma solução
                dinâmica, organizada e escalável para a catalogação e consulta de
                livros religiosos católicos.
              </p>
              <p className="text-gray-700 leading-relaxed">
                O trabalho foi realizado de forma{" "}
                voluntária e gratuita, em espírito de serviço e
                gratidão a Deus, colocando conhecimentos técnicos a serviço de uma
                iniciativa de valor espiritual.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm text-gray-600 font-medium">Contato:</span>
              <a
                href="https://wa.me/5567992429385"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 transition-colors"
                title="WhatsApp"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/acarolinadamore"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 transition-colors"
                title="Facebook - Ana Carolina Damore"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/acarolinadamore/"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram - @acarolinadamore"
              >
                <InstagramIcon className="w-6 h-6" />
              </a>
            </div>
            <div className="space-y-2 text-gray-700">
              <p className="flex items-center">
                <span className="mr-2">🌐</span>
                <span>
                  Sites:{" "}
                  <a
                    href="https://admtecnologia.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    admtecnologia.vercel.app
                  </a>
                  {" | "}
                  <a
                    href="https://anadamore.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    anadamore.vercel.app
                  </a>
                </span>
              </p>
              <p className="flex items-center">
                <span className="mr-2">✉️</span>
                <span>
                  E-mail:{" "}
                  <a
                    href="mailto:acarolinadamore@gmail.com"
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    acarolinadamore@gmail.com
                  </a>
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* Direitos Autorais */}
        <section className="mb-10">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
            Nota sobre Direitos Autorais
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Todas as obras aqui catalogadas são propriedade de suas respectivas
            editoras e autores. Respeitamos integralmente os direitos autorais.
            Para adquirir as obras, recomendamos contato direto com as editoras
            católicas ou livrarias especializadas.
          </p>
        </section>
      </div>
    </div>
  )
}

export default About
