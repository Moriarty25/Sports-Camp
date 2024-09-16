<script setup lang="ts">
import { ref } from 'vue'
import IconMinus from './icons/iconMinus.vue'
import IconMore from './icons/IconMore.vue'
import IconPlus from './icons/IconPlus.vue'
import IconPushpin from './icons/IconPushpin.vue'
import AppButton from './AppButton.vue'
import AppCommentForm from './AppCommentForm.vue'
import AppCommentUserInfo from './AppCommentUserInfo.vue'

interface Props {
	withBadge?: boolean
	isPinned?: boolean
	id: string
	rating: {
		plus: number
		minus: number
	}
	text: string
	nickname: string
	publishedAt: string
	author: { nick: string; id: string; picture: { url: string } }
	parentComment: {
		text: string
		author: { nick: string; id: string; picture: { url: string } }
		id: string
	} | null
}

const { isPinned, rating, id, author } = defineProps<Props>()

const emit = defineEmits<{
	(event: 'update:selectedCommentId', value: string | null): void
	(event: 'replyCommentSend', text: string): void
}>()

const displayedRating = rating.plus - rating.minus
const showBtnValue = ref('Показать все')
const isExpandedAnswer = ref(false)
const replyCommentText = ref('')
const isReplyFormExpanded = ref(false)

function handleReplyCommentSend() {
	emit('replyCommentSend', replyCommentText.value)
	replyCommentText.value = ''
	isReplyFormExpanded.value = false
}



function toggleReplyForm() {
	emit('update:selectedCommentId', id)
	isReplyFormExpanded.value = !isReplyFormExpanded.value
}

function toggleShowBtn() {
	isExpandedAnswer.value = !isExpandedAnswer.value
	showBtnValue.value = showBtnValue.value === 'Показать все' ? 'Скрыть' : 'Показать все'
}
</script>

<template>
	<div class="comment">
		<div v-if="isPinned" class="pinned-comment">
			<IconPushpin />
			<div class="pinned-comment__author">Закрепленно пользователем Хуан</div>
		</div>
		<div class="comment__toolbar">
			<AppCommentUserInfo :nickname :publishedAt :author/>
			<AppButton isActionButton>
				<IconMore />
			</AppButton>
		</div>
		<div class="comment__body">
			<div v-if="parentComment" class="comment-answer">
				<div class="comment-answer__header">
					<span class="comment-answer__label">Ответ </span>
					<span class="comment-answer__nickname">{{ parentComment.author.nick }}</span>
				</div>
				<div class="comment-answer__content">
					<span
						class="comment-answer__text"
						:class="{ ' comment-answer__text--expanded': isExpandedAnswer }"
					>
						{{ parentComment.text }}
					</span>
					<AppButton
						v-show="parentComment.text.length > 40"
						class="comment-answer__show-btn"
						@click="toggleShowBtn"
						type="toggleVisibility"
					>
						{{ showBtnValue }}</AppButton
					>
				</div>
			</div>
			<div class="comment-content">
				{{ text }}
			</div>
			<div class="comment__actions">
				<AppButton type="default" text="Ответить" @click="toggleReplyForm" />
				<div class="rating">
					<AppButton type="default" isVoting>
						<div class="voting-icon">
							<IconPlus />
						</div>
					</AppButton>
					<div class="rating__view">
						<div class="rating-value">{{ displayedRating }}</div>
					</div>
					<AppButton type="default" isVoting>
						<div class="voting-icon">
							<IconMinus />
						</div>
					</AppButton>
				</div>
			</div>
			<div v-if="isReplyFormExpanded" class="comment__answer-form">
				<AppCommentForm
					v-model="replyCommentText"
					@send="handleReplyCommentSend"
					placeholder="Написать комментарий..."
					isFormInReply
				/>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.comment {
	width: 100%;
	min-width: 0;
	display: flex;
	padding: 16px 0;
	flex-direction: column;
	align-items: flex-start;
	border-bottom: 0.5px solid var(--grey-300, #eaeaea);

	&__toolbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: nowrap;
		display: flex;
		gap: 8px;
		width: 100%;
		padding: 8px 0px;
	}

	&__body {
		margin-top: 8px;
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	&__actions {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		margin-top: 16px;
	}

	&-content {
		color: var(--black-700, #222);
		font-size: 14px;
		font-weight: 400;
		line-height: 20px;
	}

	&-answer {
		border-left: 2px solid var(--grey-300, #eaeaea);
		padding-left: 12px;
		margin-bottom: 8px;

		&__header {
			color: var(--grey-600, #7f7f7f);
			font-size: 14px;
			font-weight: 500;
			line-height: 24px;
		}

		&__label {
			font-weight: 400;
		}

		&__nickname {
			font-weight: 500;
		}

		&__content {
			color: var(--grey-900, #505050);
			font-size: 12px;
			font-weight: 400;
			line-height: 20px;
		}

		&__text {
			display: block;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			max-width: 100%;

			&--expanded {
				white-space: normal;
			}
		}

		&__show-btn {
			color: var(--grey-900, #505050);

			@media (hover: hover) {
				&:not([disabled]):hover {
					color: var(--grey-600, #7f7f7f);
				}
			}
		}
	}

	&__answer-form {
		height: auto;
		margin-top: var(--ui-margin-2xs, 12px);
		transition: height 0.4s linear;
	}
}

.more-btn {
	cursor: pointer;
	width: 32px;
	height: 32px;
	border-radius: 16px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.rating {
	display: flex;
	align-items: center;
	gap: 4px;

	&__view {
		display: flex;
		width: 48px;
		height: 32px;
		justify-content: center;
		align-items: center;
	}

	&-value {
		color: var(--mint-500, #00a876);
		text-align: center;
		font-size: 14px;
		font-weight: 700;
		line-height: 24px;
	}
}

.pinned-comment {
	display: flex;
	align-items: flex-start;
	gap: 8px;

	&__author {
		color: var(--grey-600, #7f7f7f);
		font-size: 10px;
		font-weight: 400;
		line-height: 16px;
	}
}

.voting-icon {
	display: flex;
	width: 12px;
	height: 12px;
	align-items: center;
}

@media (max-width: 360px) {
	.comment__actions {
		flex-direction: column-reverse;
		align-items: flex-start;
		gap: 16px;
	}
}

@media (min-width: 1024px) {
	.comment-content {
		font-size: 16px;
		line-height: 24px;
	}

	.comment-answer__content {
		font-size: 14px;
		line-height: 24px;
	}
}
</style>
