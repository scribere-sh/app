import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';

import ButtonTest from './button.test.svelte';

describe('Button', () => {
	test('Without href should render <button>', () => {
		const effectCleanup = $effect.root(() => {
			const InnerText = 'Test Button';

			render(ButtonTest, {
				testString: InnerText,
				'data-testid': 'button'
			});

			const button = screen.getByTestId('button');

			expect(button.innerHTML).toContain(InnerText);
			expect(button.nodeName).toEqual('BUTTON');
		});

		effectCleanup();
	});

	test('With href should render <a>', () => {
		const effectCleanup = $effect.root(() => {
			const InnerText = 'Test Button';
			const TestLink = '#';

			render(ButtonTest, {
				testString: InnerText,
				href: TestLink,
				'data-testid': 'button'
			});

			const button = screen.getByTestId('button');

			expect(button.innerHTML).toContain(InnerText);
			expect(button).toHaveAttribute('href', TestLink);
			expect(button.nodeName).toEqual('A');
		});

		effectCleanup();
	});
});
