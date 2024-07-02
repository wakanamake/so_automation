document.addEventListener('DOMContentLoaded', (event) => {
    // 初期設定などを行う
});

function fetchUserIds() {
    const selectedRows = document.querySelectorAll('.selectRow:checked');
    if (selectedRows.length === 0) {
        alert('IDを取得するには、エントリを選択してください。');
        return;
    }

    let userIds = [];
    selectedRows.forEach(row => {
        const userId = row.parentElement.nextElementSibling.nextElementSibling.textContent;
        userIds.push(userId);
    });

    alert(`取得したユーザID: ${userIds.join(', ')}`);
}

function generateMockResults() {
    const mockResults = [];
    for (let i = 1; i <= 50; i++) {
        mockResults.push({
            ip: `192.168.1.${i}`,
            userId: `user${i}`,
            traffic: Math.floor(Math.random() * 100) + 1 // トラフィック量を1から100 Mbpsの範囲でランダムに設定
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
        alert('「DNS」または「その他」を選択してください。');
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
                </tr>
            `;
        });

        resultsHtml += `
                </tbody>
            </table>
        `;
    }

    document.getElementById('results').innerHTML = resultsHtml;
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
        return;
    }

    const now = new Date();
    const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;

    let csvContent = `RADIUS, STP, ユーザID, MEGAEGG, 日付(YYYYMMDD99999999)\n`;

    selectedRows.forEach(row => {
        const userId = row.parentElement.nextElementSibling.nextElementSibling.textContent;
        csvContent += `RADIUS, STP, ${userId}, MEGAEGG, ${timestamp}\n`;
    });

    alert(`SO内容：\n${csvContent}`);
}
