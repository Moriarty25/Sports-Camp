<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import IconClip from './icons/IconClip.vue'
import IconMoney from './icons/IconMoney.vue'
import IconPicture from './icons/IconPicture.vue'
import AppButton from './AppButton.vue'

interface Props {
	placeholder?: string
	isFormInReply?: boolean
}

const { isFormInReply } = defineProps<Props>()

const emit = defineEmits<{
	(event: 'send'): void
}>()

const model = defineModel<string>({ required: true })

const textareaRef = ref<HTMLTextAreaElement | null>(null)
const formRef = ref<HTMLFormElement | null>(null)
const isTextareaFocused = ref(isFormInReply)

function handleTextareaFocusin() {
	if (!isTextareaFocused.value) {
		isTextareaFocused.value = true
	}
}

function handleTextareaFocusout(event: FocusEvent) {
	setTimeout(() => {
		if (isFormInReply || model.value) return
		if (!event.relatedTarget || !formRef.value?.contains(event.relatedTarget as Node)) {
			isTextareaFocused.value = false
		}
	}, 100)
}

function handleEmitCommentSend() {
	emit('send')
	const textarea = textareaRef.value
	if (textarea) {
		textarea.style.height = 'auto'
	}
}

function autoResizeTextarea() {
	const textarea = textareaRef.value
	if (textarea) {
		textarea.style.height = 'auto'
		textarea.style.height = `${Math.min(textarea.scrollHeight, window.innerHeight * 0.3)}px`
	}
}

onMounted(() => {
	autoResizeTextarea()
})
</script>

<template>
	<form
		class="comment-form"
		@focusin="handleTextareaFocusin"
		@focusout="handleTextareaFocusout"
		ref="formRef"
	>
		<textarea
			ref="textareaRef"
			:placeholder="placeholder"
			class="comment-form__textarea"
			:class="{ 'comment-form__textarea--expanded': isTextareaFocused }"
			v-model="model"
			@input="autoResizeTextarea"
		>
		</textarea>
		<div
			class="comment-form__icons"
			:class="{ 'comment-form__icons--expanded': isTextareaFocused }"
			tabindex="-1"
		>
			<AppButton isActionButton>
				<IconMoney />
			</AppButton>
			<AppButton isActionButton>
				<IconClip />
			</AppButton>
			<AppButton isActionButton>
				<IconPicture />
			</AppButton>
		</div>
		<div tabindex="-1" class="comment-form__action-bar" v-show="isTextareaFocused">
			<span class="comment-form__guideline">
				<span>Пишите корректно и дружелюбно. </span>
				<a href="" class="comment-form__guideline-link"> Принципы нашей модерации</a>
			</span>
			<AppButton
				@click="handleEmitCommentSend"
				type="action"
				text="Отправить"
				isSend
				:disabled="!model"
			/>
		</div>
	</form>
</template>

<style lang="scss" scoped>
.comment-form {
	display: flex;
	width: 100%;
	align-items: center;
	background: var(--grey-200, #f4f4f4);
	border-radius: 16px;
	border: 0.5px solid var(--grey-300, #eaeaea);
	flex-direction: column;
	position: relative;

	&__textarea {
		min-height: 16px;
		max-height: 30vh;
		width: 100%;
		resize: none;
		padding: 12px 16px 0;
		color: var(--grey-900, #505050);
		font-family: Roboto;
		font-size: 16px;
		font-weight: 400;
		border-radius: 16px;
		transition: all 300ms ease;
		height: 48px;
		z-index: 2;
		background: transparent;
		border: 0.5px solid var(--grey-300, #eaeaea);
		cursor: pointer;

		&--expanded {
			padding-right: 8px;
			border-bottom-left-radius: 0;
			border-bottom-right-radius: 0;
			background: var(--white-100, #fff);
			border-bottom: 0;
		}
	}

	&__icons {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding: 12px 16px;
		right: 0;
		position: absolute;
		right: 16px;
		background: transparent;
		background: var(--grey-200, #f4f4f4);
		padding: 0;
		top: 8px;
		cursor: pointer;

		&--expanded {
			width: 100%;
			position: static;
			padding: 12px 16px;
			background: var(--white-100, #fff);
			cursor: text;
		}
	}

	&__action-bar {
		display: flex;
		gap: 16px;
		padding: 16px;
		justify-content: space-between;
		align-items: center;
		border-top: 0.5px solid var(--grey-300, #eaeaea);
		background: var(--grey-200, #f4f4f4);
		color: var(--color-grey-600, var(--grey-600, #7f7f7f));
		width: 100%;
		border-bottom-left-radius: 16px;
		border-bottom-right-radius: 16px;
	}

	&__guideline {
		font-size: 14px;
		font-weight: 400;
		line-height: 20px;
		cursor: default;

		&-link {
			color: var(--color-link, var(--grey-600, #006496));
			text-decoration: none;
		}
	}
}

@media (max-width: 360px) {
	.comment-form__icons:not(.comment-form__icons--expanded) {
		display: none;
	}

	.comment-form__action-bar {
		flex-direction: column;
	}
}
</style>
