export function defineFirstStep(): boolean {
  const a = Math.round(Math.random());

  return a == 0 ? true : false;
}

export function shuffle(array: Array<number>): Array<number> {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

export function checkIdentity(
  commonCard: number,
  cards: Array<number>
): boolean {
  let counterId = 0;
  let counterHi = 0;
  cards.forEach((card) => {
    if (card >= 0) {
      if (card == commonCard) {
        counterId++;
      }
      if (card > commonCard) {
        counterHi++;
      }
    }
  });
  if (counterId > 0 && counterHi == 0) {
    return true;
  } else return false;
}
