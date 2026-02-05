/**
 * Página Sobre
 * Informações institucionais sobre a Biblioteca Católica
 */

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
          "A leitura santa nos ilumina, a meditação nos alimenta, a oração nos eleva."
        </p>
        <p className="text-sm text-gray-500 mt-2">
          – São Bernardo de Claraval
        </p>
      </div>

      {/* Conteúdo */}
      <div className="prose prose-lg max-w-none">
        {/* O que é */}
        <section className="mb-10">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
            O que é a Biblioteca Católica
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            A Biblioteca Católica é uma plataforma digital de catalogação e consulta de livros religiosos
            católicos, criada com o objetivo de facilitar o acesso ao patrimônio espiritual da Igreja,
            promovendo o estudo, a formação e a vida espiritual.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            O projeto foi desenvolvido inicialmente para o acervo pessoal do Pe. Carlos Alberto Pereira,
            sacerdote da Arquidiocese de Campo Grande – MS, reunindo obras de espiritualidade, teologia,
            catequese, liturgia, mariologia e vida dos santos.
          </p>
          <p className="text-gray-700 leading-relaxed">
            A plataforma permite a busca por título, autor, palavra-chave e filtros específicos,
            oferecendo uma experiência simples, moderna e focada na consulta.
          </p>
        </section>

        {/* Pe. Carlos */}
        <section className="mb-10">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
            Pe. Carlos Alberto Pereira
          </h2>
          <div className="bg-primary-50 border-l-4 border-primary-600 rounded-r-lg p-6 mb-4">
            <p className="text-gray-700 leading-relaxed mb-2">
              <strong>Arquidiocese:</strong> Campo Grande – MS
            </p>
            <p className="text-gray-700 leading-relaxed mb-2">
              <strong>Atuação Pastoral:</strong>
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>Paróquia Pessoal Nossa Senhora da Saúde (Capelania Hospitalar)</li>
              <li>Paróquia Imaculado Coração de Maria</li>
            </ul>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">
            Este catálogo reúne o acervo pessoal do Pe. Carlos Alberto Pereira, fruto de anos de
            estudo, ministério sacerdotal e acompanhamento pastoral. As obras aqui catalogadas são
            utilizadas em sua atuação na capelania hospitalar e na formação de fiéis, refletindo
            uma espiritualidade voltada para o cuidado, a consolação e o crescimento na fé.
          </p>

          {/* Compartilhar */}
          <div className="flex items-center gap-3 mt-4">
            <span className="text-sm text-gray-600 font-medium">Compartilhar:</span>
            <a
              href="https://api.whatsapp.com/send?text=*PE.%20CARLOS%20ALBERTO%20PEREIRA%20%7C%20Arquidiocese%20de%20Campo%20Grande*%0A%0Ahttps://arquidiocesedecampogrande.org.br/carlos-alberto-pereira/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-700 transition-colors"
              title="Compartilhar no WhatsApp"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
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
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
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
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
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
            Este catálogo foi criado com as seguintes finalidades pastorais:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>
              <strong>Formação:</strong> Auxiliar na formação teológica e espiritual de seminaristas,
              catequistas e agentes pastorais.
            </li>
            <li>
              <strong>Evangelização:</strong> Facilitar o acesso a obras que ajudam na evangelização
              e catequese.
            </li>
            <li>
              <strong>Capelania Hospitalar:</strong> Disponibilizar recursos para o acompanhamento
              espiritual de enfermos e suas famílias.
            </li>
            <li>
              <strong>Vida Espiritual:</strong> Oferecer literatura que aprofunde a oração, os
              sacramentos e a vida devota.
            </li>
          </ul>
        </section>

        {/* Colaboração e Iniciativa */}
        <section className="mb-10">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
            Colaboração e Iniciativa
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Este projeto nasceu a partir da iniciativa de <strong>Antonio Tito</strong>, que se dispôs
            a auxiliar o Pe. Carlos Alberto Pereira na organização de sua biblioteca pessoal.
          </p>
          <div className="bg-primary-50 border-l-4 border-primary-600 rounded-r-lg p-6 mb-4">
            <p className="text-gray-700 leading-relaxed mb-3">
              Movido pelo desejo de ajudar e servir, <strong>Antonio Tito:</strong>
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Fotografou os livros do acervo</li>
              <li>Auxiliou no levantamento de informações como título e autor</li>
              <li>Teve a iniciativa inicial de buscar uma forma prática de apoiar o padre na catalogação de sua biblioteca</li>
            </ul>
          </div>
          <p className="text-gray-700 leading-relaxed">
            Sua contribuição foi fundamental para viabilizar a organização inicial do acervo e reflete
            um gesto concreto de caridade e serviço ao próximo, colocando o tempo e os talentos a serviço
            da Igreja.
          </p>
        </section>

        {/* Desenvolvimento do Sistema */}
        <section className="mb-10">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
            Desenvolvimento do Sistema
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Este sistema foi idealizado e desenvolvido por <strong>Ana Carolina Damore</strong>, com foco
            em uma solução dinâmica, organizada e escalável para a catalogação e consulta de livros religiosos
            católicos.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            O trabalho foi realizado de forma <strong>voluntária e gratuita</strong>, em espírito de serviço
            e gratidão a Deus, colocando conhecimentos técnicos a serviço de uma iniciativa de valor espiritual.
          </p>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700 leading-relaxed mb-3">
              <strong>Contato da desenvolvedora:</strong>
            </p>
            <div className="space-y-2 text-gray-700">
              <p className="flex items-center">
                <span className="mr-2">🌐</span>
                <span>Site: <a href="https://www.admtecnologia.com.br" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 underline">www.admtecnologia.com.br</a></span>
              </p>
              <p className="flex items-center">
                <span className="mr-2">📱</span>
                <span>WhatsApp: <a href="https://wa.me/5567992429385" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 underline">(67) 99242-9385</a></span>
              </p>
              <p className="flex items-center">
                <span className="mr-2">✉️</span>
                <span>E-mail: <a href="mailto:acarolinadamore@gmail.com" className="text-primary-600 hover:text-primary-700 underline">acarolinadamore@gmail.com</a></span>
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
            Todas as obras aqui catalogadas são propriedade de suas respectivas editoras e autores.
            Respeitamos integralmente os direitos autorais. Para adquirir as obras, recomendamos
            contato direto com as editoras católicas ou livrarias especializadas.
          </p>
        </section>
      </div>
    </div>
  );
}

export default About;
