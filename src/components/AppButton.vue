<script setup lang="ts">
interface Props {
	type?: 'default' | 'action' | 'toggleVisibility'
	withIcon?: boolean
	isReply?: boolean
	isVoting?: boolean
	votingState?: 'plus' | 'minus'
	isActionButton?: boolean
	text?: string
	size?: 's' | 'm' | 'l'
	isSend?: boolean
	isSelected?: boolean
	handleCommentSend?: () => void
}

const { size, withIcon } = defineProps<Props>()
</script>

<template>
	<button
		type="button"
		class="button"
		:class="{
			'button--default': type === 'default',
			'button--action': type === 'action',
			
			'button--send': isSend,
			'button--voting': isVoting,
			'button--selected': isSelected,

			'button--size-s': size === 's',
			'button--size-m': size === 'm',
			'button--size-l': size === 'l',
			'button--upvoted': votingState === 'plus',
			'button--downvoted': votingState === 'minus',
			'button--toggle-visibility': type ==='toggleVisibility',
		}"
	>
		<span v-if="text" class="button__text">
			{{ text }}
		</span>
		<div v-if="withIcon" class="button__icon-with-text"><slot></slot></div>
		<template v-else><slot></slot></template>
	</button>
</template>

<style lang="scss" scoped>
.button {
	display: flex;
	justify-content: center;
	align-items: center;
	white-space: nowrap;
	border-radius: 4px;

	&:not([disabled]) {
		cursor: pointer;
	}

	&__text {
		text-align: center;
		font-size: 12px;
		font-weight: 700;
		line-height: 16px;
		text-transform: uppercase;
	}

	&--voting {
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		background: var(--grey-200, #f4f4f4);
	}

	&--default {
		padding: 8px;
		background: var(--grey-200, #f4f4f4);

		&:disabled {
			color: var(--grey-400, #d8d8d8);
		}

		@media (hover: hover) {
			&:not([disabled]):hover {
				background-color: var(--grey-300, #eaeaea);
			}
		}
	}

	&--action {
		display: flex;
		padding: 8px 16px;
		align-items: center;
		border-radius: 16px;
		text-align: center;
		text-transform: uppercase;
		background: inherit;
		color: var(--grey-600, #7f7f7f);

		&:disabled {
			background: var(--grey-500, #9b9b9b);
			color: var(--white-100, #fff);
		}

		@media (hover: hover) {
			&:not([disabled]):hover {
				color: var(--white-100, #fff);
				background: var(--mint-500, #00a876);
			}
		}
	}

	&--selected {
		color: var(--white-100, #fff);
		background: var(--mint-500, #00a876);
	}

	&--send {
		background: var(--mint-500, #00a876);
		color: var(--white-100, #fff);

		@media (hover: hover) {
			&:not([disabled]):hover {
				background: var(--grey-400, #4cc36f);
			}
		}
	}

	&--upvoted {
		background-color: var(----green-200, #d9f2e0);
		color: var(--mint-500, #00a876);

		@media (hover: hover) {
			&:not([disabled]):hover {
				background-color: var(----green-200, #d9f2e0);
			}
		}
	}

	&--downvoted {
		background-color: var(--magenta-200, #ffd9e2);
		color: var(--magenta-500, #ff003c);

		@media (hover: hover) {
			&:not([disabled]):hover {
				background-color: var(--magenta-200, #ffd9e2);
			}
		}
	}

	&__icon-with-text {
		display: flex;
		padding-left: 8px;
	}

	&--toggle-visibility {
		// //color: inherit;

		// @media (hover: hover) {
		// 	&:not([disabled]):hover {
		// 		opacity: 0.7;
		// 	}
		// }
	}

	&--size-s {
		padding: 4px 8px;
	}

	&--size-m {
		padding: 8px 16px;
	}

	&--size-l {
		padding: 8px 90px;
	}
}
</style>
