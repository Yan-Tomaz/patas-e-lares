// ===== Referências dos elementos =====
const botaoMenu = document.getElementById('botaoMenu');
const menuNav = document.getElementById('menuNav');
const camposTipo = document.querySelectorAll('input[name="tipo"]');
const campoArea = document.getElementById('campoArea');
const campoTelefone = document.getElementById('telefone');
const campoCep = document.getElementById('cep');
const campoCpf = document.getElementById('cpf');
const formCadastro = document.getElementById('formCadastro');
const avisoSucesso = document.getElementById('avisoSucesso');
const toastContainer = document.getElementById('toastContainer');

// ===== Toast (notificação temporária) =====
function mostrarToast(mensagem, tipo = 'info') {
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = 'toast ' + tipo;
  toast.textContent = mensagem;
  toastContainer.appendChild(toast);

  setTimeout(function () {
    toast.classList.add('saindo');
    toast.addEventListener('animationend', function () {
      toast.remove();
    });
  }, 3500);
}

// ===== Menu hambúrguer =====
if (botaoMenu && menuNav) {
  botaoMenu.addEventListener('click', function () {
    const menuAberto = menuNav.classList.toggle('aberto');
    botaoMenu.setAttribute('aria-expanded', menuAberto);
  });
}

// ===== Esconder "área de interesse" quando marcar Doador =====
if (camposTipo.length && campoArea) {
  camposTipo.forEach(function (radio) {
    radio.addEventListener('change', function () {
      if (radio.value === 'doador' && radio.checked) {
        campoArea.classList.add('escondido');
      } else {
        campoArea.classList.remove('escondido');
      }
    });
  });
}

// ===== Função auxiliar: remove tudo que não for número =====
function apenasNumeros(valor) {
  return valor.replace(/\D/g, '');
}

// ===== Máscara de CPF =====
if (campoCpf) {
  campoCpf.addEventListener('input', function () {
    let valor = apenasNumeros(campoCpf.value).slice(0, 11);
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    campoCpf.value = valor;
  });
}

// ===== Máscara de telefone =====
if (campoTelefone) {
  campoTelefone.addEventListener('input', function () {
    let valor = apenasNumeros(campoTelefone.value).slice(0, 11);

    if (valor.length > 10) {
      valor = valor.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    } else if (valor.length > 5) {
      valor = valor.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else if (valor.length > 2) {
      valor = valor.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    } else {
      valor = valor.replace(/(\d{0,2})/, '($1');
    }

    campoTelefone.value = valor;
  });
}

// ===== Máscara de CEP =====
if (campoCep) {
  campoCep.addEventListener('input', function () {
    let valor = apenasNumeros(campoCep.value).slice(0, 8);
    valor = valor.replace(/(\d{5})(\d{1,3})$/, '$1-$2');
    campoCep.value = valor;
  });
}

// ===== Busca de endereço via ViaCEP (só pelo botão da lupa) =====
if (campoCep) {
  const campoRua = document.getElementById('rua');
  const campoBairro = document.getElementById('bairro');
  const campoCidade = document.getElementById('cidade');
  const campoUf = document.getElementById('uf');
  const botaoBuscarCep = document.getElementById('botaoBuscarCep');

  function buscarEnderecoPorCep() {
    const cep = apenasNumeros(campoCep.value);

    if (cep.length !== 8) {
      mostrarToast('Digite um CEP completo com 8 números antes de buscar.', 'erro');
      return;
    }

    fetch('https://viacep.com.br/ws/' + cep + '/json/')
      .then(function (resposta) {
        return resposta.json();
      })
      .then(function (dados) {
        if (dados.erro) {
          mostrarToast('CEP não encontrado. Confira o número ou preencha manualmente.', 'erro');
          return;
        }
        campoRua.value = dados.logradouro;
        campoBairro.value = dados.bairro;
        campoCidade.value = dados.localidade;
        campoUf.value = dados.uf;
        mostrarToast('Endereço encontrado e preenchido!', 'sucesso');
      })
      .catch(function () {
        mostrarToast('Não foi possível buscar o CEP agora. Preencha manualmente.', 'erro');
      });
  }

  if (botaoBuscarCep) {
    botaoBuscarCep.addEventListener('click', buscarEnderecoPorCep);
  }
}

// ===== Validação real de CPF (dígitos verificadores) =====
function cpfValido(valorComMascara) {
  const cpf = apenasNumeros(valorComMascara);

  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;

  return true;
}

// ===== Validação e envio do formulário =====
if (formCadastro) {
  formCadastro.addEventListener('submit', function (evento) {
    evento.preventDefault();

    let formularioValido = true;

    const campos = formCadastro.querySelectorAll('input, select');
    campos.forEach(function (campo) {
      const divCampo = campo.closest('.campo');
      if (!divCampo) return;

      const valido = campo.checkValidity();
      divCampo.classList.toggle('erro', !valido);
      if (!valido) formularioValido = false;
    });

    const divCpf = campoCpf.closest('.campo');
    if (!cpfValido(campoCpf.value)) {
      divCpf.classList.add('erro');
      formularioValido = false;
    }

    if (!formularioValido) {
      const primeiroErro = formCadastro.querySelector('.campo.erro input, .campo.erro select');
      if (primeiroErro) primeiroErro.focus();
      return;
    }

    formCadastro.reset();
    campoArea.classList.remove('escondido');
    avisoSucesso.classList.add('visivel');
  });
}