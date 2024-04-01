// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления
const minWeightInput = document.querySelector('.minweight__input');
const maxWeightInput = document.querySelector('.maxweight__input');

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = () => {
  //Очищаем список
  fruitsList.innerHTML = "";
  // TODO: очищаем fruitsList от вложенных элементов,
  // чтобы заполнить актуальными данными из fruits

  for (let i = 0; i < fruits.length; i++) {
    const elementsArray = document.createElement('li');
    elementsArray.innerHTML = `
<li class="fruit__item">
<div class="fruit__info">
<div>Название:${fruits[i].kind}</div>
<div>Цвет:${fruits[i].color}</div>
<div>Вес:${fruits[i].weight}</div>
</div>
</li>
`;
    fruitsList.appendChild(elementsArray)
    // TODO: формируем новый элемент <li> при помощи document.createElement,
    // и добавляем в конец списка fruitsList при помощи document.appendChild
  }
};

// первая отрисовка карточек
display(fruits);

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
  let result = [];

  // ATTENTION: сейчас при клике вы запустите бесконечный цикл и браузер зависнет
  while (fruits.length > 0) {
    // TODO: допишите функцию перемешивания массива
    //
    // Подсказка: находим случайный элемент из fruits, используя getRandomInt
    const randomElement = getRandomInt(0, fruits.length - 1);
    // вырезаем его из fruits и вставляем в result.
    const randomFruits = fruits.splice(randomElement, 1)[0]
    // ex.: [1, 2, 3], [] => [1, 3], [2] => [3], [2, 1] => [], [2, 1, 3]
    // (массив fruits будет уменьшатся, а result заполняться)
    //Добавляем результат randomFruits в конец массива result с помощью метода push
    result.push(randomFruits);
  }

  fruits = result;
};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display();
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
// TODO: допишите функцию
const filterFruits = () => {
  const minWeightFruit = parseInt(minWeightInput.value);
  const maxWeightFruit = parseInt(maxWeightInput.value);

  if (isNaN(minWeightFruit) || isNaN(maxWeightFruit)) {
    return alert('Введите корректное значение');
  }

  const resultFilter = [...fruits].filter((item) => {
    return item.weight >= minWeightFruit && item.weight <= maxWeightFruit;
  });

  fruits = resultFilter;
  display();
};

filterButton.addEventListener('click', () => {
  filterFruits();
  display();
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const comparationColor = (a, b) => {
  // TODO: допишите функцию сравнения двух элементов по цвету
  const priorityColor = ['желтый', 'светло-коричневый', 'розово-красный', 'фиолетовый', 'зеленый'];
  const priority1 = priorityColor.indexOf(a.color);
  const priority2 = priorityColor.indexOf(b.color);
  return priority1 > priority2;
};

const sortAPI = {
  bubbleSort(arr, comparation) {
    // TODO: допишите функцию сортировки пузырьком
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (comparation(arr[j], arr[j + 1]) > 0) {
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
        }
      }
    }
  },
  quickSort(arr, comparation) {
    // TODO: допишите функцию быстрой сортировки
    // функция обмена элементов
    if (arr.length <= 1) return arr;

    const pivotIndex = Math.floor(Math.random() * arr.length);
    const pivot = arr[pivotIndex];
    const less = [];
    const greater = [];

    for (let i = 0; i < arr.length; i++) {
      if (i === pivotIndex) continue;

      const element = arr[i];
      if (comparation(element, pivot) <= 0) {
        less.push(element);
      } else {
        greater.push(element);
      }
    }

    return [
      ...sortAPI.quickSort(less, comparation),
      pivot,
      ...sortAPI.quickSort(greater, comparation),
    ];
  },

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  // TODO: переключать значение sortKind между 'bubbleSort' / 'quickSort'
  if (sortKind === 'bubbleSort') {
    sortKind = 'quickSort';
  } else {
    sortKind = 'bubbleSort';
  }
  sortKindLabel.textContent = sortKind;
});

sortActionButton.addEventListener('click', () => {
  // TODO: вывести в sortTimeLabel значение 'sorting...'
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);
  // TODO: вывести в sortTimeLabel значение sortTime
  sortTimeLabel.textContent = sortTime;
  display();
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
  // TODO: создание и добавление нового фрукта в массив fruits
  // необходимые значения берем из kindInput, colorInput, weightInput
  // Создаем переменные, которые будут хранить значения из input
  const kindValue = kindInput.value;
  const colorValue = colorInput.value;
  const weightValue = parseFloat(weightInput.value);
  // Проверка ввода значений в поле
  if (kindValue === "" || colorValue === "" || isNaN(weightValue)) {
    alert('Введите корректные значения');
  } else {
    // Добавление объекта в конец массива fruits с помощью метода push
    fruits.push({
      "kind": kindValue,
      "color": colorValue,
      "weight": weightValue
    });
    display();
  }
});