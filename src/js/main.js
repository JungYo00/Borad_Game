// --- 샘플 보드게임 데이터 ---
// 실제로는 이 데이터를 Firebase Firestore에서 불러오는 방식으로 구현할 수 있습니다.
const boardgames = [
    {
        name: "카탄",
        players: "3-4인",
        difficulty: "보통",
        description: "자원을 모아 섬을 개척하고 가장 먼저 10점을 달성하는 사람이 승리하는 클래식 전략 게임입니다.",
        image: "https://placehold.co/100x100/E8BB44/FFFFFF?text=Catan"
    },
    {
        name: "스플렌더",
        players: "2-4인",
        difficulty: "쉬움",
        description: "보석 토큰을 모아 카드를 구매하고, 귀족 타일을 획득하여 명성을 쌓는 엔진 빌딩 게임입니다.",
        image: "https://placehold.co/100x100/3498DB/FFFFFF?text=Splendor"
    },
    {
        name: "클루",
        players: "3-6인",
        difficulty: "쉬움",
        description: "저택에서 일어난 살인 사건의 범인, 흉기, 장소를 추리하여 사건을 해결하는 추리 게임입니다.",
        image: "https://placehold.co/100x100/C0392B/FFFFFF?text=Clue"
    },
    {
        name: "루미큐브",
        players: "2-4인",
        difficulty: "쉬움",
        description: "같은 색의 연속된 숫자나 다른 색의 같은 숫자로 타일 조합을 만들어 가장 먼저 모든 타일을 내려놓으면 승리합니다.",
        image: "https://placehold.co/100x100/2ECC71/FFFFFF?text=Rummikub"
    },
    {
        name: "테라포밍 마스",
        players: "1-5인",
        difficulty: "어려움",
        description: "기업을 운영하며 화성을 인간이 살 수 있는 환경으로 바꾸는 복잡하고 깊이 있는 전략 게임입니다.",
        image: "https://placehold.co/100x100/E67E22/FFFFFF?text=Terraforming+Mars"
    },
    // 여기에 100개 이상의 보드게임 데이터를 추가할 수 있습니다.
];


// --- HTML 요소 가져오기 ---
const boardgameListElement = document.getElementById('boardgameList');
const searchInputElement = document.getElementById('searchInput');
const searchButtonElement = document.getElementById('searchButton');


/**
 * 보드게임 목록을 화면에 렌더링하는 함수
 * @param {Array} gamesToRender - 화면에 표시할 보드게임 데이터 배열
 */
function renderBoardgames(gamesToRender) {
    // 목록을 비웁니다.
    boardgameListElement.innerHTML = '';

    // 데이터가 없으면 메시지를 표시합니다.
    if (gamesToRender.length === 0) {
        boardgameListElement.innerHTML = '<p>검색 결과가 없습니다.</p>';
        return;
    }

    // 각 보드게임에 대한 HTML을 생성하여 추가합니다.
    gamesToRender.forEach(game => {
        const gameElement = document.createElement('div');
        gameElement.className = 'boardgame-item';

        gameElement.innerHTML = `
            <div class="boardgame-image-container">
                <img src="${game.image}" alt="${game.name}" class="boardgame-image" onerror="this.src='https://placehold.co/100x100/cccccc/FFFFFF?text=Image+Not+Found'">
            </div>
            <div class="boardgame-details">
                <h2>${game.name}</h2>
                <div class="boardgame-meta">
                    <span>👥 ${game.players}</span>
                    <span>⭐ ${game.difficulty}</span>
                </div>
                <p class="boardgame-description">${game.description}</p>
            </div>
        `;
        boardgameListElement.appendChild(gameElement);
    });
}


/**
 * 입력된 검색어로 보드게임 데이터를 필터링하는 함수
 */
function handleSearch() {
    const searchTerm = searchInputElement.value.toLowerCase().trim();

    if (searchTerm === '') {
        renderBoardgames(boardgames); // 검색어가 없으면 전체 목록 표시
        return;
    }

    const filteredGames = boardgames.filter(game => 
        game.name.toLowerCase().includes(searchTerm)
    );

    renderBoardgames(filteredGames);
}


// --- 이벤트 리스너 설정 ---
searchButtonElement.addEventListener('click', handleSearch);

// Enter 키를 눌러도 검색이 되도록 설정
searchInputElement.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        handleSearch();
    }
});


// --- 페이지가 처음 로드될 때 전체 보드게임 목록을 표시 ---
renderBoardgames(boardgames);
