import { setupDiary } from './modules/diary.js';
document.addEventListener("DOMContentLoaded", function () {
    Array.from(document.querySelectorAll('.diary')).forEach((arrayElement) => {
        setupDiary(arrayElement);
    });
});
//# sourceMappingURL=main.js.map