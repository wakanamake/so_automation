document.addEventListener('DOMContentLoaded', (event) => {
    // 初期設定などを行う
});

function fetchUserId() {
    const ipAddress = document.getElementById('ipAddress').value;

    // ここで実際のIPアドレスに基づくユーザIDを取得する処理を追加
    // ダミーデータを使用した例
    const userIdMap = {
        '192.168.1.1': 'userA',
        '192.168.1.2': 'userB',
        '192.168.1.3': 'userC'
    };

    const userId = userIdMap[ipAddress] || '不明なユーザ';
    // ユーザIDを使用する場合は、必要に応じてこの値を利用
    console.log('User ID:', userId);
}

function generateMockResults() {
    const mockResults = [];
    for (let i = 1; i <= 50; i++) {
        mockResults.push({
            ip: `192.168.1.${i}`,
            userId: `user${i}`,
            traffic: `${Math.floor(Math.random() * 100) + 1} Mbps`
        });
    }
    return mockResults;
}

function executeSearch() {
    // 検索ロジックの実装
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const ipAddress = document.getElementById('ipAddress').value;
    const trafficThreshold = document.getElementById('trafficThreshold').value;
    const searchCount = document.getElementById('searchCount').value;
    const searchTimeout = document.getElementById('searchTimeout').value;

    // 仮の検索結果データを生成
    const mockResults = generateMockResults();

    // 検索結果の表示
    let resultsHtml = `
        <table>
            <thead>
                <tr>
                    <th>IPアドレス</th>
                    <th>ユーザID</th>
                    <th>トラフィック量</th>
                </tr>
            </thead>
            <tbody>
    `;

    mockResults.slice(0, searchCount).forEach((result, index) => {
        resultsHtml += `
            <tr onclick="selectRow(this)" data-index="${index}">
                <td>${result.ip}</td>
                <td>${result.userId}</td>
                <td>${result.traffic}</td>
            </tr>
        `;
    });

    resultsHtml += `
            </tbody>
        </table>
    `;

    document.getElementById('results').innerHTML = resultsHtml;
}

function selectRow(row) {
    // 他の選択を解除
    const rows = document.querySelectorAll('#results tr');
    rows.forEach(r => r.classList.remove('selected'));

    // 選択をトグル
    row.classList.add('selected');
}

function createStopSO() {
    // 選択されたエントリを取得
    const selectedRow = document.querySelector('#results tr.selected');
    if (!selectedRow) {
        alert('停止SOを作成するには、エントリを選択してください。');
        return;
    }

    const userId = selectedRow.cells[1].textContent;
    const now = new Date();
    const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;

    const csvContent = `RADIUS, STP, ${userId}, MEGAEGG, ${timestamp}`;
    
    // アラートメッセージにCSVの内容を出力
    alert(`SO内容:\n${csvContent}`);
}
