// =========================================================
// toast.js — responsabilidade única: exibir notificações
// temporárias na tela. Não sabe nada sobre formulário,
// rede ou armazenamento.
// =========================================================

export function mostrarToast(mensagem, tipo = 'info') {
  const toastContainer = document.getElementById('toastContainer');
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