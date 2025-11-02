// Firebase DB와 함수들을 가져옵니다.
import { db } from './firebase.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// --- HTML 요소 가져오기 ---
const boardgameListElement = document.getElementById('boardgameList');
const searchInputElement = document.getElementById('searchInput');
const searchButtonElement = document.getElementById('searchButton');

// DB에서 모든 게임 데이터를 저장할 배열
let allBoardgames = [];

/**
 * Firebase Firestore에서 모든 보드게임 데이터를 비동기적으로 불러오는 함수
 */
async function fetchBoardgames() {
    allBoardgames = []; // 배열 초기화
    try {
        const querySnapshot = await getDocs(collection(db, "boardgames"));
        querySnapshot.forEach((doc) => {
            // 문서 ID와 데이터를 함께 저장
            allBoardgames.push({ id: doc.id, ...doc.data() });
        });
        // 이름순으로 정렬
        allBoardgames.sort((a, b) => a.name.localeCompare(b.name));
        renderBoardgames(allBoardgames); // 데이터 로드 후 화면에 렌더링
    } catch (e) {
        console.error("Error fetching documents: ", e);
        boardgameListElement.innerHTML = '<p>보드게임 목록을 불러오는 데 실패했습니다.</p>';
    }
}

/**
 * 보드게임 목록을 화면에 렌더링하는 함수 (수정됨)
 */
function renderBoardgames(gamesToRender) {
    boardgameListElement.innerHTML = '';
    if (gamesToRender.length === 0) {
        boardgameListElement.innerHTML = '<p>표시할 보드게임이 없습니다.</p>';
        return;
    }
    gamesToRender.forEach(game => {
        const gameElement = document.createElement('div');
        gameElement.className = 'boardgame-item';

        // '대여' 버튼이 포함된 HTML로 수정
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
            <div class="boardgame-action">
                <button class="rent-btn" data-name="${game.name}">대여</button>
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
        renderBoardgames(allBoardgames); // 검색어가 없으면 전체 목록 표시
        return;
    }
    const filteredGames = allBoardgames.filter(game => 
        game.name.toLowerCase().includes(searchTerm)
    );
    renderBoardgames(filteredGames);
}

// --- 이벤트 리스너 설정 ---
searchButtonElement.addEventListener('click', handleSearch);
searchInputElement.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        handleSearch();
    }
});

// --- 페이지가 처음 로드될 때 Firebase에서 데이터 가져오기 ---
fetchBoardgames();

/**
 * '대여' 버튼 클릭 이벤트 처리 (이벤트 위임 방식)
 * 목록 전체(boardgameListElement)에 이벤트 리스너를 추가하여
 * 그 안의 .rent-btn 버튼이 클릭되는 것을 감지합니다.
 */
boardgameListElement.addEventListener('click', (event) => {
    // 클릭된 요소가 .rent-btn 클래스를 가지고 있는지 확인
    if (event.target.classList.contains('rent-btn')) {
        const gameName = event.target.dataset.name;
        
        // (가정) 모든 보드게임 대여료를 5,000원으로 통일합니다.
        // 나중에 admin 페이지에서 가격도 입력받도록 수정할 수 있습니다.
        const rentalPrice = 5000; 

        // 결제 페이지로 넘길 객체 생성
        const itemToPay = {
            name: `${gameName} (대여)`,
            price: rentalPrice
        };
        
        // 결제할 항목을 sessionStorage에 배열 형태로 저장
        // (지금은 1개만 넘기지만, 나중에 여러 개를 담는 '장바구니'로 확장할 수 있습니다.)
        sessionStorage.setItem('paymentItems', JSON.stringify([itemToPay]));
        
        // 결제 페이지로 이동
        window.location.href = 'payment.html';
    }
});

