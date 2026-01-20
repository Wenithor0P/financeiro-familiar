// Funções para adicionar modal sem mexer no arquivo principal
function setupModalDelecao() {
    // Adicionar CSS
    const css = `
        .modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.7); z-index: 10000;
            display: none; justify-content: center; align-items: center;
        }
        .modal-content {
            background: white; border-radius: 16px; padding: 0;
            max-width: 400px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .modal-header {
            background: linear-gradient(135deg, #ff4444 0%, #dc2626 100%);
            color: white; padding: 20px; text-align: center;
            border-radius: 16px 16px 0 0;
        }
        .modal-icon { font-size: 48px; margin-bottom: 10px; }
        .modal-title { font-size: 1.3em; font-weight: 600; margin: 0; }
        .modal-body { padding: 25px; text-align: center; }
        .modal-message { color: #333; line-height: 1.5; margin-bottom: 10px; }
        .modal-warning { color: #dc2626; font-weight: 600; font-size: 0.9em; }
        .modal-actions { display: flex; gap: 10px; padding: 0 25px 25px; justify-content: center; }
        .modal-btn { padding: 12px 25px; border: none; border-radius: 8px; 
            font-size: 16px; font-weight: 500; cursor: pointer; transition: all 0.2s ease; min-width: 100px; }
        .btn-cancel { background: #f3f4f6; color: #374151; }
        .btn-cancel:hover { background: #e5e7eb; transform: translateY(-1px); }
        .btn-delete { background: #ef4444; color: white; }
        .btn-delete:hover { background: #dc2626; transform: translateY(-1px); }
    `;
    
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    
    // Substituir função deleteTransaction APENAS
    window.deleteTransaction = function(id) {
        // Criar modal
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.style.display = 'flex';
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
                    <button class="modal-btn btn-cancel" onclick="cancelDeleteModal(this)">Cancelar</button>
                    <button class="modal-btn btn-delete" onclick="confirmDeleteModal(this, '${id}')">Excluir</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Fechar ao clicar fora
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                cancelDeleteModal(modal.querySelector('.btn-cancel'));
            }
        });
    };
    
    // Funções auxiliares
    window.cancelDeleteModal = function(button) {
        const modal = button.closest('.modal-overlay');
        document.body.removeChild(modal);
    };
    
    window.confirmDeleteModal = function(button, id) {
        if (window.deleteFromFirebase) {
            window.deleteFromFirebase('transactions', id)
                .then(() => console.log('Excluído'))
                .catch(err => alert('Erro: ' + err.message));
        }
        cancelDeleteModal(button);
    };
}

// Inicializar quando a página carregar
setTimeout(setupModalDelecao, 1000);