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

function executeSearch() {
    // 検索ロジックの実装
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const ipAddress = document.getElementById('ipAddress').value;
    const trafficThreshold = document.getElementById('trafficThreshold').value;
    const searchCount = document.getElementById('searchCount').value;
    const searchTimeout = document.getElementById('searchTimeout').value;

    // 仮の検索結果データ
    const mockResults = [
        { ip: '192.168.1.1', userId: 'userA', traffic: '15 Mbps' },
        { ip: '192.168.1.2', userId: 'userB', traffic: '10 Mbps' },
        { ip: '192.168.1.3', userId: 'userC', traffic: '20 Mbps' }
    ];

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

    mockResults.forEach((result, index) => {
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

    const ip = selectedRow.cells[0].textContent;
    const userId = selectedRow.cells[1].textContent;
    const traffic = selectedRow.cells[2].textContent;

    // 停止SO作成ロジックの実装
    alert(`停止SOが作成されました:\nIPアドレス: ${ip}\nユーザID: ${userId}\nトラフィック量: ${traffic}`);
}
