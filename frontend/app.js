// ── Configuração ─────────────────────────────────────
const API = '/api';

// ── Elementos do DOM ─────────────────────────────────
const formProduto  = document.getElementById('form-produto');
const formTitulo   = document.getElementById('form-titulo');
const btnSalvar    = document.getElementById('btn-salvar');
const btnCancelar  = document.getElementById('btn-cancelar');
const tbody        = document.getElementById('tbody');
const totalEl      = document.getElementById('total-produtos');
const modalOverlay = document.getElementById('modal-overlay');
const btnConfirmar = document.getElementById('btn-confirmar-delete');
const btnCancelarM = document.getElementById('btn-cancelar-delete');

let produtoIdParaDeletar = null;

// ── Feedback toast ────────────────────────────────────
function mostrarFeedback(msg, erro = false) {
  let el = document.getElementById('feedback');
  if (!el) {
    el = document.createElement('div');
    el.id = 'feedback';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.className = 'visivel' + (erro ? ' erro' : '');
  setTimeout(() => { el.className = ''; }, 2500);
}

// ── Formatar moeda ────────────────────────────────────
function formatarPreco(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// ── Carregar categorias no <select> ───────────────────
async function carregarCategorias() {
  try {
    const res  = await fetch(`${API}/categorias`);
    const cats = await res.json();
    const sel  = document.getElementById('categoria');

    cats.forEach(c => {
      const opt   = document.createElement('option');
      opt.value   = c.id;
      opt.textContent = c.nome;
      sel.appendChild(opt);
    });
  } catch {
    console.warn('Não foi possível carregar categorias.');
  }
}

// ── Carregar e renderizar produtos ────────────────────
async function carregarProdutos() {
  tbody.innerHTML = '<tr><td colspan="6" class="vazio">Carregando...</td></tr>';
  try {
    const res      = await fetch(`${API}/produtos`);
    const produtos = await res.json();

    totalEl.textContent = produtos.length + ' produto(s)';

    if (produtos.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="vazio">Nenhum produto cadastrado.</td></tr>';
      return;
    }

    tbody.innerHTML = produtos.map(p => `
      <tr>
        <td>${p.id}</td>
        <td><strong>${p.nome}</strong><br><small style="color:#94a3b8">${p.descricao || ''}</small></td>
        <td>${p.categoria || '<em style="color:#94a3b8">—</em>'}</td>
        <td class="preco">${formatarPreco(p.preco)}</td>
        <td class="${p.estoque <= 5 ? 'estoque-baixo' : ''}">${p.estoque}</td>
        <td class="acoes">
          <button class="btn btn-edit"   onclick="editarProduto(${p.id})">✏️ Editar</button>
          <button class="btn btn-delete" onclick="confirmarDelete(${p.id})">🗑️ Remover</button>
        </td>
      </tr>
    `).join('');

  } catch {
    tbody.innerHTML = '<tr><td colspan="6" class="vazio" style="color:#ef4444">❌ Erro ao conectar com a API. O servidor está rodando?</td></tr>';
  }
}

// ── Salvar produto (criar ou editar) ──────────────────
formProduto.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id     = document.getElementById('produto-id').value;
  const corpo  = {
    nome:         document.getElementById('nome').value.trim(),
    descricao:    document.getElementById('descricao').value.trim(),
    preco:        parseFloat(document.getElementById('preco').value),
    estoque:      parseInt(document.getElementById('estoque').value) || 0,
    categoria_id: document.getElementById('categoria').value || null,
  };

  const url    = id ? `${API}/produtos/${id}` : `${API}/produtos`;
  const metodo = id ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corpo),
    });

    if (!res.ok) throw new Error();

    mostrarFeedback(id ? '✅ Produto atualizado!' : '✅ Produto criado!');
    resetarFormulario();
    carregarProdutos();
  } catch {
    mostrarFeedback('❌ Erro ao salvar produto.', true);
  }
});

// ── Preencher formulário para edição ──────────────────
async function editarProduto(id) {
  try {
    const res = await fetch(`${API}/produtos/${id}`);
    const p   = await res.json();

    document.getElementById('produto-id').value  = p.id;
    document.getElementById('nome').value        = p.nome;
    document.getElementById('descricao').value   = p.descricao || '';
    document.getElementById('preco').value       = p.preco;
    document.getElementById('estoque').value     = p.estoque;
    document.getElementById('categoria').value   = p.categoria_id || '';

    formTitulo.textContent  = '✏️ Editar Produto';
    btnSalvar.textContent   = 'Atualizar Produto';
    btnCancelar.style.display = 'inline-block';

    formProduto.scrollIntoView({ behavior: 'smooth' });
  } catch {
    mostrarFeedback('❌ Erro ao carregar produto.', true);
  }
}

// ── Cancelar edição ───────────────────────────────────
btnCancelar.addEventListener('click', resetarFormulario);

function resetarFormulario() {
  formProduto.reset();
  document.getElementById('produto-id').value = '';
  formTitulo.textContent   = 'Adicionar Produto';
  btnSalvar.textContent    = 'Salvar Produto';
  btnCancelar.style.display = 'none';
}

// ── Confirmar exclusão (modal) ────────────────────────
function confirmarDelete(id) {
  produtoIdParaDeletar   = id;
  modalOverlay.style.display = 'flex';
}

btnCancelarM.addEventListener('click', () => {
  produtoIdParaDeletar   = null;
  modalOverlay.style.display = 'none';
});

btnConfirmar.addEventListener('click', async () => {
  modalOverlay.style.display = 'none';
  try {
    const res = await fetch(`${API}/produtos/${produtoIdParaDeletar}`, { method: 'DELETE' });
    if (!res.ok) throw new Error();
    mostrarFeedback('🗑️ Produto removido!');
    carregarProdutos();
  } catch {
    mostrarFeedback('❌ Erro ao remover produto.', true);
  }
  produtoIdParaDeletar = null;
});

// ── Inicialização ─────────────────────────────────────
carregarCategorias();
carregarProdutos();
