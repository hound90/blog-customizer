#### В основном файле - App

`const [articleState, setArticleState] = useState<ArticleStateType>(defaultArticleState);`

При загрузке приложения создается состояние `articleState` с начальными значениями из `defaultArticleState`
Эти значения включают: шрифт, размер текста, цвета, ширину контента

#### Применение стилей через CSS-переменные

`style={
	{
	'--font-family': articleState.fontFamilyOption.value,
	'--font-size': articleState.fontSizeOption.value,
	'--font-color': articleState.fontColor.value,
	'--container-width': articleState.contentWidth.value,
	'--bg-color': articleState.backgroundColor.value,
	} as CSSProperties
}>`

CSS-переменные устанавливаются непосредственно в элементе `<main>`.
При изменении `articleState` React перерисовывает компонент с новыми значениями.
Определяются две функции: `handleApply` для применения новых настроек и `handleReset`
для сброса настроек к состоянию по умолчанию.

#### Сайдбар и его работа

Компонент `ArticleParamsForm`

`ArticleParamsForm` принимает пропсы: `currentState`, `onApply`, `onReset`.

`const [isOpen, setIsOpen] = useState(false);
const [inputArticleStyleState, setInputArticleStyleState] = useState<ArticleStateType>(currentState);`

Внутри компонента есть состояние `isOpen` для отслеживания открытия/закрытия сайдбара и
`inputArticleStyleState` для хранения временного состояния формы (настроек, которые еще не применены).

---

`const sidebarRef = useRef<HTMLDivElement>(null);`
Используется `useRef` для получения ссылки на сайдбар, чтобы обрабатывать клики за его пределами.

---

`useEffect(() => {
	const handleClickOutside = (e: MouseEvent) => {
		if (
			isOpen &&
			sidebarRef.current &&
			!sidebarRef.current.contains(e.target as Node)
		) {
		setIsOpen(false);
		}
	};
	document.addEventListener('mousedown', handleClickOutside);
	return () => {
		document.removeEventListener('mousedown', handleClickOutside);
	};
}, [isOpen]);`
Эффект для закрытия сайдбара при клике вне его области: добавляется обработчик события `mousedown` на документ,
который проверяет, был ли клик вне сайдбара. Если да, то закрывает сайдбар

Обработчик `handleClickOutside` проверяет:
Открыт ли сайдбар `isOpen`
Существует ли ссылка на сайдбар `sidebarRef.current`
Был ли клик вне сайдбара `!sidebarRef.current.contains(e.target as Node)`
Если все условия true, то сайдбар закрывается `setIsOpen(false)`.

Перед каждым перезапуском эффекта и при размонтировании компонента, выполняется функция очистки,
удаляется обработчик события `mousedown` с документа.

Хук `useEffect` имеет зависимость `[isOpen]`. Это означает, что эффект будет перезапускаться каждый раз,
когда значение isOpen изменяется. Если сайдбар закрыт `isOpen = false`, то нет необходимости слушать клики вне сайдбара.

---

Второй `useEffect` синхронизирует состояние формы inputArticleStyleState с currentState при открытии формы и
при изменении currentState. Это нужно, чтобы форма всегда отображала актуальные настройки.

`useEffect(() => {
	setInputArticleStyleState(currentState);
}, [currentState, isOpen]);`

При каждом открытии сайдбара форма заполняется текущими настройками.

---

Функция onOptionSelected - это каррированная функция, которая возвращает обработчик для
изменения конкретного поля в inputArticleStyleState.

`const onOptionSelected = (field: keyof ArticleStateType) => (option: OptionType) => {
	setInputArticleStyleState(prev => ({
		...prev,
		[field]: option,
	}));
};`
При выборе опции обновляется только соответствующее поле

---

Функция handleSubmit вызывается при отправке формы (нажатии "Применить").
Она вызывает onApply с текущим состоянием формы и закрывает сайдбар.

`const handleSubmit = (event: React.FormEvent) => {
	event.preventDefault();
	onApply(inputArticleStyleState);
	setIsOpen(false);
};`

`onApply(inputArticleStyleState);` - Вызов колбэка из главного компонента
`setIsOpen(false)` - Закрытие сайдбара

Временные настройки передаются в главный компонент, сайдбар закрывается.

---

Функция handleReset сбрасывает состояние формы к значениям по умолчанию и
вызывает onReset (который в основном компоненте сбрасывает состояние статьи).

`const handleReset = () => {
	setInputArticleStyleState(defaultArticleState);
	onReset();
};`

`setInputArticleStyleState(defaultArticleState)` - Сброс формы
`onReset()` - Сброс в главном компоненте

Форма и статья возвращаются к начальным настройкам.

---

#### Структура возвращаемого

`return (
	<>
		{/* Содержимое */}
	</>
);`

---

`<ArrowButton isOpen={isOpen} onClick={handleToggle} />`
Отображается кнопка-стрелка для открытия/закрытия сайдбара
`isOpen={isOpen} `- передает текущее состояние (открыт/закрыт)
`onClick={handleToggle}` - обработчик переключения состояния

---

`<aside
  ref={sidebarRef}
  className={clsx(styles.container, { [styles.container_open]: isOpen })}
  aria-hidden={!isOpen}
  aria-label='Форма параметров статьи'>`

`ref={sidebarRef}`
Создает ссылку на DOM-элемент сайдбара

Базовый класс: `styles.container` - всегда применяется
Условный класс: `styles.container_open` - только когда `isOpen=true`

ARIA-атрибуты
`aria-hidden={!isOpen}` - скрывает сайдбар от скринридеров когда закрыт
`aria-label='Форма параметров статьи'` - описание для `accessibility`

---

`<form className={styles.form} onSubmit={handleSubmit}>`
Создает форму с обработчиком отправки `handleSubmit`
`onSubmit` предотвращает стандартное поведение браузера

---

Создает заголовок

`<Text as='h2' size={31} weight={800} uppercase>
  {title}
</Text>`

---

#### Компоненты выбора настроек

В качестве примера:
`<Select
	title='Шрифт'
	options={fontFamilyOptions}
	selected={inputArticleStyleState.fontFamilyOption}
	onChange={onOptionSelected('fontFamilyOption')}
/>`

`title` - заголовок для группы выбора
`options` - массив доступных шрифтов
`selected` - текущее выбранное значение из временного состояния
`onChange `- каррированная функция для обновления поля

Контейнер кнопок действий:

`<div className={styles.bottomContainer}>
  <Button
    title='Сбросить'
    htmlType='reset'
    type='clear'
    onClick={handleReset}
  />
  <Button 
    title='Применить' 
    htmlType='submit' 
    type='apply' 
  /> </div> `

Кнопка "Сбросить"
`onClick={handleReset}` - обработчик сброса к дефолтным настройкам

Кнопка "Применить"

`htmlType='submit'` - активирует обработчик `onSubmit` формы

---
