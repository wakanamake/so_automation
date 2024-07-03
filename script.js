document.addEventListener('DOMContentLoaded', (event) => {
    // 初期設定などを行う
});

let logs = [];

function logAction(action, result) {
    const timestamp = new Date().toLocaleString();
    logs.push(`[${timestamp}] ${action}: ${result}`);
    if (logs.length > 100) {
        logs.shift();
    }
}

function generateRandomUserId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let userId = '';
    for (let i = 0; i < 10; i++) {
        userId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return userId;
}

function fetchUserIds() {
    const selectedRows = document.querySelectorAll('.selectRow:checked');
    if (selectedRows.length === 0) {
        alert('IDを取得するには、エントリを選択してください。');
        logAction('ID取得', 'エントリが選択されていません');
        return;
    }

    selectedRows.forEach(row => {
        const userIdCell = row.parentElement.parentElement.cells[3];
        const userId = generateRandomUserId();
        userIdCell.textContent = userId;
    });

    logAction('ID取得', `取得したユーザID数: ${selectedRows.length}`);
}

function generateMockResults() {
    const mockResults = [];
    for (let i = 1; i <= 50; i++) {
        mockResults.push({
            ip: `192.168.1.${i}`,
            traffic: Math.floor(Math.random() * 100) + 1, // トラフィック量を1から100 Mbpsの範囲でランダムに設定
            userId: '', // 初期状態ではユーザIDは空
            status: '' // 初期状態では状態は空
        });
    }
    return mockResults;
}

function executeSearch() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const ipAddress = document.getElementById('ipAddress').value;
    const trafficThreshold = parseInt(document.getElementById('trafficThreshold').value);
    const searchCount = parseInt(document.getElementById('searchCount').value);
    const searchTimeout = document.getElementById('searchTimeout').value;

    const searchType = document.querySelector('input[name="searchType"]:checked');
    if (!searchType) {
        alert('「DNS」または「インターネット」を選択してください。');
        logAction('IP検索', '検索種別が選択されていません');
        return;
    }

    let mockResults = generateMockResults();

    if (ipAddress) {
        mockResults = mockResults.filter(result => result.ip === ipAddress);
    }

    if (!isNaN(trafficThreshold)) {
        mockResults = mockResults.filter(result => result.traffic >= trafficThreshold);
    }

    let resultsHtml = '';

    if (mockResults.length === 0) {
        resultsHtml = '<p>指定したIPアドレスが検索結果に存在しません。</p>';
    } else {
        resultsHtml = `
            <table>
                <thead>
                    <tr>
                        <th><input type="checkbox" id="selectAll" onclick="toggleSelectAll(this)"> 全選択</th>
                        <th>IPアドレス</th>
                        <th>通信量 (Mbps)</th>
                        <th>ユーザID</th>
                        <th>状態</th>
                    </tr>
                </thead>
                <tbody>
        `;

        mockResults.slice(0, searchCount).forEach((result, index) => {
            resultsHtml += `
                <tr>
                    <td><input type="checkbox" class="selectRow"></td>
                    <td>${result.ip}</td>
                    <td>${result.traffic}</td>
                    <td>${result.userId}</td>
                    <td>${result.status}</td>
                </tr>
            `;
        });

        resultsHtml += `
                </tbody>
            </table>
        `;
    }

    document.getElementById('results').innerHTML = resultsHtml;
    logAction('IP検索', `検索結果: ${mockResults.length}件`);
}

function toggleSelectAll(selectAllCheckbox) {
    const checkboxes = document.querySelectorAll('.selectRow');
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
}

function createStopSO() {
    const selectedRows = document.querySelectorAll('.selectRow:checked');
    if (selectedRows.length === 0) {
        alert('遮断するには、エントリを選択してください。');
        logAction('遮断', 'エントリが選択されていません');
        return;
    }

    let allUserIdsExist = true;
    let allStatusesValid = true;
    selectedRows.forEach(row => {
        const userIdCell = row.parentElement.parentElement.cells[3];
        const statusCell = row.parentElement.parentElement.cells[4];
        if (userIdCell.textContent === '') {
            allUserIdsExist = false;
        }
        if (statusCell.textContent !== '通信中') {
            allStatusesValid = false;
        }
    });

    if (!allUserIdsExist) {
        alert('すべての選択したエントリに対してユーザIDを取得してください。');
        logAction('遮断', 'ユーザIDが取得されていないエントリがあります');
        return;
    }

    if (!allStatusesValid) {
        alert('すべての選択したエントリが通信中であることを確認してください。');
        logAction('遮断', '通信中でないエントリがあります');
        return;
    }

    const now = new Date();
    const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;

    let csvContent = `RADIUS, STP, ユーザID, MEGAEGG, 日付(YYYYMMDD99999999)\n`;

    selectedRows.forEach(row => {
        const userId = row.parentElement.parentElement.cells[3].textContent;
        csvContent += `RADIUS, STP, ${userId}, MEGAEGG, ${timestamp}\n`;
    });

    alert(`SO内容：\n${csvContent}`);
    logAction('遮断', `生成されたSO数: ${selectedRows.length}`);
}

function createReleaseSO() {
    const selectedRows = document.querySelectorAll('.selectRow:checked');
    if (selectedRows.length === 0) {
        alert('解除するには、エントリを選択してください。');
        logAction('解除', 'エントリが選択されていません');
        return;
    }

    let allUserIdsExist = true;
    let allStatusesValid = true;
    selectedRows.forEach(row => {
        const userIdCell = row.parentElement.parentElement.cells[3];
        const statusCell = row.parentElement.parentElement.cells[4];
        if (userIdCell.textContent === '') {
            allUserIdsExist = false;
        }
        if (statusCell.textContent !== '停止中') {
            allStatusesValid = false;
        }
    });

    if (!allUserIdsExist) {
        alert('すべての選択したエントリに対してユーザIDを取得してください。');
        logAction('解除', 'ユーザIDが取得されていないエントリがあります');
        return;
    }

    if (!allStatusesValid) {
        alert('すべての選択したエントリが停止中であることを確認してください。');
        logAction('解除', '停止中でないエントリがあります');
        return;
    }

    const now = new Date();
    const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;

    let csvContent = `RADIUS, STP, ユーザID, MEGAEGG, 日付(YYYYMMDD99999999)\n`;

    selectedRows.forEach(row => {
        const userId = row.parentElement.parentElement.cells[3].textContent;
        csvContent += `RADIUS, STP, ${userId}, MEGAEGG, ${timestamp}\n`;
    });

    alert(`解除SO内容：\n${csvContent}`);
    logAction('解除', `生成された解除SO数: ${selectedRows.length}`);
}

function fetchStatus() {
    const selectedRows = document.querySelectorAll('.selectRow:checked');
    if (selectedRows.length === 0) {
        alert('状態を取得するには、エントリを選択してください。');
        logAction('状態取得', 'エントリが選択されていません');
        return;
    }

    let allUserIdsExist = true;
    selectedRows.forEach(row => {
        const userIdCell = row.parentElement.parentElement.cells[3];
        if (userIdCell.textContent === '') {
            allUserIdsExist = false;
        }
    });

    if (!allUserIdsExist) {
        alert('すべての選択したエントリに対してユーザIDを取得してください。');
        logAction('状態取得', 'ユーザIDが取得されていないエントリがあります');
        return;
    }

    selectedRows.forEach(row => {
        const statusCell = row.parentElement.parentElement.cells[4];
        statusCell.textContent = Math.random() > 0.5 ? '通信中' : '停止中';
    });

    logAction('状態取得', `取得した状態数: ${selectedRows.length}`);
}

function showLogs() {
    const logWindow = window.open('', 'logWindow', 'width=600,height=400');
    logWindow.document.write('<html><head><title>動作ログ</title></head><body>');
    logWindow.document.write('<h1>動作ログ</h1><pre>' + logs.join('\n') + '</pre>');
    logWindow.document.write('</body></html>');
}
