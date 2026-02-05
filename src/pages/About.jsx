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
          <p className="text-gray-700 leading-relaxed">
            Este catálogo reúne o acervo pessoal do Pe. Carlos Alberto Pereira, fruto de anos de
            estudo, ministério sacerdotal e acompanhamento pastoral. As obras aqui catalogadas são
            utilizadas em sua atuação na capelania hospitalar e na formação de fiéis, refletindo
            uma espiritualidade voltada para o cuidado, a consolação e o crescimento na fé.
          </p>
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
            Este projeto também contou com a iniciativa e colaboração de <strong>Antonio Tito</strong>,
            que se dispôs a auxiliar o Pe. Carlos na organização do acervo.
          </p>
          <div className="bg-primary-50 border-l-4 border-primary-600 rounded-r-lg p-6 mb-4">
            <p className="text-gray-700 leading-relaxed mb-3">
              <strong>Antonio Tito:</strong>
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>Fotografou os livros</li>
              <li>Auxiliou no levantamento de informações como autor e título</li>
              <li>Teve a iniciativa inicial de buscar uma forma de ajudar o padre na catalogação de sua biblioteca</li>
            </ul>
          </div>
          <p className="text-gray-700 leading-relaxed">
            Sua colaboração foi fundamental para viabilizar a organização inicial do acervo.
          </p>
        </section>

        {/* Desenvolvimento do Sistema */}
        <section className="mb-10">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
            Desenvolvimento do Sistema
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            O sistema foi idealizado e desenvolvido por <strong>Ana Carolina Damore</strong>, com foco
            em uma solução dinâmica, organizada e escalável para a catalogação de livros religiosos.
          </p>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700 leading-relaxed mb-3">
              <strong>Contato da desenvolvedora:</strong>
            </p>
            <div className="space-y-2 text-gray-700">
              <p className="flex items-center">
                <span className="mr-2">🌐</span>
                <span>Site: <a href="https://anadamore.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 underline">anadamore.com</a></span>
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
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700 leading-relaxed mb-4">
              Este catálogo tem finalidade <strong>exclusivamente informativa e pastoral</strong>.
              Não disponibilizamos os textos completos das obras, apenas informações bibliográficas
              e descritivas.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Todas as obras aqui catalogadas são propriedade de suas respectivas editoras e autores.
              Respeitamos integralmente os direitos autorais. Para adquirir as obras, recomendamos
              contato direto com as editoras católicas ou livrarias especializadas.
            </p>
          </div>
        </section>

        {/* Contato */}
        <section className="mb-10">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
            Contato
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Para mais informações sobre o acervo ou sugestões de melhorias na plataforma, entre em
            contato através da Paróquia Imaculado Coração de Maria ou da Capelania Hospitalar
            Nossa Senhora da Saúde, em Campo Grande – MS.
          </p>
        </section>
      </div>

      {/* Frase final */}
      <div className="text-center mt-12 pt-8 border-t border-gray-200">
        <p className="text-lg text-gray-600 font-serif italic">
          "A leitura santa nos ilumina, a meditação nos alimenta, a oração nos eleva."
        </p>
        <p className="text-sm text-gray-500 mt-2">
          – São Bernardo de Claraval
        </p>
      </div>
    </div>
  );
}

export default About;
