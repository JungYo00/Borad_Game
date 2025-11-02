document.addEventListener('DOMContentLoaded', () => {
    // HTML에서 새로운 요소들을 가져옵니다.
    const decreaseBtn = document.getElementById('decreaseBtn');
    const increaseBtn = document.getElementById('increaseBtn');
    const countValueElement = document.getElementById('countValue');
    const confirmBtn = document.getElementById('confirmBtn');

    let currentCount = 1; // 기본 인원 1명
    const maxCount = 10; // 최대 인원 (예: 10명)
    const minCount = 1; // 최소 인원 1명

    // UI를 현재 카운트 상태로 업데이트하는 함수
    function updateUI() {
        countValueElement.textContent = currentCount;
        
        // 1명일 때 '-' 버튼 비활성화, 최대 인원일 때 '+' 버튼 비활성화
        decreaseBtn.disabled = (currentCount === minCount);
        increaseBtn.disabled = (currentCount === maxCount);
        
        // 인원수가 유효하므로 '선택 완료' 버튼은 항상 활성화
        confirmBtn.disabled = false;
    }

    // '+' 버튼 클릭 이벤트
    increaseBtn.addEventListener('click', () => {
        if (currentCount < maxCount) {
            currentCount++;
            updateUI();
        }
    });

    // '-' 버튼 클릭 이벤트
    decreaseBtn.addEventListener('click', () => {
        if (currentCount > minCount) {
            currentCount--;
            updateUI();
        }
    });

    // '선택 완료' 버튼 클릭 이벤트
    confirmBtn.addEventListener('click', () => {
        // (선택사항) 나중에 이 인원수 정보를 사용하기 위해 sessionStorage에 저장
        sessionStorage.setItem('headcount', currentCount);
        
        // main.html 페이지로 이동
        window.location.href = 'main.html';
    });

    // 페이지 로드 시 초기 UI 상태 설정
    updateUI();
});