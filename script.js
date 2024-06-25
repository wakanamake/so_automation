document.addEventListener('DOMContentLoaded', (event) => {
    // ユーザIDを自動的に設定する
    const userId = 'user123';  // ここで実際のユーザIDを取得する処理を追加
    document.getElementById('userId').value = userId;
});

function executeSearch() {
    // 検索ロジックの実装
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const ipAddress = document.getElementById('ipAddress').value;
    const userId = document.getElementById('userId').value;
    const trafficThreshold = document.getElementById('trafficThreshold').value;
    const searchCount = document.getElementById('searchCount').value;
    const searchTimeout = document.getElementById('searchTimeout').value;

    // 検索結果の表示
    document.getElementById('results').innerHTML = `
        <p>開始の日付: ${startDate}</p>
        <p>終了の日付: ${endDate}</p>
        <p>IPアドレス: ${ipAddress}</p>
        <p>ユーザID: ${userId}</p>
        <p>トラフィックしきい値: ${trafficThreshold} Mbps</p>
        <p>検索件数: ${searchCount}</p>
        <p>検索タイムアウト: ${searchTimeout} 秒</p>
    `;
}

function createStopSO() {
    // 停止SO作成ロジックの実装
    alert('停止SOが作成されました。');
}

