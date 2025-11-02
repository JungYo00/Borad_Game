import { db } from './firebase.js';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

const addForm = document.getElementById('addGameForm');
const gameListAdmin = document.getElementById('gameListAdmin');

/**
 * Firebase에서 보드게임 목록을 불러와 관리자 목록에 렌더링
 */
async function loadGames() {
    gameListAdmin.innerHTML = '<p>목록을 불러오는 중...</p>';
    try {
        const gamesRef = collection(db, "boardgames");
        const q = query(gamesRef, orderBy("name")); // 이름순으로 정렬
        const querySnapshot = await getDocs(q);
        
        gameListAdmin.innerHTML = ''; // 목록 비우기
        if (querySnapshot.empty) {
            gameListAdmin.innerHTML = '<p>등록된 보드게임이 없습니다.</p>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const game = doc.data();
            const gameId = doc.id;

            const item = document.createElement('div');
            item.className = 'game-item-admin';
            item.setAttribute('data-id', gameId);
            item.innerHTML = `
                <h3>${game.name}</h3>
                <p>(${game.players} / ${game.difficulty})</p>
            `;
            
            // 삭제 이벤트 리스너 추가
            item.addEventListener('click', () => deleteGame(gameId, game.name));
            
            gameListAdmin.appendChild(item);
        });
    } catch (e) {
        console.error("Error loading games: ", e);
        gameListAdmin.innerHTML = '<p>목록을 불러오는 데 실패했습니다.</p>';
    }
}

/**
 * 보드게임 추가
 */
addForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('gameName').value;
    const players = document.getElementById('gamePlayers').value;
    const difficulty = document.getElementById('gameDifficulty').value;
    const image = document.getElementById('gameImage').value;
    const description = document.getElementById('gameDescription').value;
    
    if (!name) {
        alert('보드게임 이름은 필수입니다.');
        return;
    }

    try {
        await addDoc(collection(db, "boardgames"), {
            name: name,
            players: players,
            difficulty: difficulty,
            image: image,
            description: description
        });
        
        alert(`'${name}'이(가) 성공적으로 추가되었습니다.`);
        addForm.reset(); // 폼 초기화
        loadGames(); // 목록 새로고침
        
    } catch (e) {
        console.error("Error adding document: ", e);
        alert('게임 추가에 실패했습니다.');
    }
});

/**
 * 보드게임 삭제
 */
async function deleteGame(id, name) {
    // 실수로 삭제하는 것을 방지하기 위해 확인창
    if (!confirm(`'${name}'을(를) 정말 삭제하시겠습니까?`)) {
        return;
    }
    
    try {
        await deleteDoc(doc(db, "boardgames", id));
        alert(`'${name}'이(가) 삭제되었습니다.`);
        loadGames(); // 목록 새로고침
    } catch (e) {
        console.error("Error deleting document: ", e);
        alert('삭제에 실패했습니다.');
    }
}

// 페이지 로드 시 게임 목록 불러오기
loadGames();