/**
 * Footer da aplicação
 * Informações institucionais e créditos
 */

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          {/* Texto principal */}
          <p className="text-gray-700 mb-2">
            <span className="font-serif font-semibold">Biblioteca Católica</span> – Plataforma de catalogação e consulta de livros religiosos católicos.
          </p>
          <p className="text-gray-600 text-sm mb-4">
            Feito para a glória de Deus.
          </p>

          {/* Informações adicionais */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>
              Acervo do Pe. Carlos Alberto Pereira
            </p>
            <p>
              Arquidiocese de Campo Grande – MS
            </p>
          </div>

          {/* Copyright */}
          <p className="text-xs text-gray-400 mt-6">
            © {currentYear} Biblioteca Católica. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
