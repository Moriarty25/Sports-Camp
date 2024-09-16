<script setup lang="ts">
import { ref } from 'vue'
import AppUserBadge from './AppUserBadge.vue'
import IconMinus from './icons/iconMinus.vue'
import IconMore from './icons/IconMore.vue'
import IconPlus from './icons/IconPlus.vue'
import IconPushpin from './icons/IconPushpin.vue'
import AppButton from './AppButton.vue'
import AppCommentForm from './AppCommentForm.vue'

interface Props {
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
const url = author.picture.url

const emit = defineEmits<{
	(event: 'update:selectedCommentId', value: string | null): void
	(event: 'replyCommentSend', text: string): void
}>()

const replyCommentText = ref('')
const isReplyFormExpanded = ref(false)

function handleReplyCommentSend() {
	emit('replyCommentSend', replyCommentText.value)
	replyCommentText.value = ''
	isReplyFormExpanded.value = false
}

const displayedRating = rating.plus - rating.minus

const showBtnValue = ref('Показать все')
const isExpandedAnswer = ref(false)
//onst isReplyFormExpanded = ref(false)

function toggleReplyForm() {
	console.log(
		'click',
		'was:',
		isReplyFormExpanded.value,
		'in:',
		!isReplyFormExpanded.value,
		'id:',
		id
	)
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
			<div class="user-info">
				<img :src="url" alt="user-photo" class="user-info__avatar" />
				<div class="user-info__details">
					<div class="user-info__name">
						<div class="user-info__nickname">
							{{ nickname }}
						</div>
						<div class="user-info__label">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 16 16"
								fill="none"
							>
								<path
									d="M14.6987 6.20491L14.9295 3.99884L12.903 3.09734L12.0018 1.07085L9.79575 1.30126L8 0L6.20458 1.30126L3.99884 1.07085L3.09734 3.09701L1.07085 3.99884L1.30126 6.20458L0 8L1.30126 9.79509L1.07052 12.0012L3.09701 12.9027L3.99818 14.9292L6.20425 14.6987L8 16L9.79542 14.6987L12.0012 14.9292L12.9027 12.903L14.9292 12.0012L14.6987 9.79542L16 8L14.6987 6.20491Z"
									fill="#00A876"
								/>
								<path
									d="M12 6.0622L6.84644 11L4 8.27273L5.10861 7.21053L6.84644 8.8756L10.8914 5L12 6.0622Z"
									fill="white"
								/>
							</svg>
						</div>
						<!-- <div class="user-info__status">Автор</div> -->
						<AppUserBadge>Редактор блога</AppUserBadge>
					</div>
					<time class="user-info__meta">{{ publishedAt }}</time>
				</div>
			</div>
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
					<AppButton type="default" isVoting votingState="minus">
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

.user-info {
	display: flex;
	align-items: center;
	display: flex;
	align-items: flex-start;
	gap: 12px;
	min-width: 0;

	&__avatar {
		width: 32px;
		height: 32px;
		aspect-ratio: 1;
		border-radius: 50%;
		background: lightgray 50% / cover no-repeat;
	}

	&__details {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		min-width: 0;
	}

	&__name {
		display: flex;
		align-items: center;
		gap: 8px;
		width: 100%;
		min-width: 0;
	}

	&__nickname {
		color: var(--black-700, #222);
		font-size: 14px;
		font-weight: 500;
		line-height: 16px;
		min-width: 0;
		width: 100%;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		min-width: 0;
		flex-shrink: 1;
		min-width: 0;
	}

	&__label {
		display: flex;
	}

	&__meta {
		color: var(--grey-600, #7f7f7f);
		font-size: 12px;
		font-weight: 400;
		line-height: 16px;
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
	.user-info {
		&__nickname {
			font-size: 16px;
			line-height: 20px;
		}

		&__meta {
			font-size: 14px;
			line-height: 20px;
		}
	}

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
