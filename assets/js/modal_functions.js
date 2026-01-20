// Variável para controle de exclusão
let deleteId = null;

// Excluir transação
function deleteTransaction(id) {
    deleteId = id;
    
    // Criar modal dinamicamente
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.id = 'deleteModal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-icon">🗑️</div>
                <h2 class="modal-title">Confirmar Exclusão</h2>
            </div>
            <div class="modal-body">
                <p class="modal-message">Tem certeza que deseja excluir esta transação?</p>
                <p class="modal-warning">⚠️ Esta ação não pode ser desfeita</p>
            </div>
            <div class="modal-actions">
                <button class="modal-btn btn-cancel" onclick="cancelDelete()">Cancelar</button>
                <button class="modal-btn btn-delete" onclick="confirmDelete()">Excluir</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Fechar ao clicar fora
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            cancelDelete();
        }
    });
    
    // Fechar com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            cancelDelete();
        }
    });
}

// Cancelar exclusão
function cancelDelete() {
    const modal = document.getElementById('deleteModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    }
    deleteId = null;
}

// Confirmar exclusão
function confirmDelete() {
    if (deleteId) {
        deleteFromFirebase('transactions', deleteId)
            .then(() => {
                console.log('Transação excluída com sucesso');
            })
            .catch(err => {
                console.error('Erro ao excluir:', err);
                alert('Erro ao excluir transação: ' + err.message);
            });
        cancelDelete();
    }
}