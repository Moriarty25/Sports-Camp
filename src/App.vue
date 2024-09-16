<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { onMounted, ref } from 'vue'
import { fetchComments, type Comment } from './api/comments'
import AppComment from './components/AppComment.vue'
import AppCommentForm from './components/AppCommentForm.vue'
import AppButton from './components/AppButton.vue'
import IconSort from './components/icons/IconSort.vue'
import IconStackedLines from './components/icons/IconStackedLines.vue'
import IconLoader from './components/icons/IconLoader.vue'

const commentsList = ref<Comment[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const commentText = ref('')
const defaultUserPhotoSrc =
	'https://photobooth.cdn.sports.ru/preset/avatars/svg/purple/en/j.svg?f=svg&q=80'

function handleReplyCommentSend(replyText: string, commentId: string) {
	const parentComment = commentsList.value.find((i) => i.id === commentId)

	if (!parentComment) return

	commentsList.value.push({
		id: uuidv4(),
		text: replyText,
		published: {
			bunin: 'сейчас'
		},
		rating: {
			plus: 0,
			minus: 0
		},
		parentComment: parentComment
			? {
					text: parentComment.text,
					author: parentComment.author,
					id: parentComment.id
				}
			: null,
		author: {
			nick: 'John Doe',
			id: uuidv4(),
			picture: {
				url: defaultUserPhotoSrc
			}
		}
	})
}

function handleCommentSend() {
	commentsList.value.push({
		id: uuidv4(),
		text: commentText.value,
		published: {
			bunin: 'сейчас'
		},
		rating: {
			plus: 0,
			minus: 0
		},
		parentComment: null,
		author: {
			nick: 'John Doe',
			id: uuidv4(),
			picture: {
				url: defaultUserPhotoSrc
			}
		}
	})
	commentText.value = ''
}

async function loadComments() {
	isLoading.value = true
	error.value = null

	try {
		const { comments } = await fetchComments()
		commentsList.value = comments ? comments : []
	} catch {
		error.value = 'Ошибка при загрузке комментариев с сервера'
	} finally {
		isLoading.value = false
	}
}

onMounted(async () => {
	await loadComments()
})
</script>

<template>
	<main class="comments">
		<div class="comments__title-wrapper">
			<div class="comments__title">
				<template v-if="isLoading">
					<IconLoader color="black" size="m" />
				</template>
				<template v-else>{{ commentsList.length }} </template>
				комментариев
			</div>
		</div>
		<div class="comments__header">
			<div class="comments__filter">
				<div class="comments__sort-options">
					<AppButton type="action" isSelected text="По дате" size="s" withIcon
						><IconSort
					/></AppButton>
					<AppButton type="action" text="Лучшие" size="s" />
					<AppButton type="action" text="Актуальные" size="s"></AppButton>
				</div>
				<div class="comments__view-toggle">
					<AppButton><IconStackedLines /></AppButton>
				</div>
			</div>
			<div class="comments__form">
				<AppCommentForm
					v-model="commentText"
					@send="handleCommentSend"
					placeholder="Написать комментарий..."
				/>
			</div>
		</div>
		<div v-if="isLoading" class="comments__list comments__list--loading">
			<IconLoader color="green" size="l" />
		</div>
		<div v-else class="comments__list">
			<div class="comments__list-item" v-for="item in commentsList" :key="item.id">
				<AppComment
					:id="item.id"
					:rating="item.rating"
					:text="item.text"
					:nickname="item.author.nick"
					:publishedAt="item.published.bunin"
					:parentComment="item.parentComment"
					:author="item.author"
					@replyCommentSend="handleReplyCommentSend"
				/>
			</div>
		</div>
	</main>
</template>

<style lang="scss" scoped>
.comments {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 24px;

	&__title {
		color: var(--black-700, #222);
		font-size: 22px;
		font-weight: 700;
		line-height: 28px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		display: flex;

		&-wrapper {
			display: flex;
			align-items: center;
			width: 100%;
		}
	}

	&__header {
		width: 100%;
		margin-top: 8px;
	}

	&__filter {
		display: flex;
		justify-content: space-between;
		width: 100%;
	}

	&__sort-options {
		display: flex;
		gap: 8px;
	}

	&__form {
		margin-top: 16px;
	}

	&__list {
		width: 100%;
		display: flex;
		flex-direction: column-reverse;
		margin-top: 16px;

		&-item {
			padding: 0 8px;
		}

		&--loading {
			align-items: center;
		}
	}
}

@media (max-width: 360px) {
	.comments {
		padding: 24px 12px;
	}

	.comments__sort-options {
		overflow-x: scroll;
		width: 80%;
	}
}

@media (min-width: 1024px) {
	.comments {
		padding: 64px 80px;
	}
}
</style>
