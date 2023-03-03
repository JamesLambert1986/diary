import { setupDiary } from './modules/diary';

document.addEventListener("DOMContentLoaded", function () {

  Array.from(document.querySelectorAll('.diary')).forEach((arrayElement:any) => {

    setupDiary(arrayElement);
  });

});