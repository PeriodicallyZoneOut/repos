document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('mousedown', () => btn.classList.add('scale-95'));
  btn.addEventListener('mouseup', () => btn.classList.remove('scale-95'));
  btn.addEventListener('mouseleave', () => btn.classList.remove('scale-95'));
});
