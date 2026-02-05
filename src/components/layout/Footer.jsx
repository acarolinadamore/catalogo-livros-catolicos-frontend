/**
 * Footer da aplicação
 * Informações institucionais e créditos
 */

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Layout 3 colunas em desktop, empilhado em mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">

          {/* Coluna Esquerda - Biblioteca Católica */}
          <div>
            <h3 className="font-serif font-bold text-gray-900 mb-3">
              Biblioteca Católica
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Plataforma de catalogação e consulta de livros religiosos católicos.
            </p>
            <p className="text-xs text-gray-500">
              Acervo do Pe. Carlos Alberto Pereira
            </p>
            <p className="text-xs text-gray-500">
              Arquidiocese de Campo Grande – MS
            </p>
          </div>

          {/* Coluna Centro - Links Úteis */}
          <div>
            <h3 className="font-serif font-bold text-gray-900 mb-3">
              Links Úteis
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://arquidiocesedecampogrande.org.br/paroquias/paroquia-pessoal-nossa-senhora-da-saude-capelania-hospitalar/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 hover:underline"
                >
                  Paróquia Pessoal Nossa Senhora da Saúde
                </a>
                <p className="text-xs text-gray-500">(Capelania Hospitalar)</p>
              </li>
              <li>
                <a
                  href="https://arquidiocesedecampogrande.org.br/paroquias/paroquia-imaculado-coracao-de-maria/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 hover:underline"
                >
                  Paróquia Imaculado Coração de Maria
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna Direita - Feito para a Glória de Deus */}
          <div className="md:text-right">
            <p className="text-gray-700 font-serif italic mb-2">
              Feito para a glória de Deus
            </p>
            <p className="text-xs text-gray-500">
              ✝️
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-400">
            © {currentYear} Biblioteca Católica. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
