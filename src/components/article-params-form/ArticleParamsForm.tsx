import { useEffect, useState, useRef } from 'react';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { RadioGroup } from 'src/ui/radio-group';
import { Select } from 'src/ui/select';
import { Separator } from 'src/ui/separator';
import { Text } from 'src/ui/text';
import clsx from 'clsx';
import {
	OptionType,
	fontFamilyOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	fontSizeOptions,
	defaultArticleState,
	ArticleStateType,
} from 'src/constants/articleProps';

import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
	currentState: ArticleStateType;
	onApply: (state: ArticleStateType) => void;
	onReset: () => void;
};

export const ArticleParamsForm = (props: ArticleParamsFormProps) => {
	const { currentState, onApply, onReset } = props;
	const title = 'Задайте параметры';
	const [isOpen, setIsOpen] = useState(false);
	const sidebarRef = useRef<HTMLDivElement>(null);
	const [inputArticleStyleState, setInputArticleStyleState] =
		useState<ArticleStateType>(currentState);

	const handleToggle = () => {
		setIsOpen(!isOpen);
	};

	useEffect(() => {
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
	}, [isOpen]);

	useEffect(() => {
		setInputArticleStyleState(currentState);
	}, [currentState, isOpen]);

	const onOptionSelected =
		(field: keyof ArticleStateType) => (option: OptionType) => {
			setInputArticleStyleState((prev) => ({
				...prev,
				[field]: option,
			}));
		};

	const handleReset = () => {
		setInputArticleStyleState(defaultArticleState);
		onReset();
	};

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		onApply(inputArticleStyleState);
		setIsOpen(false);
	};

	return (
		<>
			<ArrowButton isOpen={isOpen} onClick={handleToggle} />
			<aside
				ref={sidebarRef}
				className={clsx(styles.container, { [styles.container_open]: isOpen })}
				aria-hidden={!isOpen}
				aria-label='Форма параметров статьи'>
				<form className={styles.form} onSubmit={handleSubmit}>
					<Text as='h2' size={31} weight={800} uppercase>
						{title}
					</Text>
					<Select
						title='Шрифт'
						options={fontFamilyOptions}
						selected={inputArticleStyleState.fontFamilyOption}
						onChange={onOptionSelected('fontFamilyOption')}
					/>
					<RadioGroup
						title='Размер шрифта'
						name='fontSize'
						options={fontSizeOptions}
						selected={inputArticleStyleState.fontSizeOption}
						onChange={onOptionSelected('fontSizeOption')}
					/>
					<Select
						title='Цвет шрифта'
						options={fontColors}
						selected={inputArticleStyleState.fontColor}
						onChange={onOptionSelected('fontColor')}
					/>
					<Separator />
					<Select
						title='Цвет фона'
						options={backgroundColors}
						selected={inputArticleStyleState.backgroundColor}
						onChange={onOptionSelected('backgroundColor')}
					/>
					<Select
						title='Ширина контента'
						options={contentWidthArr}
						selected={inputArticleStyleState.contentWidth}
						onChange={onOptionSelected('contentWidth')}
					/>
					<div className={styles.bottomContainer}>
						<Button
							title='Сбросить'
							htmlType='reset'
							type='clear'
							onClick={handleReset}
						/>
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
