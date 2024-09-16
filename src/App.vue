<script setup lang="ts">
import AppComment from './components/AppComment.vue'
import AppCommentForm from './components/AppCommentForm.vue'
import IconClip from './components/icons/IconClip.vue'
import AppButton from './components/AppButton.vue'
import IconSort from './components/icons/IconSort.vue'
import IconStackedLines from './components/icons/IconStackedLines.vue'
import { onMounted, ref } from 'vue'
import { fetchComments, type Comment } from './api/comments'
import { v4 as uuidv4 } from 'uuid'

const items = ref<Comment[]>([])

const commentText = ref('')
const selectedCommentId = ref<string | null>(null)

function handleReplyCommentSend(replyText: string) {
	const parentComment = items.value.find((i) => i.id === selectedCommentId.value)

	if (!parentComment) {
		console.error(`Не нашли комментарий с id ${selectedCommentId.value}`)
		return
	}

	items.value.push({
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
			nick: 'User',
			id: '12323-id;e-e33e',
			picture: {
				url: 'https://photobooth.cdn.sports.ru/preset/user/b/fd/221f3f95349ef8cbcf1c156dd7460.png?f=png&h=64&q=80&w=64'
			}
		}
	})

	selectedCommentId.value = null
}

function handleCommentSend() {
	items.value.push({
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
			nick: 'User',
			id: '12e23r2r',
			picture: {
				url: 'https://photobooth.cdn.sports.ru/preset/user/b/fd/221f3f95349ef8cbcf1c156dd7460.png?f=png&h=64&q=80&w=64'
			}
		}
	})
	commentText.value = ''
}

function updateSelectedCommentId(newId: string | null) {
	selectedCommentId.value = newId
}

onMounted(async () => {
	items.value = await fetchComments()
})
</script>

<template>
	<main class="comments">
		<div class="comments__title-wrapper">
			<div class="comments__title">{{ items.length }} комментариев</div>
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
		<div class="comments__list">
			<div class="comments__list-item" v-for="item in items" :key="item.id">
				<AppComment
					:id="item.id"
					:rating="item.rating"
					:text="item.text"
					:nickname="item.author.nick"
					:publishedAt="item.published.bunin"
					:parentComment="item.parentComment"
					:author="item.author"
					@update:selectedCommentId="updateSelectedCommentId"
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

	&__view-toggle {
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

	header {
		display: flex;
		place-items: center;
		padding-right: calc(var(--section-gap) / 2);
	}

	.logo {
		margin: 0 2rem 0 0;
	}

	header .wrapper {
		display: flex;
		place-items: flex-start;
		flex-wrap: wrap;
	}
}
</style>
